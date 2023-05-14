import S3 from 'aws-sdk/clients/s3';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).send('Method not allowed');
    return;
  }

  if (!req.query.url || typeof req.query.url !== 'string') {
    res.status(404).send('Not found');
    return;
  }

  const s3 = new S3({
    apiVersion: '2006-03-01',
  });

  try {
    const signedURL = await s3.getSignedUrlPromise('getObject', {
      Bucket: process.env.BUCKET_NAME,
      Key: req.query.url,
      Expires: 60,
    });

    res.status(200).send(signedURL);
  } catch (error) {
    console.error(error);

    res.status(500).send('Internal server error');
    return;
  }
}
