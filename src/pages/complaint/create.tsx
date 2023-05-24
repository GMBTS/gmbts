import Head from 'next/head';
import { useSession } from 'next-auth/react';
import React from 'react';

import CreateComplaintForm from '@/client/components/complaint/create';

const CreateComplaintPage = () => {
  const { status } = useSession();

  if (status === 'loading') {
    return null;
  }

  if (status === 'unauthenticated') {
    return <p>Access Denied</p>;
  }

  return (
    <>
      <Head>
        <title>GMBTS | Complaints - Create</title>
      </Head>

      <div style={{ height: 'calc(100vh - 48px)', display: 'flex', flexDirection: 'column' }}>
        <CreateComplaintForm />
      </div>
    </>
  );
};

export default CreateComplaintPage;
