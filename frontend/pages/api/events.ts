import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';

const handler = nextConnect();

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  console.log('POST');
  console.log(req.body);
  
  res.status(400).json({ test: 'woot' });
});

export default handler;
