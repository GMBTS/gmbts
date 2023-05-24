import { Complaint } from '@prisma/client';
import { wrapGetServerSidePropsWithSentry } from '@sentry/nextjs';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';

import { prisma } from '@/db/prisma';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

const EditComplaint: React.FC<{ complaint: Complaint }> = ({ complaint }) => {
  return (
    <div>
      <h1>Edit Complaint</h1>
    </div>
  );
};

export default EditComplaint;

const getProps: GetServerSideProps = async (context) => {
  const complaintId = context?.params?.complaintId;
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!complaintId || typeof complaintId !== 'string' || !session?.user?.id) {
    return {
      notFound: true,
    };
  }

  const complaint = await prisma.complaint.findUnique({
    where: {
      complaintId,
    },
  });

  const isAllowed = session?.user?.id === complaint?.authorId;

  if (!isAllowed && session?.user?.email !== process.env.SUPPER_DUPER_ADMIN_EMAIL) {
    return {
      notFound: true,
    };
  }

  if (!complaint) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      complaint: {
        ...complaint,
        createdAt: complaint.createdAt.toISOString(),
      },
    },
  };
};

export const getServerSideProps = wrapGetServerSidePropsWithSentry(getProps, '/complaint/[complaintId]/edit');
