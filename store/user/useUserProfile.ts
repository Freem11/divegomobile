import { useStore } from "..";

export const useUserProfile = () => {
  const userProfile = useStore((state) => state.userProfile);
  const userInitialized = useStore((state) => state.userInitialized);
  return { userProfile, userInitialized };
};