import { useStore } from "..";
import { signOut } from "../../supabaseCalls/authenticateSupabaseCalls";

export const useUserLogout = () => {
  const setUserState = useStore((state) => state.setUserState);

    return async() => {
      await signOut();
      setUserState(null, false);
    }
};