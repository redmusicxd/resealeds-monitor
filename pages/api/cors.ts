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
    const host = req.headers.host

    let req_headers = req.headers;

    delete req_headers.accept;
    delete req_headers['content-type'];
    delete req_headers['content-length'];
    delete req_headers.origin;
    delete req_headers.referer;
    delete req_headers.host;

    const { data, headers, config }: { data: string, headers: { [k: string]: string[] }, config: any } = await client.get(url, {
      headers: {
        ...req_headers,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Cookie": req.headers.cookie,
        "User-Agent": req.headers['user-agent'],
        "upgrade-insecure-requests": 1,
        "sec-fetch-user": "?1",
        "sec-fetch-site": "none",
        "sec-fetch-mode": "navigate",
        "sec-fetch-dest": "document"
      }
    })

    res.writeHead(200, {...headers, "set-cookie": headers['set-cookie']?.map(a => a?.replace(".emag.ro", host!?.replace(":3000", ""))?.replace("secure;", "")) }).end(data)
    // res.send(data)
    // res.write(text);
  } catch (error) {
    console.log(error);
    res.status(500).end("500 Internal Server Error")
  }
}
