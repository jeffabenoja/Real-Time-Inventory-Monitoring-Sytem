// src/__tests__/UserForm.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserForm from "./User";

// Create a dummy Redux store
const store = configureStore({
  reducer: (state = {}) => state,
});

// Create a QueryClient for React Query
const queryClient = new QueryClient();

describe("UserForm Component", () => {
  it("renders form fields and calls close on Cancel click", () => {
    const closeMock = vi.fn();
    // Dummy userList for the Select component
    const userList = [{ id: "1", code: "Group1" }];

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <UserForm close={closeMock} userList={userList} />
        </QueryClientProvider>
      </Provider>
    );

    // Check that the form fields are rendered (assuming Input component renders labels)
    expect(screen.getByText("First Name")).toBeInTheDocument();
    expect(screen.getByText("Last Name")).toBeInTheDocument();
    expect(screen.getByText("User Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Password")).toBeInTheDocument();

    // Verify the Cancel button exists and clicking it calls the close callback
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    expect(cancelButton).toBeInTheDocument();
    fireEvent.click(cancelButton);
    expect(closeMock).toHaveBeenCalled();
  });
});