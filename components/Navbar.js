import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '../lib/context';

import { Text, Button } from '@nextui-org/react';

export default function Navbar() {

  const { user, username } = useContext(UserContext);

  return (
    <nav className='navbar'>
      <ul>
        <li>
          <Link href='/'>
            <Text
              h1
              size={40}
              css={{
                textGradient: '45deg, $blue500 -20%, $pink500 50%',
              }}
              weight='bold'
            >JUICE BANK</Text>
          </Link>
        </li>

        {/* User is signed in and has username */}
        {username && (
          <>
            <li className='push-left'>
              <Link href={`/${username}`}>
                <Button color='gradient' shadow>VIEW ACCOUNT</Button>
              </Link>
            </li>
          </>
        )}

        {/* User is not signed in or has not created username */}
        {!username && (
          <li>
            <Link href='/login'>
              <Button color='gradient' shadow>LOG IN</Button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  )
}
