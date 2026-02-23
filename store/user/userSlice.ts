import { StateCreator } from "zustand";

import { ActiveProfile } from "../../entities/profile";
import { CombinedSlices } from "../slices";

export interface UserSlice {
  userProfile: ActiveProfile | null;
  userInitialized: boolean | null;
  isRecovering: boolean; // New Flag
  showOnboarding: boolean; // New Flag
  setUserState: (profile: ActiveProfile | null, initialized: boolean) => void;
  setIsRecovering: (recovering: boolean) => void;
  setShowOnBoarding: (onboarding: boolean) => void;
}

export const createUserSlice: StateCreator<CombinedSlices, [], [], UserSlice> = (set) => {
  return {
    userProfile: null as ActiveProfile | null,
    userInitialized: null as boolean | null,
    isRecovering: false,
    showOnboarding: false,

    setUserState: (profile: ActiveProfile | null, initialized: boolean) => {
      set({
        userProfile: profile,
        userInitialized: initialized,
      });
    },

    setIsRecovering: (recovering: boolean) => {
      set({ isRecovering: recovering });
    },
    setShowOnBoarding: (onboarding: boolean) => {
      set({ showOnboarding: onboarding });
    },
  };
};