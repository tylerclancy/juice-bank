import Link from 'next/link';
import { useContext, useState } from 'react';
import { UserContext } from '../lib/context';
import AuthCheck from '../components/AuthCheck';
import { firestore, getUserWithUsername, auth } from '../lib/firebase';
import firebase from 'firebase/app';
import toast from 'react-hot-toast';

import { Text, Button } from '@nextui-org/react';

export default function Home(props) {
  const { username } = useContext(UserContext);
  const [juiceCount, setJuiceCount] = useState(0);

  console.log(username);

  async function depositJuice(amount) {
    const docRef = firestore.collection('users').doc(auth.currentUser.uid);

    docRef.update({
      balance: firebase.firestore.FieldValue.increment(amount)
    });
    setJuiceCount(0);
    toast.success('Juice added!');
  }

  return (
    <section className='juicer'>
    <AuthCheck>

      <Button ripple rounded color='gradient' size='xl' onClick={() => setJuiceCount(juiceCount + 1)}>CLICK ME</Button>
      <Text color='white' h1>⚡{juiceCount}</Text>
      <Button size='sm' color='gradient' css={{marginTop: '1rem'}} onClick={()=> depositJuice(juiceCount)}>Desposit</Button>

    </AuthCheck>
    </section>
  )
}
