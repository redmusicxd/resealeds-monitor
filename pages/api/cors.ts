// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const url = req.body?.url
    // console.log(url);
    
      const response = await fetch(url, {
        // method: req.method,
        // body: req.body,
      });
    const text = await response.arrayBuffer();
    
      const headers = new Headers();
      headers.set("Access-Control-Allow-Origin", "*");
      res.writeHead(200, {
        'Content-Length': Buffer.byteLength(text),
        'Content-Type': 'text/plain',
        "Access-Control-Allow-Origin": "*"
      }).end(Buffer.from(text))
      // res.write(text);
  } catch (error) {
    console.log(error);
    res.status(500).end("500 Internal Server Error")
  }
}
