// UpdateStockOut.test.tsx
import { render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { describe, it, expect, vi } from "vitest"
import UpdateStockOut from "./UpdateStockOut"

// Create a fake Redux store with an auth slice
const store = configureStore({
  reducer: () => ({
    auth: { user: { usercode: "user001", password: "pass123" } },
  }),
})

// Create a QueryClient instance for React Query
const queryClient = new QueryClient()

// Fake the useAddStock hook to avoid actual API calls
vi.mock("../../hooks/stock/useAddStock", () => ({
  useAddStock: () => ({
    stockOutAssemble: vi.fn(),
    stockOutAssemblePending: false,
  }),
}))

/*
✅ Description:
Renders UpdateStockOut component with mock product data and verifies that the heading displays the correct product code and description.
*/

describe("UpdateStockOut Component", () => {
  it("renders heading with product code and description", () => {
    const mockProduct = {
      transactionNo: "TX-100",
      remarks: "Initial remarks",
      quantity: 50,
      batchNo: "B-101",
      status: "DRAFT",
      createdDateTime: "2025-03-27T12:00:00Z",
      createdBy: "Admin",
      item: {
        id: "item-001",
        code: "P001",
        description: "Test Product",
      },
    }

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <UpdateStockOut
            product={mockProduct}
            toggleModal={() => {}}
            isLoading={false}
            onSubmit={() => {}}
          />
        </QueryClientProvider>
      </Provider>
    )

    expect(
      screen.getByText(/Update Status for P001 - Test Product/i)
    ).toBeInTheDocument()
  })
})
