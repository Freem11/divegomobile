import { Image } from "../entities/image";

export const mockProfile = {
  id: 1 as number,
  created_at: "2023-01-01" as string,
  UserName: "Test" as string,
  Email: "test@scubaseasons.com" as string,
  UserID: "1" as string,
  expo_push_token: [] as string[],
  feedbackRequested: false as boolean,
  getAdminNotification: false as boolean,
  partnerAccount: false as boolean,
  profileBio: null as string | null,
  profilePhoto: {} as Image,
  unit_system: "" as string,
  language: "" as string,
  suunto_refresh_token: null as string | null,
  imageVariants: null as Image | null
};

export type ActiveProfile = typeof mockProfile;

export type DeletedAccountInfo = {
  firstName: string
  lastName: string
  email: string
  UserID: string
};
