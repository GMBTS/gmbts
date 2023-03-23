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

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   try {
//     const filePath = path.join(__dirname, 'myfile.mp3');

//     const { size } = fs.statSync(filePath);

//     res.writeHead(200, {
//       'Content-Type': 'audio/mpeg',
//       'Content-Length': size,
//     });

//     const readStream = fs.createReadStream(filePath);

//     await new Promise(function (resolve) {
//       readStream.pipe(res);

//       readStream.on('end', resolve);
//     });
//   } catch (err) {
//     res.status(500).send({
//       message: 'Could not download the file. ' + err,
//     });
//   }
// }
