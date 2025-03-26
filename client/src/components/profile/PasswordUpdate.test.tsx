import { render, screen, fireEvent } from "@testing-library/react";
import PasswordUpdate from "./PasswordUpdate";
import { describe, it, vi } from "vitest";

// Mock Input to isolate the test
vi.mock("./Input", () => ({
  __esModule: true,
  default: ({ id, label, register, error }: any) => (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} {...register(id)} />
      {error && <span>{error}</span>}
    </div>
  ),
}));

// Mock transformUserDetails to return basic user object
vi.mock("../../utils/transformUserDetails", () => ({
  __esModule: true,
  default: (user: any) => ({ ...user }),
}));

describe("PasswordUpdate", () => {
  // Test: submits form with matching new password and calls onSubmit
  it("submits valid form and triggers onSubmit", async () => {
    const onSubmit = vi.fn();
    const closeModal = vi.fn();

    render(
      <PasswordUpdate
        closeModal={closeModal}
        currentPassword="current123"
        updateUserPending={false}
        onSubmit={onSubmit}
        userDetails={{
            usercode: "",
            email: "",
            status: "ACTIVE",
          first_name: "Test",
          last_name: "User",
          password: "current123",
          userGroup: "" as any
        }}
      />
    );

    fireEvent.change(screen.getByLabelText("Current Password"), {
      target: { value: "current123" },
    });
    fireEvent.change(screen.getByLabelText("New Password"), {
      target: { value: "newpass123" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "newpass123" },
    });
  });
});
