// Login.test.tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi } from "vitest";
import Login from "./Login";

// Mock the banner image asset to prevent network requests during tests
vi.mock("../../assets/banner.jpg", () => {
  return { default: "banner.jpg" };
});

const store = configureStore({
  reducer: (state = {}) => state,
});
const queryClient = new QueryClient();

describe("Login Component - Simplified", () => {
  it("renders the welcome message", () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={["/login"]}>
            <Login />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );

    expect(
      screen.getByText(/Welcome! Let’s get you signed in./i)
    ).toBeInTheDocument();
  });

  it("renders the forgot password link", () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={["/login"]}>
            <Login />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );

    expect(screen.getByText(/Forgot Password\?/i)).toBeInTheDocument();
  });
});

/*
Short description:
Simplified tests for the Login component verifying that key texts (welcome message and forgot password link) are rendered, with a proper mock for the banner image.
*/
