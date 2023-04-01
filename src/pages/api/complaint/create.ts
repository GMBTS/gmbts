import { PrismaClient } from '@prisma/client';
import amqp from 'amqplib';
import fs from 'fs';
import multer from 'multer';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import nextConnect from 'next-connect';
import path from 'path';
import * as uuid from 'uuid';

import { authOptions } from '../auth/[...nextauth]';

var channel: amqp.Channel, connection: amqp.Connection; //global variables
async function connectQueue() {
  if (channel && connection) return;
  try {
    connection = await amqp.connect('amqp://localhost:5672');
    channel = await connection.createChannel();

    await channel.assertQueue('test-queue-1');
  } catch (error) {
    console.log(error);
  }
}

connectQueue();

async function sendData(paths: string[]) {
  return channel.sendToQueue('test-queue-1', Buffer.from(JSON.stringify(paths)));
}

type ExtendedNextApiRequest = NextApiRequest & {
  files: Express.Multer.File[];
  context: {
    userId: string;
    complaintId: string;
  };
};

const multerHandler = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const realReq = req as unknown as ExtendedNextApiRequest;

      const userId = realReq.context.userId;
      const complaintId = realReq.context.complaintId;

      const balayAudPath = path.join(__dirname, `../../../../../uploads/${userId}/${complaintId}`);

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

  const prisma = new PrismaClient();
  const complaintId = uuid.v4();

  const mwreq = req as ExtendedNextApiRequest;
  mwreq.context = { userId: session.user.id, complaintId };

  await createUploadMiddleware().run(mwreq, res);

  if (!req.files) {
    res.status(400).send('No files were uploaded.');
    return;
  }

  const paths = req.files.map((file) => file.path.split('uploads')[1]);

  const formData = JSON.parse(req.body.formData) as { title: string; content: string; licensePlate: string }; // todo share the type wit the form

  const complaint = await prisma.complaint.create({
    data: {
      complaintId,
      title: formData.title,
      content: formData.content,
      licensePlate: formData.licensePlate,
      authorId: session.user.id,
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
  await sendData(paths);

  res.status(200).send({ results: true });
}

export const config = { api: { bodyParser: false } };
