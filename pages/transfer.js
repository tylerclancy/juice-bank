import { auth, firestore, googleAuthProvider } from '../lib/firebase';
import { UserContext } from '../lib/context';
import firebase from 'firebase/app';
import { useEffect, useState, useCallback, useContext } from 'react';
import debounce from 'lodash.debounce';
import { Text, Button } from '@nextui-org/react';
import { getUserWithUsername } from '../lib/firebase.js';
import toast from 'react-hot-toast';

export default function Transfer(props) {
  return (
    <section className='transfer'>
      <TransferForm />
    </section>
  );
}

function TransferForm() {
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

    const senderDoc = firestore.collection('users').doc(auth.currentUser.uid);

    const docRef = await firestore.collection('usernames').doc(formValue).get();
    const docData = docRef.data();
    console.log(docData.uid);

    const playerDoc = firestore.collection('users').doc(docData.uid);
    // console.log(playerDoc);

    senderDoc.update({
      balance: firebase.firestore.FieldValue.increment(-(e.target.funds.value))
    });
    playerDoc.update({
      balance: firebase.firestore.FieldValue.increment(e.target.funds.value)
    });

    // console.log(player);
    toast.success('Sent successfully!');

  }

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

const checkUsername = useCallback(
  debounce(async (username) => {
    if (username.length >= 3) {
      const ref = firestore.doc(`usernames/${username}`);
      const { exists } = await ref.get();
      console.log('Firestore read executed');
      setIsValid(exists);
      setLoading(false);
    }
  }, 500),
  []
);

  return (
      <div className='items'>
        <h3>Choose Recipient</h3>
        <form onSubmit={handleSubmit}>

          <input name='username' placeholder='username' value={formValue} onChange={handleChange} />

          <UsernameMessage username={formValue} isValid={isValid} loading={loading} />

          <input name='funds' placeholder='amount' />

          <Button type='submit' disabled={!isValid} color='gradient'>
            Send!
          </Button>
        </form>
      </div>
  );
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking for user...</p>
  } else if (isValid) {
    return <p className='text-success'>{username} is ready for funds!</p>;
  } else if (username && !isValid) {
    return <p className='text-danger'>User does not exist...</p>;
  } else {
    return <p></p>;
  }
}
