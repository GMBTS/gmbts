import S3 from 'aws-sdk/clients/s3';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import nextConnect from 'next-connect';
import * as uuid from 'uuid';

import { prisma } from '@/db/prisma';

import { authOptions } from '../auth/[...nextauth]';

type ExtendedNextApiRequest = NextApiRequest & {
  files: Express.MulterS3.File[];
  context: {
    userId: string;
    complaintId: string;
  };
};

const multerHandler = (s3: S3) =>
  multer({
    storage: multerS3({
      s3: s3, // todo make this singleton
      bucket: process.env.BUCKET_NAME ?? '',

      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname, orignalName: file.originalname });
      },
      key: function (req, file, cb) {
        const realReq = req as unknown as ExtendedNextApiRequest;

        const userId = realReq.context.userId;
        const complaintId = realReq.context.complaintId;
        cb(null, `${userId}/${complaintId}/${file.fieldname}`);
      },
    }),
    limits: {
      fileSize: 10 * 1024 * 1024,
      files: 5,
    },
  });

function createUploadMiddleware(s3: S3) {
  const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
    onError(error, req, res) {
      res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
    },
    onNoMatch(req, res) {
      res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
  });

  apiRoute.use(multerHandler(s3).any());

  return apiRoute;
}

export default async function handler(req: ExtendedNextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.id) {
    res.status(401).send('Unauthorized');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).send('Method not allowed');
    return;
  }

  const complaintId = uuid.v4();

  const mwreq = req as ExtendedNextApiRequest;
  mwreq.context = { userId: session.user.id, complaintId };

  const s3 = new S3({
    apiVersion: '2006-03-01',
  });

  await createUploadMiddleware(s3).run(mwreq, res);

  if (!req.files) {
    res.status(400).send('No files were uploaded.');
    return;
  }

  const paths = req.files.map((file) => file.key);

  const formData = JSON.parse(req.body.formData) as {
    title: string;
    content: string;
    licensePlate: string;
    featuredImage: string;
  }; // todo share the type wit the form

  const complaint = await prisma.complaint.create({
    data: {
      complaintId,
      title: formData.title,
      content: formData.content,
      licensePlate: formData.licensePlate,
      authorId: session.user.id,
      featuredImage: formData.featuredImage,
    },
  });

  await prisma.complaint.update({
    where: {
      complaintId: complaint.complaintId,
    },
    data: {
      images: paths,
    },
  });

  await res.revalidate('/feed');

  res.status(200).send({ results: true });
}

export const config = { api: { bodyParser: false } };
