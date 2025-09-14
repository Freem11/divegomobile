import { StateCreator } from "zustand";

import { DiveSiteBasic } from "../../entities/diveSite";

export interface DivesiteSlice {
  testDivesite: DiveSiteBasic | null;
  addDivesite: () => void;
}

export const createDivesiteSlice: StateCreator<DivesiteSlice, [], [], DivesiteSlice> = (set) => ({
  testDivesite: null,
  addDivesite: () =>
    set((state) => ({ testDivesite: null })),
});