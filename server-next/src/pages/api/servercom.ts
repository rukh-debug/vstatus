// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { kv } from '@vercel/kv';
import ServerResponse from '@/types/ServerResponse';
import VScomeReqData from '@/types/VScomReqData';
// This is to communicate with vscode to server


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ServerResponse>
) {
  // lets handle auth here itself for now.
  if (req.headers.authKey !== process.env.UNIQUE_API_KEY) {
    return res.status(401).json({
      message: "Authorization failed, Please provide correct api key",
      status: false
    });
  }

  if (req.method === 'POST') {
    let body: VScomeReqData = req.body;
    console.log(typeof body);
    await kv.set(
      "vstat",
      JSON.stringify(body),
    );
    res.status(200).json({ message: "Data received", status: true });
  } else {
    res.status(401).json({ message: "You can only send post request", status: false });
  }
}