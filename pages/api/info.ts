// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const item = req.body.url;
  const link = item.split("/");
  if (link.findIndex((i: string) => i === "pd") == -1) {res.status(400).send("not valid link"); return}
const product_code = link[link.findIndex((i: string) => i === "pd") + 1]
  const data = await axios.get(`https://sapi.emag.ro/products/${product_code}?did=158bad1790c60a2f&no_supermarket=1&refreshed=true&templates%5B%5D=custom_lite`, {
    headers: {
      "referer": item.link,
      "User-Agent": "eMag/4.3.1 (moto g(7) power; Android 12; phone; 720x1520)",
      "x-app-version": "ANDROID-4.3.1",
      "x-request-source": "mobile-app",
      "x-tokens": "eyJ1c2VyX2lkIjoyMzA4MTU3MzQxMTU5NDQzNzE1LCJsYW5nX2NvZGVfa2V5IjoidzVzUllzT0ZaSG5DdWNLNnc1SENzSHhzSzBIQ2lzTzR3NFhEbkhZeEJNT0lWSDdEZ3pKdmZzS3NTeWpDZ2NLNkNNT2RiY0t3d29YQ3NqckNpWFhDcmlrM1JGSENuY0tzUEdOMUxjT2JZY0tWdzVva1NzS2F3NGJDdlJiRHVTYkRxUlBDbXNLUkFDVTROa1wvQ3NSc0ZIVnpEdkE9PSIsInV1aWQiOiIxNjc5NTc5NzQxLTcwNzQ0ODA4My00NTQxMyIsInRva2VuMSI6IjE0YzNjNzExOGRlMDQwYzg5NDM1YjU1OThmMmU3ZGNkNDExY2RkNDRhMjFjMDQwZDk4MWU1NDc2NTg3ZTZhNjMiLCJkaWQiOiIxNThiYWQxNzkwYzYwYTJmIn0=",
      "x-deviceid": "1679579740-256-28986",
      "x-app-screen-id": "931de4df-fd05-4180-9000-9b252343dc76"
    }
  })

  let res_data = { name: data.data.data.name, price: data.data.metadata.price_current, img: data.data.data.image.original, offers: data.data.data.used_offers }
  
  res.json(res_data)
}
