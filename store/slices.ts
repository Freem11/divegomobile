import { DivesiteSlice } from "./diveSite/divesiteSlice";
import { UserSlice } from "./user/userSlice";

export type CombinedSlices = UserSlice &
DivesiteSlice;