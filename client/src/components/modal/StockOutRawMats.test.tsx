// StockOutAssemble.test.tsx
import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import StockOutAssemble from "./StockOutAssemble"

// Mock the useAddStock hook
vi.mock("../../hooks/stock/useAddStock", () => ({
  useAddStock: () => ({
    stockOutAssemble: vi.fn(),
    stockOutAssemblePending: false,
  }),
}))

// Create a mock store
const store = configureStore({
  reducer: () => ({
    auth: {
      user: { usercode: "testuser", password: "pass123" },
    },
  }),
})

describe("StockOutAssemble", () => {
  it("renders the heading with product code and name", () => {
    render(
      <Provider store={store}>
        <StockOutAssemble
          stockInTransactionNo="TX-001"
          productCode="P001"
          productName="Sample Item"
          toggleModal={() => {}}
        />
      </Provider>
    )

    expect(
      screen.getByText(/Remove Stock for P001 - Sample Item/i)
    ).toBeInTheDocument()
  })
})

/*
Short description:
Checks that StockOutAssemble shows correct heading with product code and name.
*/
