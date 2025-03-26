import { render, screen, fireEvent } from "@testing-library/react";
import Input from "./Input";
import { describe, expect, it, vi } from "vitest";

// Mock Error component to isolate test
vi.mock("../common/utils/Error", () => ({
  __esModule: true,
  default: ({ error }: { error?: string }) => <div>{error}</div>,
}));

describe("Input", () => {
  // Test: renders input field with toggle password visibility
  it("renders input with label and toggles password visibility", () => {
    const mockRegister = vi.fn(() => ({ name: "password" }));

    render(
      <Input
        id="password"
        label="Password"
        register={mockRegister as any}
        attributes={{ type: "password" }}
        showFunctionality
      />
    );

    // Check label and input
    expect(screen.getByLabelText("Password")).toBeInTheDocument();

    // Password is hidden initially
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");

    // Click eye icon to show password
    const toggleBtn = screen.getByRole("button");
    fireEvent.click(toggleBtn);

    // Password is now visible
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "text");
  });
});
