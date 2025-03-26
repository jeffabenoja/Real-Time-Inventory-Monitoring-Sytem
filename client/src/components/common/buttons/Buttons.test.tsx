// src/__tests__/CustomButton.test.tsx

import '@testing-library/jest-dom'
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Button from "./Buttons";

// Dummy Icon component for testing purposes.
const DummyIcon: React.FC<{ className?: string; size?: number }> = ({
  className,
  size,
}) => (
  <svg data-testid="dummy-icon" className={className} width={size} height={size}>
    <circle cx="9" cy="9" r="8" fill="blue" />
  </svg>
);

describe("CustomButton Component", () => {
  it("renders with default props and displays the label", () => {
    render(<Button label="Click Me" Icon={DummyIcon} />);
    
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("type", "button");
    
    expect(screen.getByText(/click me/i)).toBeInTheDocument();
    
    expect(screen.getByTestId("dummy-icon")).toBeInTheDocument();
  });

  it("renders with the provided type and calls onClick when clicked", () => {
    const onClickMock = vi.fn();
    
    render(
      <Button label="Submit" Icon={DummyIcon} onClick={onClickMock} type="submit" />
    );
    
    const button = screen.getByRole("button", { name: /submit/i });
    expect(button).toHaveAttribute("type", "submit");
    
    fireEvent.click(button);
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it("renders without a label", () => {
    render(<Button Icon={DummyIcon} />);
    
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    
    expect(screen.getByTestId("dummy-icon")).toBeInTheDocument();
    
    expect(button).toHaveTextContent("");
  });
});
