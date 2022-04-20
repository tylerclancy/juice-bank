import AuthCheck from '../components/AuthCheck';
import { auth, firestore, googleAuthProvider } from '../lib/firebase';
import { UserContext } from '../lib/context';
import { Text, Button } from '@nextui-org/react';
import Link from 'next/link';

// UI component for user's profile.
export default function UserProfile({ user }) {
  return (
    <section className='juicer'>
    <AuthCheck>

        <img src={user.photoURL} className='card-img-center' />
        <p>
          <i>@{user.username}</i>
        </p>
        <h1>BALANCE: {user.balance}</h1>
        <Button color='gradient' onClick={() => auth.signOut()}>Log out</Button>
        <Link href='/transfer'><Button color='gradient' css={{marginTop: '30px;'}}>Transfer Units</Button></Link>
    </AuthCheck>
    </section>
  );
}
