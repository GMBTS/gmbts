import { Inter } from 'next/font/google';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import styles from '@/styles/Home.module.css';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Give me back the sidewalk</title>
        <meta name="description" content="Give me back the sidewalk" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <main className={styles.main}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 20,
            }}
          >
            main page we need to get our sidewalk back!
            <Link href="/feed">go to feed</Link>
            <Link href="/complaint/create">Create a new complaint</Link>
          </div>
        </main>
        asd asd
      </div>
    </>
  );
}
