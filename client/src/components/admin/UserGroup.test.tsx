// src/__tests__/UserGroupForm.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserGroupForm from "./UserGroup";


// Create a minimal Redux store and React Query client
const store = configureStore({
  reducer: (state = {}) => state,
});
const queryClient = new QueryClient();

describe("UserGroupForm Component", () => {
  it("renders form fields and calls close on Cancel click", () => {
    const closeMock = vi.fn();

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <UserGroupForm close={closeMock} />
        </QueryClientProvider>
      </Provider>
    );

    // Verify that form fields are rendered
    expect(screen.getByText("Group Description")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByText("Creator")).toBeInTheDocument();
    expect(screen.getByText("Editor")).toBeInTheDocument();

    // Simulate clicking the Cancel button
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);
    expect(closeMock).toHaveBeenCalled();
  });
});