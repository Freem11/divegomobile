import { useStore } from "..";
import { getSession } from "../../compnents/helpers/loginHelpers";
import { createProfile, grabProfileByUserId } from "../../supabaseCalls/accountSupabaseCalls";

export const useUserInit = () => {
  let initialized = null;

  const setUserState = useStore((state) => state.setUserState);

      return async(force = false) => {
        if (force) {
        // sometimes we need to profile reinitialization:
        // after logging in or out, after changing profile data...
          initialized = null;
        }

        if (initialized === null) {
          initialized = false;
          const session = await getSession();

          if (!session?.user.id) {
          // User is not signed in - profile will be empty
            setUserState(null, true);
            return;
          }

          const profile = await grabProfileByUserId(session.user.id);
          if (profile) {
            setUserState(profile, true);
          } else {
            const created = await createProfile({
              id:    session.user.id,
              email: session.user.email,
            });

            if (created.error) {
              setUserState(null, false );
              console.log("Unable to create new profile for user ", session.user.id);
              return;
            }

            const profile = await grabProfileByUserId(session.user.id);
            if (!profile) {
              setUserState( null, false );
              console.log("Unable to fetch new profile");
              return;
            }
            setUserState(profile, true);

          }
          initialized = true;
        }
      }
};