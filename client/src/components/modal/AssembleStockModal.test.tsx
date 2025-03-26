// AssembleStockModal.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AssembleStockModal from "./AssembleStockModal";

describe("AssembleStockModal", () => {
  it("renders product code and description", () => {
    render(
      <AssembleStockModal
        product={{ id: "1", code: "ITEM001", description: "Test Product", category: "Raw Mats", brand: "test", unit: "kg" }}
        close={() => {}}
      />
    );

    expect(
      screen.getByText(/Stock for ITEM001 - Test Product/i)
    ).toBeInTheDocument();
  });
});