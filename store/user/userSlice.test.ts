import { act } from "react";

import { useStore } from "..";
import { mockProfile } from "../../entities/profile";

beforeEach(() => {
  act(() => {
    useStore.setState(useStore.getInitialState());
  });
});

describe("UserSlice", () => {
  it("should set the user profile correctly", () => {
    const { setUserState } = useStore.getState();

    act(() => {
      setUserState(mockProfile, true);
    });

    expect(useStore.getState().userProfile).toEqual(mockProfile);
  });

  it("should set the user profile to null", () => {
    const { setUserState } = useStore.getState();

    act(() => {
      setUserState(null, true);
    });

    expect(useStore.getState().userProfile).toBeNull();
  });
});