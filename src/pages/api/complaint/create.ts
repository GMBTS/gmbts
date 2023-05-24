import { wrapApiHandlerWithSentry } from '@sentry/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';

import { prisma } from '@/db/prisma';
import { CreateComplaintPayload } from '@/types/complaints/create';

import { authOptions } from '../auth/[...nextauth]';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.id) {
    res.status(401).send('Unauthorized');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).send('Method not allowed');
    return;
  }

  const formData = req.body as CreateComplaintPayload; // add this as assertion / joi validation

  const complaint = await prisma.complaint.create({
    data: {
      complaintId: formData.complaintId,
      title: formData.title,
      content: formData.content,
      licensePlate: formData.licensePlate,
      authorId: session.user.id,
      featuredImage: formData.featuredImage,
      images: formData.imageKeys,
      location: JSON.stringify(formData.location),
      asamakhta: formData.asamakhta,
    },
  });

  await res.revalidate('/feed');

  res.status(200).send(complaint);
}

export default wrapApiHandlerWithSentry(handler, '/api/complaint/create');
