import { create } from "zustand";
import { Session } from "@supabase/supabase-js";

import { ActiveProfile } from "../entities/profile";
import { createProfile, grabProfileById, grabProfileByUserId } from "../supabaseCalls/accountSupabaseCalls";
import { sessionCheck, signOut } from "../supabaseCalls/authenticateSupabaseCalls";
import { getSession } from "../compnents/helpers/loginHelpers";



const mutator = (set, get) => {

  let initialized = null;

  return {
    profile:         null as ActiveProfile | null,
    profileInitialized: null as boolean | null,

    actions: {
      initProfile: async(force = false) => {
        if (force) {
        // sometimes we need to profile reinitialization: after logging in or out, after changing profile data...
          initialized = null;
        }

        if (initialized === null) {
          initialized = false;
          const session = await getSession();

          if (!session?.user.id) {
          // User is not signed in - profile will be empty
            set({ profileInitialized: true });
            return;
          }

          const profile = await grabProfileByUserId(session.user.id);
          if (profile) {
            set({ profile: profile });
          } else {
            const created = await createProfile({
              id:    session.user.id,
              email: session.user.email,
            });

            if (created.error) {
              set({ profileInitialized: false });
              console.log("Unable to create new profile for user ", session.user.id);
              return;
            }

            const profile = await grabProfileByUserId(session.user.id);
            if (!profile) {
              set({ profileInitialized: false });
              console.log("Unable to fetch new profile");
              return;
            }
            set({ profile: profile });

          }
          initialized = true;
          set({ profileInitialized: true });
        }
      },

      logout: async() => {
        await signOut();
        set({ profile: null, profileInitialized: null });

        // allow initProfile to be called again to re-initialize(login right after logging out)
        initialized = null;
      },
    },
  };
};

export const useUserProfileStore = create<ReturnType<typeof mutator>>(mutator);
