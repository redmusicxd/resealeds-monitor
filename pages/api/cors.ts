// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import puppeteer from 'puppeteer';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';


const getBrowser = () =>
 IS_PRODUCTION
   ? // Connect to browserless so we don't run Chrome on the same hardware in production
      puppeteer.connect({ browserWSEndpoint: 'wss://chrome.browserless.io?token=' + process.env.BROWSERLESS_API_KEY })
   : // Run the browser locally while in development
     puppeteer.launch();


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const url = req.body?.url;


    let browser = null;

    try {
      browser = await getBrowser();
      const page = await browser.newPage();
  
      await page.goto(url)
      const html = await page.content()
  
      res.end(html);
    } catch (error) {
      if (!res.headersSent) {
        res.status(400).send((error as any)?.message);
      }
    } finally {
      if (browser) {
        browser.close();
      }
    }
    // res.send(data)
    // res.send(data)
    // res.write(text);
  } catch (error) {
    console.log(error);
    res.status(500).end((error as any)?.data || "500 Internal Server Error")
  }
}
