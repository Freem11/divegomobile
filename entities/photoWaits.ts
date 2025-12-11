export type PhotoWaits = {
  id: number
  label: string
  UserID: string
  userName: string
  latitude: number
  longitude: number
  photoFile: string
  dateTaken: string
  created_at: string
};

export type PhotoWaitInsert = {
  label: string
  UserID: string
  latitude: number
  longitude: number
  photoFile: string
  dateTaken: string
};