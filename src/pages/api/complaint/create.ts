import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import multer from 'multer';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import path from 'path';
import * as uuid from 'uuid';

const multerHandler = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const user = req.context.user;
      const complaintId = req.context.complaintId;

      const balayAudPath = path.join(__dirname, `../../../../../uploads/${user.userId}/${complaintId}`);

      fs.mkdirSync(balayAudPath, { recursive: true });
      cb(null, balayAudPath);
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 5,
  },
});

function createUploadMiddleware() {
  const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
    onError(error, req, res) {
      res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
    },
    onNoMatch(req, res) {
      res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
  });

  apiRoute.use(multerHandler.any());

  return apiRoute;
}

export default async function handler(req: NextApiRequest & { files: Express.Multer.File[] }, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).send('Method not allowed');
    return;
  }

  const prisma = new PrismaClient();
  const complaintId = uuid.v4();

  let user = await prisma.user.findFirst({});

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'test@gmail.com',
        name: 'test',
      },
    });
  }

  if (!user) {
    res.status(500).send('No user found');
    return;
  }

  const mwreq = req as NextApiRequest & { context?: unknown };
  mwreq.context = { user, complaintId };

  await createUploadMiddleware().run(mwreq, res);

  if (!req.files) {
    res.status(400).send('No files were uploaded.');
    return;
  }

  for (const file of req.files) {
    console.log('File path: ', file.path);
    console.log('File name: ', file.originalname);
  }

  const paths = req.files.map((file) => file.path.split('uploads')[1]);
  debugger;
  const formData = JSON.parse(req.body.formData) as { title: string; content: string };

  const complaint = await prisma.complaint.create({
    data: {
      complaintId,
      title: formData.title,
      content: formData.content,
      authorId: user.userId,
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

  res.status(200).send({ results: true });
}

export const config = { api: { bodyParser: false } };
