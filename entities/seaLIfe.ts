import { Image } from "../entities/image";

export type SeaLife = {
  id: number
  name: string
  description: string
  image_id: string
  created_at: string
  speciesPhoto: Image
};