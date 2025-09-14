import { DivesiteSlice } from "./divesiteSlice";
import { UserSlice } from "./user/userSlice";

export type CombinedSlices = UserSlice &
DivesiteSlice;