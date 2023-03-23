// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next'
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const url = req.body?.url;

    const {data} = await client.get(url, {
      headers: {
        "User-Agent": req.headers['user-agent']
      }
    })
    res.send(data)
      // res.write(text);
  } catch (error) {
    console.log(error);
    res.status(500).end("500 Internal Server Error")
  }
}
