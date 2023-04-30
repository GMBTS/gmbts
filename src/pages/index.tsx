import { Button, Typography } from '@mui/material';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';

import styles from '@/styles/Home.module.css';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const { data: session } = useSession();

  return (
    <>
      {session?.user?.email ? null : <Button onClick={() => signIn()}>singe In</Button>}
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
            <Typography style={{ textAlign: 'center', fontWeight: 600 }} variant="h3">
              Give me back the sidewalk!
            </Typography>
            <Button component={Link} href="/feed" variant="outlined">
              go to feed
            </Button>
            <Button component={Link} href="/complaint/create" variant="outlined">
              Create a new complaint
            </Button>
          </div>
        </main>
      </div>
    </>
  );
}
