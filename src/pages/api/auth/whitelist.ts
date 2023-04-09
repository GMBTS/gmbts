import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

import { prisma } from '@/db/prisma';

import { authOptions } from './[...nextauth]';

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

  const { new_email: newEmail } = req.body;

  if (!newEmail) {
    res.status(400).send('No email was provided.');
    return;
  }

  const userWithId = await prisma.user.findUnique({
    where: {
      email: newEmail,
    },
  });

  if (!userWithId) {
    res.status(400).send('No user with that email.');
    return;
  }

  await prisma.whiteListAccounts.create({
    data: {
      accountId: userWithId.id,
      id: userWithId.id,
    },
  });
}
