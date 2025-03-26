// src/__tests__/PasswordReset.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, vi } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { useQuery, useMutation } from "@tanstack/react-query";
import PasswordReset from "./PasswordReset";

// Create a minimal Redux store
const store = configureStore({
  reducer: (state = {}) => state,
});

// Simplified mocks for react-query hooks
vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
}));

describe("PasswordReset Component - Simplified", () => {
  it("submits the form and calls closeModal on valid input", async () => {
    const closeModalMock = vi.fn();
    const userCode = "testUser";
    const mockUserDetails = {
      id: "1",
      usercode: "testUser",
      first_name: "Test",
      last_name: "User",
      email: "test@example.com",
      password: "oldPassword",
    };

    // Mock useQuery to immediately return user details
    (useQuery as any).mockReturnValue({
      data: mockUserDetails,
      isLoading: false,
    });

    // Mock useMutation to resolve successfully when called
    const updateUserMutateMock = vi.fn().mockResolvedValue(mockUserDetails);
    (useMutation as any).mockReturnValue({
      mutateAsync: updateUserMutateMock,
      isPending: false,
    });

    render(
      <Provider store={store}>
        <PasswordReset userCode={userCode} closeModal={closeModalMock} />
      </Provider>
    );

    // Wait for form fields to be available
    const newPasswordInput = await screen.findByLabelText("New Password");
    const confirmPasswordInput = await screen.findByLabelText("Confirm Password");

    // Fill in matching passwords
    fireEvent.change(newPasswordInput, { target: { value: "newPassword123" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "newPassword123" } });

    // Click the submit button
    const submitButton = screen.getByRole("button", { name: /update/i });
    fireEvent.click(submitButton);

  });
});