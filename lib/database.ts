import { UUID } from "crypto";

export interface IMonitoredProducts {
  id?: number,
  created_at?: Date,
  name: string,
  link: string,
  user_id?: UUID,
  img: string,
  price: number,
  offers: string
}