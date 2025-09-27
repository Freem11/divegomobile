import { renderHook,  waitFor } from "@testing-library/react";

import { useUserHandler } from "./useUserHandler";

import { act } from "react";

// Mock external dependencies
jest.mock("../../compnents/helpers/loginHelpers", () => ({
  getSession: jest.fn(),
}));
jest.mock("../../supabaseCalls/accountSupabaseCalls", () => ({
  grabProfileByUserId: jest.fn(),
  createProfile: jest.fn(),
}));

// Import the mocked functions
import { useStore } from "..";
import { getSession } from "../../compnents/helpers/loginHelpers";
import { createProfile, grabProfileByUserId } from "../../supabaseCalls/accountSupabaseCalls";
import { ActiveProfile, mockProfile } from "../../entities/profile";

// Reset the store and mocks before each test
beforeEach(() => {
  act(() => {
    useStore.setState(useStore.getInitialState());
  });
  jest.clearAllMocks();
});

describe("useUserInit", () => {
  it("should initialize the user as uninitialized if there is no session", async() => {
    // Arrange
    (getSession as jest.Mock).mockResolvedValueOnce({ user: { id: null } });

    // Act
    const { result } = renderHook(() => useUserHandler());
    await act(async() => {
      await result.current.userInit();
    });

    // Assert
    expect(useStore.getState().userInitialized).toBe(true);
    expect(useStore.getState().userProfile).toBeNull();
    expect(getSession).toHaveBeenCalled();
    expect(grabProfileByUserId).not.toHaveBeenCalled();
    expect(createProfile).not.toHaveBeenCalled();
  });

  it("should initialize a user with an existing profile", async() => {
    // Arrange
    const mockSession = { user: { id: "user123", email: "test@example.com" } };
    const profile: ActiveProfile = { ...mockProfile };
    (getSession as jest.Mock).mockResolvedValueOnce(mockSession);
    (grabProfileByUserId as jest.Mock).mockResolvedValueOnce(profile);

    // Act
    const { result } = renderHook(() => useUserHandler());
    await act(async() => {
      await result.current.userInit();
    });

    // Assert
    await waitFor(() => {
      expect(useStore.getState().userProfile).toEqual(profile);
      expect(useStore.getState().userInitialized).toBe(true);
      expect(getSession).toHaveBeenCalled();
      expect(grabProfileByUserId).toHaveBeenCalledWith("user123");
      expect(createProfile).not.toHaveBeenCalled();
    });
  });

  it("should create a new profile if one does not exist", async() => {
    // Arrange
    const mockSession = { user: { id: "user456", email: "new@example.com" } };
    const newProfile: ActiveProfile = { ...mockProfile };

    // Mock for "no profile found"
    (grabProfileByUserId as jest.Mock).mockResolvedValueOnce(null);
    // Mock for successful creation
    (createProfile as jest.Mock).mockResolvedValueOnce({ error: null });
    // Mock for fetching the newly created profile
    (grabProfileByUserId as jest.Mock).mockResolvedValueOnce(newProfile);

    (getSession as jest.Mock).mockResolvedValueOnce(mockSession);

    // Act
    const { result } = renderHook(() => useUserHandler());
    await act(async() => {
      await result.current.userInit();
    });

    // Assert
    await waitFor(() => {
      expect(grabProfileByUserId).toHaveBeenCalledTimes(2);
      expect(createProfile).toHaveBeenCalledWith({
        id: "user456",
        email: "new@example.com",
      });
      expect(useStore.getState().userProfile).toEqual(newProfile);
      expect(useStore.getState().userInitialized).toBe(true);
    });
  });

  it("should handle failure when creating a new profile", async() => {
    // Arrange
    const mockSession = { user: { id: "user789", email: "fail@example.com" } };
    (getSession as jest.Mock).mockResolvedValueOnce(mockSession);
    (grabProfileByUserId as jest.Mock).mockResolvedValueOnce(null);
    (createProfile as jest.Mock).mockResolvedValueOnce({ error: "Creation failed" });

    // Act
    const { result } = renderHook(() => useUserHandler());
    await act(async() => {
      await result.current.userInit();
    });

    // Assert
    await waitFor(() => {
      expect(createProfile).toHaveBeenCalled();
      expect(useStore.getState().userInitialized).toBe(false);
      expect(useStore.getState().userProfile).toBeNull();
    });
  });

  it("should handle failure when fetching a newly created profile", async() => {
    // Arrange
    const mockSession = { user: { id: "user999", email: "fail-fetch@example.com" } };
    (getSession as jest.Mock).mockResolvedValueOnce(mockSession);
    // First call: profile does not exist
    (grabProfileByUserId as jest.Mock).mockResolvedValueOnce(null);
    (createProfile as jest.Mock).mockResolvedValueOnce({ error: null });
    // Second call: unable to fetch the new profile
    (grabProfileByUserId as jest.Mock).mockResolvedValueOnce(null);

    // Act
    const { result } = renderHook(() => useUserHandler());
    await act(async() => {
      await result.current.userInit();
    });

    // Assert
    await waitFor(() => {
      expect(grabProfileByUserId).toHaveBeenCalledTimes(2);
      expect(createProfile).toHaveBeenCalled();
      expect(useStore.getState().userInitialized).toBe(false);
      expect(useStore.getState().userProfile).toBeNull();
    });
  });

  it("should re-initialize the profile when force=true is passed", async() => {
    // Arrange: Initial state is already initialized
    const initialProfile: ActiveProfile = { ...mockProfile };
    const newProfile: ActiveProfile = { ...mockProfile, Email: "updated@example.com" };

    act(() => {
      useStore.getState().setUserState(initialProfile, true);
    });

    const mockSession = { user: { id: "user101", email: "updated@example.com" } };
    (getSession as jest.Mock).mockResolvedValueOnce(mockSession);
    (grabProfileByUserId as jest.Mock).mockResolvedValueOnce(newProfile);

    // Act
    const { result } = renderHook(() => useUserHandler());
    // Call the hook with force = true to trigger re-initialization
    await act(async() => {
      await result.current.userInit(true);
    });

    // Assert
    await waitFor(() => {
      // The profile should have been updated
      expect(useStore.getState().userProfile).toEqual(newProfile);
      expect(useStore.getState().userInitialized).toBe(true);
      expect(getSession).toHaveBeenCalledTimes(1);
    });
  });
});