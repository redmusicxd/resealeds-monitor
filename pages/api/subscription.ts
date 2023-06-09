import webpush from "web-push"
import type { NextApiRequest, NextApiResponse } from 'next'

//storing the keys in variables
const publicVapidKey = 'BMBXR2-2GL2qPY7u-w6ICu3vmzJPa89M_63e35-DZvycuVQsHs4FPzwLB6AsV0spANBpoVYz1UzJLOrNHe0z_Hg';
const privateVapidKey = process.env.NEXT_PUBLIC_PRIVATE_VAPID_KEY;

import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
webpush.setVapidDetails('mailto:rednblkx@kodeeater.xyz', publicVapidKey, privateVapidKey!);


export default async function handler(  request: NextApiRequest,
  response: NextApiResponse) {
  //setting vapid keys details
  if (request.method === "OPTIONS") {
    response.setHeader("Access-Control-Allow-Origin", "*")
    response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
    response.setHeader("Access-Control-Allow-Headers", "Content-Type")
    response.status(200).send("OK")
  }

  const subscription = request.body;

  response.setHeader("Access-Control-Allow-Origin", "*")

  const { error } = await supabase.from("subscriptions").insert(subscription);
  
  console.log(error);
  if (error?.code == '23505') {
    const { error } = await supabase.from("subscriptions").update(subscription).eq("user_id", subscription.user_id);
  }

  //create paylod: specified the detals of the push notification
  // const payload = JSON.stringify({ title: 'Section.io Push Notification' });
  
  // //pass the object into sendNotification fucntion and catch any error
  // await webpush.sendNotification(subscription, payload).catch(err=> console.error(err));
  //send status 201 for the request
  response.status(201).json({})

}