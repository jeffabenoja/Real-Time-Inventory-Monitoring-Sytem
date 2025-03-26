// StockRawMatsModal.test.tsx
import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import StockRawMatsModal from "./StockRawMatsModal"

describe("StockRawMatsModal", () => {
  it("renders heading with product code and name", () => {
    render(
      <StockRawMatsModal
        productId="prod-123"
        productCode="RM001"
        productName="Sugar"
        close={() => {}}
      />
    )

    expect(
      screen.getByText("Stock for RM001 - Sugar")
    ).toBeInTheDocument()
  })
})