// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient, PostgrestResponse } from '@supabase/supabase-js'
import axios from 'axios';
import { load } from 'cheerio';

import { UUID } from "crypto";

interface IMonitoredProducts {
  id?: number,
  created_at?: Date,
  updated_at?: Date,
  name: string,
  link: string,
  user_id: UUID,
  img: string,
  price: number,
  offers: []
}
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function updateProduct(item: IMonitoredProducts, new_offer: Record<string, any>) {
  await supabase.from("monitored_products").update({ offers: item.offers, updated_at: new Date() }).eq("id", item.id);
  await axios.post(`https://ntfy.kodeeater.xyz/resealed-monitoring-${item.user_id.slice(0, 8)}`, `Resigilat nou eMAG!! \n ${item.name} \n ${new_offer?.description.offer} \n ${new_offer?.price.current} Lei`)
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const oneHourBefore = new Date();
  oneHourBefore.setMinutes(oneHourBefore.getMinutes() - 60);
  const { data } = (await supabase.from("monitored_products").select("*").lte("updated_at", oneHourBefore.toISOString())) as PostgrestResponse<IMonitoredProducts>

  let updatedProducts = 0;
  if (data && data?.length > 0) {
    for await (const item of data!) {
      const parsed = item.offers || []
      const data_emag = await axios.get(item.link, {
        headers: {
          "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36 Edg/111.0.1661.44",
          
      }});
      const $ = load(data_emag.data)
      $("head script").each((_i, elem) => {
        let dat = $(elem.children).text();
        if (dat) {
          const EM = eval(dat + "EM");
          const products = { ...item, offers: EM.used_offers }

          if (parsed.length != products.offers.length) {
            const new_offer = EM.used_offers.filter((o: { id: any; }) => !parsed.some((l: { id: any; }) => l.id === o.id))

            updateProduct(products, new_offer[0])
            updatedProducts++;
          }
        }
      });
    }
  }
  res.send(`Updated ${updatedProducts} products`)

}
