import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import Profile from "../components/Profile";
import { useAuthToken } from "../AuthTokenContext";
import { useAuth0 } from "@auth0/auth0-react";

jest.mock("../AuthTokenContext");
jest.mock("@auth0/auth0-react");

describe("Profile Component Tests", () => {
  const mockUser = {
    name: 'test',
    email: 'test@gmail.com',
    createdAt: '2024-04-06T23:33:25.524Z',
    updatedAt: '2024-04-08T17:52:28.647Z',
    notesCount: 5,
    bio: 'This is a testing account.',
  };

  beforeEach(() => {
    useAuthToken.mockReturnValue({
      accessToken: 'mockAccessToken',
      loading: false,
      error: null,
    });

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockUser),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("displays user when authenticated", async () => {
    useAuth0.mockReturnValueOnce({
      isAuthenticated: true,
      loginWithRedirect: jest.fn(),
    });

    await act(async () => {
      render(<Profile />);
    });

    await waitFor(() => {
      expect(screen.getByText("User Information")).toBeInTheDocument();
      expect(screen.getByText(`Email: ${mockUser.email}`)).toBeInTheDocument();
      expect(screen.getByText(mockUser.name)).toBeInTheDocument();

    });
  });
});