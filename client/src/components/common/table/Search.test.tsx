// src/__tests__/Search.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Search from "./Search";

describe("Search Component", () => {
  it("renders with correct placeholder and initial value", () => {
    const setColumnFilterMock = vi.fn();

    render(<Search columnFilter="initial" setColumnFilter={setColumnFilterMock} />);

    const input = screen.getByPlaceholderText(/search/i) as HTMLInputElement;

    expect(input).toBeInTheDocument();
    expect(input.value).toBe("initial");
  });

  it("calls setColumnFilter when input changes", () => {
    const setColumnFilterMock = vi.fn();

    render(<Search columnFilter="" setColumnFilter={setColumnFilterMock} />);

    const input = screen.getByPlaceholderText(/search/i);

    fireEvent.change(input, { target: { value: "test" } });

    expect(setColumnFilterMock).toHaveBeenCalledWith("test");
    expect(setColumnFilterMock).toHaveBeenCalledTimes(1);
  });
});