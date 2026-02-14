import { useStore } from "..";
import { getSession } from "../../compnents/helpers/loginHelpers";
import { createProfile, grabProfileByUserId } from "../../supabaseCalls/accountSupabaseCalls";
import { signOut } from "../../supabaseCalls/authenticateSupabaseCalls";

export const useUserHandler = () => {
  let initialized = null;
  const setUserState = useStore((state) => state.setUserState);

  const setIsRecovering = useStore((state) => state.setIsRecovering);

  const userInit = async(force = false) => {
    if (force) {
      initialized = null;
    }

    if (initialized === null) {
      initialized = false;
      const session = await getSession();

      if (!session?.user.id) {
        setUserState(null, true);
        return;
      }

      const profile = await grabProfileByUserId(session.user.id);
      if (profile) {
        setUserState(profile, true);
      } else {
        const created = await createProfile({
          id: session.user.id,
          email: session.user.email,
        });

        if (created.error) {
          setUserState(null, false);
          console.log("Unable to create new profile for user ", session.user.id);
          return;
        }

        const profile = await grabProfileByUserId(session.user.id);
        if (!profile) {
          setUserState(null, false);
          console.log("Unable to fetch new profile");
          return;
        }
        setUserState(profile, true);
      }
      initialized = true;
    }
  };

  const userLogout = async() => {
    await signOut();
    setUserState(null, false);
    initialized = null;
  };

  return {
    userInit,
    userLogout,
    setIsRecovering,
  };
};