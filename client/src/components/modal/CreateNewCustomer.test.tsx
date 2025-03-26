// CreateNewCustomer.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CreateNewCustomer from "./CreateNewCustomer";

// Mock useCustomerHook to avoid triggering actual API logic
vi.mock("../../hooks/customer/useCustomerHook", () => ({
  default: () => ({
    createCustomer: vi.fn(),
    isPending: false,
  }),
}));

describe("CreateNewCustomer", () => {
  it("renders form with heading and input fields", () => {
    render(<CreateNewCustomer close={() => {}} />);

    expect(screen.getByText(/Create New Customer/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Customer Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contact Person/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contact Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contact Address/i)).toBeInTheDocument();
  });
});

/*
Short description:
Checks that CreateNewCustomer renders the form with input fields and heading.
*/
