import { StateCreator } from "zustand";

import { ActiveProfile } from "../../entities/profile";
import { CombinedSlices } from "../slices";

export interface UserSlice {
  userProfile:         ActiveProfile | null,
  userInitialized: boolean | null,
  setUserState: (profile: ActiveProfile | null, initialized: boolean) => void,
}

export const createUserSlice: StateCreator<CombinedSlices, [], [], UserSlice> = (set) => {

  return {
    userProfile:         null as ActiveProfile | null,
    userInitialized: null as boolean | null,

    setUserState: (profile: ActiveProfile | null, initialized: boolean) => {
      set({
        userProfile: profile,
        userInitialized: initialized
      });
    },
  };};