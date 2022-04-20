import Link from 'next/link';
import { Button } from '@nextui-org/react';

export default function Custom404() {
  return (
    <section className='juicer'>
      <h1>404 - That page doesn't seem to exist...</h1>
      <iframe src="https://giphy.com/embed/ZNnQvIYzIBmZAbrBR7" width="480" height="270" frameBorder="0" className="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/boomerangtoons-boomerang-garfield-and-friends-ZNnQvIYzIBmZAbrBR7">via GIPHY</a></p>
      <Link href='/'>
        <Button>Take me home</Button>
      </Link>
    </section>
  );
}
