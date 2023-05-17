import S3 from 'aws-sdk/clients/s3';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import * as uuid from 'uuid';

import { CreateComplaintPayload } from '@/types/complaints/create';

import { authOptions } from './auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).send('Method not allowed');
    return;
  }
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.id || session?.user?.email !== process.env.SUPPER_DUPER_ADMIN_EMAIL) {
    res.status(401).send('Unauthorized');
    return;
  }

  // todo add validation to the body

  const s3 = new S3({
    apiVersion: '2006-03-01',
  });

  const files = req.body.files as string[];
  const complaintId = uuid.v4();

  const posts = await Promise.all(
    files.map(async (file) => {
      return s3.createPresignedPost({
        Bucket: process.env.BUCKET_NAME,
        Fields: {
          key: `${session.user.id}/${complaintId}/${file}`,
          'Content-Type': 'image/jpeg',
        },
        Expires: 60 * 3,
        Conditions: [
          ['content-length-range', 0, 1048576 * 5], // up to 5 MB
        ],
      });
    }),
  );

  res.status(200).json({ posts, complaintId });
}
