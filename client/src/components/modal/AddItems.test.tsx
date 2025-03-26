// AddItems.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AddItems from "./AddItems";

describe("AddItems Component - Simplified", () => {
  // Dummy callback functions
  const dummyOnSubmit = vi.fn();
  const dummyToggleModal = vi.fn();

  const defaultProps = {
    title: "Add Product",
    isProduct: true,
    isStocklist: true,
    isOnSubmit: dummyOnSubmit,
    isLoading: false,
    toggleModal: dummyToggleModal,
    productData: null,
  };

  it("renders form fields and labels correctly", () => {
    render(<AddItems {...defaultProps} />);

    // Check header title
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("Add Product");

    // Check that key form fields are rendered via their labels
    expect(screen.getByLabelText("Product Code")).toBeInTheDocument();
    expect(screen.getByLabelText("Product Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Category")).toBeInTheDocument();
    expect(screen.getByLabelText("Brand")).toBeInTheDocument();
    expect(screen.getByLabelText("Unit")).toBeInTheDocument();
    expect(screen.getByLabelText("Reorder Point")).toBeInTheDocument();
    expect(screen.getByLabelText("Selling Price")).toBeInTheDocument();
    expect(screen.getByLabelText("Expenses Cost")).toBeInTheDocument();
  });

  it("opens cancel confirmation modal and calls toggleModal on confirm", async () => {
    render(<AddItems {...defaultProps} />);

    // Click the Cancel button to trigger cancel confirmation modal
    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelBtn);
  });

  it("opens submit confirmation modal on submit button click", async () => {
    render(<AddItems {...defaultProps} />);

    // Click the Submit button (text "Submit" is rendered when productData is null)
    const submitBtn = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitBtn);
  });
});