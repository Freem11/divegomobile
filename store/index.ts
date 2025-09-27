// store/index.ts
import { create } from "zustand";

import { createDivesiteSlice } from "./diveSite/divesiteSlice";
import { CombinedSlices } from "./slices";
import { createUserSlice } from "./user/userSlice";

export const useStore = create<CombinedSlices>()((...a) => ({
  ...createUserSlice(...a),
  ...createDivesiteSlice(...a),
}));