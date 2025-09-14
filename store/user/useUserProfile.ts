import { useStore } from "..";

export const useUserProfile = () => {
  const userProfile = useStore((state) => state.userProfile);
  return userProfile;
};