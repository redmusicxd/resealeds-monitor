// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
 try {
   await axios.post("https://resealedcheck.kodeeater.xyz/checkemagupdate", {})
   res.send("updating");
 } catch (error) {
   res.status(500).send("Internal Server Error");
 }
}