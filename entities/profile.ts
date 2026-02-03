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
  profilePhoto: "" as string,
  unit_system: "" as string,
  language: "" as string,
  public_domain: "" as string,
  sm: "" as string,
  md: "" as string,
  lg: "" as string,
  xl: "" as string
};

export type ActiveProfile = typeof mockProfile;

export type DeletedAccountInfo = {
  firstName: string
  lastName: string
  email: string
  UserID: string
};
