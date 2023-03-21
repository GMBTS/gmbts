import { Storage } from '@google-cloud/storage';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import path from 'path';
import { format } from 'util';

const multerHandler = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 5,
  },
});

const storage = new Storage({
  keyFilename: path.join(__dirname, '../../../../../credentials.json'),
  projectId: 'gmtbs-jlm',
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
  await storage.getBuckets();
  const bucket = storage.bucket('gmbts');

  await createUploadMiddleware().run(req, res);

  if (!req.files) {
    res.status(400).send('No files were uploaded.');
    return;
  }

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

  const formData = JSON.parse(req.body.formData) as { title: string; content: string };

  const complaint = await prisma.complaint.create({
    data: {
      title: formData.title,
      content: formData.content,
      authorId: user.userId,
    },
  });

  const promisees = req.files.map(async (file) => {
    const fileName = `accounts/${user?.userId}${bucket.name}/${complaint.complaintId}/${file.originalname}`;
    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream();

    const path = await new Promise<string>((resolve, reject) => {
      let publicUrl = '';
      blobStream.on('error', (err) => {
        reject('error');
      });

      blobStream.on('finish', () => {
        publicUrl = format(fileName);
        return resolve(publicUrl);
      });

      blobStream.end(file.buffer);
    });

    return path;
  });

  const results = await Promise.all(promisees);

  await prisma.complaint.update({
    where: {
      complaintId: complaint.complaintId,
    },
    data: {
      images: results,
    },
  });

  res.status(200).send({ results });
}

export const config = { api: { bodyParser: false } };
