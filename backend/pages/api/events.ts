import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';

interface HasuraEventRequest extends NextApiRequest {
  body: {
    event: {
      session_variables: { 'x-hasura-role': string };
      op: 'INSERT' | 'UPDATE' | 'DELETE' | 'MANUAL';
      data: { old: any; new: any };
      trace_context: { trace_id: number; span_id: number };
    };
    created_at: string;
    id: string;
    delivery_info: { max_retries: number; current_retry: number };
    trigger: { name: string };
    table: { schema: string; name: string };
  };
}

const handler = nextConnect();

handler.post(async (req: HasuraEventRequest, res: NextApiResponse) => {
  console.log(req.body);

  res.status(200).json({ test: 'woot' });
});

export default handler;
