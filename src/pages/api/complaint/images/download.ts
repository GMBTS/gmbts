import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).send('Method not allowed');
    return;
  }

  if (!req.query.url || typeof req.query.url !== 'string') {
    res.status(404).send('Not found');
    return;
  }

  const splittedPath = req.query.url.split('/');
  const originalName = splittedPath[splittedPath.length - 1];
  const strippedDownPath = splittedPath.slice(0, splittedPath.length - 1).join('/');

  const filePath = path.resolve(__dirname, `../../../../../../uploads/${strippedDownPath}/400-${originalName}`);
  let imageBuffer;
  if (fs.existsSync(filePath)) {
    imageBuffer = fs.readFileSync(filePath);
  } else {
    const originalImagePath = path.resolve(__dirname, `../../../../../../uploads/${req.query.url}`);
    imageBuffer = fs.readFileSync(originalImagePath);
  }

  res.setHeader('Content-Type', 'image/jpg');
  res.send(imageBuffer);
}
