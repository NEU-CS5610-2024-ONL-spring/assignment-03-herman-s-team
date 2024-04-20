import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { act } from "react-dom/test-utils";
import NoteList from "../components/NoteList";
import { useAuthToken } from "../AuthTokenContext";

jest.mock("../AuthTokenContext");

describe("NoteList Component Tests", () => {
  const mockNotes = [
    {
      id: 1,
      title: "Note Why Your Small Business Needs an SSL Certificate?",
      content: "In this age of the Internet, the way businesses function and consumers react have changed a lot. So has the concerns for the security around their interaction online.",
    },
    {
      id: 2,
      title: "How to Fix Hacked Email",
      content: "Email hacking has become a common nuisance these days.",
    },
  ];

  beforeEach(() => {
    useAuthToken.mockReturnValue({
      accessToken: 'mockAccessToken',
    });

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockNotes),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("renders a list of notes", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <NoteList />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText("Notes")).toBeInTheDocument();
      expect(screen.getByText("Note Why Your Small Business Needs an SSL Certificate?")).toBeInTheDocument();
      expect(screen.getByText("How to Fix Hacked Email")).toBeInTheDocument();
    });
  });
});