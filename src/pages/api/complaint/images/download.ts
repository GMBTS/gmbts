import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).send('Method not allowed');
    return;
  }
  debugger;
  const filePath = path.resolve(__dirname, `../../../../../../uploads/${req.query.url}`);
  const imageBuffer = fs.readFileSync(filePath);

  res.setHeader('Content-Type', 'image/jpg');
  res.send(imageBuffer);
}
