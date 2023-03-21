import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
const { Storage } = require('@google-cloud/storage');
import { createProxyMiddleware } from 'http-proxy-middleware'; // @2.0.6
import nextConnect from 'next-connect';

const storage = new Storage({
  keyFilename: path.join(__dirname, '../../../../../../credentials.json'),
  projectId: 'gmtbs-jlm',
});

const proxy = (url: string) =>
  createProxyMiddleware({
    target: url,
    secure: false,
    ignorePath: true,
    changeOrigin: true,
  });

function createDownloadMiddleware(url: string) {
  const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({});

  apiRoute.use(proxy(url));

  return apiRoute;
}
const bucket = storage.bucket('gmbts');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).send('Method not allowed');
    return;
  }

  const options = {
    version: 'v4',
    action: 'read',
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  };

  try {
    const [signedUrl] = await bucket.file(req.query.url).getSignedUrl(options);

    createDownloadMiddleware(signedUrl).run(req, res);
  } catch (err) {
    res.status(500).send({
      message: 'Could not download the file. ' + err,
    });
  }
}
