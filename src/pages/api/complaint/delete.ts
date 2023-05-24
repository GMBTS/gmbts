import { wrapApiHandlerWithSentry } from '@sentry/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

import { prisma } from '@/db/prisma';

import { authOptions } from '../auth/[...nextauth]';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (req.method !== 'DELETE') {
    res.status(405).send('Method not allowed');
    return;
  }

  if (!session?.user?.id) {
    res.status(401).send('Unauthorized');
    return;
  }

  if (!req.query.complaintId || Array.isArray(req.query.complaintId)) {
    res.status(400).send('No complaintId provided');
    return;
  }

  const { complaintId } = req.query;

  const complaint = await prisma.complaint.findUnique({
    where: {
      complaintId: complaintId,
    },
  });

  if (!complaint || complaint.authorId !== session.user.id) {
    res.status(404).send('Complaint not found');
    return;
  }

  await prisma.complaint.delete({
    where: {
      complaintId: complaintId,
    },
  });

  await res.revalidate('/feed');
  res.status(200).send('Complaint deleted');
}

export default wrapApiHandlerWithSentry(handler, '/api/complaint/delete');
