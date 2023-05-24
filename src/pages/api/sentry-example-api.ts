import { wrapApiHandlerWithSentry } from '@sentry/nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  throw new Error('This is an example error from the API 3');
  res.status(200).json({ name: 'John Doe' });
};

export default wrapApiHandlerWithSentry(handler, '/api/sentry-example-api');
