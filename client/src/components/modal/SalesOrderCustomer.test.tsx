// SalesOrderCustomer.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SalesOrderCustomer from "./SalesOrderCustomer";

// Mock dependencies
vi.mock("../../hooks/customer/useCustomerHook", () => ({
  default: () => ({
    data: [],
    isLoading: false,
    isError: false,
  }),
}));

vi.mock("../common/table/Table", () => ({
  default: () => <div>Mocked Table</div>,
}));

describe("SalesOrderCustomer", () => {
  it("renders customer heading and table", () => {
    render(<SalesOrderCustomer onSubmit={() => {}} toggleModal={() => {}} />);

    expect(screen.getByText(/Customer/i)).toBeInTheDocument();
    expect(screen.getByText(/Mocked Table/i)).toBeInTheDocument();
  });
});

/*
Short description:
Checks that SalesOrderCustomer renders the heading and the mocked table.
*/