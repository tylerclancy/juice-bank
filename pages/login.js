import { auth, firestore, googleAuthProvider } from '../lib/firebase';
import { UserContext } from '../lib/context';

import { useEffect, useState, useCallback, useContext } from 'react';
import debounce from 'lodash.debounce';
import { Text, Button } from '@nextui-org/react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

export default function Login(props) {
  const { user, username } = useContext(UserContext);

  // 1. User signed out <SignInButton />
  // 2. User signed in, but missing username <UsernameForm />
  // 3. User signed in, has username <SignOutButton />

  return (
    <div>
      {user ?
        !username ? <UsernameForm /> : <SignOutButton />
        :
        <SignInButton />
      }
    </div>
  );
}

function SignInButton() {
  const router = useRouter();
  const signInWithGoogle = async () => {
    await auth.signInWithPopup(googleAuthProvider);
    router.push('/');
    toast.success('Logged in successfully!');
  }

  return (
    <section className='juicer'>
      <Button color='gradient' onClick={signInWithGoogle}>
        Sign in with Google
      </Button>
    </section>
  )
}

function SignOutButton() {
  return <section className='juicer'><Button onClick={() => auth.signOut()}>Sign Out</Button></section>;
}

function UsernameForm() {
  const [formValue, setFormValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username } = useContext(UserContext);

  const handleChange = (e) => {
    // Force form value typed in form to match correct format.
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set form value if length is < 3 or it passes regex.
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create refs for both documents
    const userDoc = firestore.doc(`users/${user.uid}`);
    const usernameDoc = firestore.doc(`usernames/${formValue}`);

    // Commit both docs together as a batch write.
    const batch = firestore.batch();
    batch.set(userDoc, { username: formValue, photoURL: user.photoURL, displayName: user.displayName, balance: 10 });
    batch.set(usernameDoc, { uid: user.uid });

    await batch.commit();
  }

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

// Hit database for username match after each debounced change.
// useCallback is required for debounce to work.
const checkUsername = useCallback(
  debounce(async (username) => {
    if (username.length >= 3) {
      const ref = firestore.doc(`usernames/${username}`);
      const { exists } = await ref.get();
      console.log('Firestore read executed');
      setIsValid(!exists);
      setLoading(false);
    }
  }, 500),
  []
);


  return (
    !username && (
      <section className='juicer'>
        <h3>Choose Username</h3>
        <form onSubmit={handleSubmit}>

          <input name='username' placeholder='username' value={formValue} onChange={handleChange} />

          <UsernameMessage username={formValue} isValid={isValid} loading={loading} />

          <Button type='submit' disabled={!isValid} color='gradient'>
            Choose
          </Button>
        </form>
      </section>
    )
  );
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking...</p>
  } else if (isValid) {
    return <p className='text-success'>{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className='text-danger'>That username is taken!</p>;
  } else {
    return <p></p>;
  }
}
