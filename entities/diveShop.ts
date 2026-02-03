import { Geom } from "./geom";

export type DiveShop = {
  id: number
  orgname: string
  lat: number
  lng: number
  userId: string
  created_at: string
  diveshopbio: string
  diveshopprofilephoto: string
  geom: Geom
  user_id: string
  image_id: number
  public_domain: string
  sm: string
  md: string
  lg: string
  xl: string
};