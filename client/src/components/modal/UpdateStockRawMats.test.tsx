// UpdateStockRawMats.test.tsx
import { render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import UpdateStockRawMats from "./UpdateStockRawMats"
import { describe, it, expect } from "vitest"

// ✅ Description:
// Renders UpdateStockRawMats with mock product and checks if the heading is correctly displaying the product code and description.

describe("UpdateStockRawMats Component", () => {
  it("renders heading with product code and description", () => {
    const mockProduct = {
      transactionNo: "TX-101",
      remarks: "Restocking batch",
      quantity: 100,
      batchNo: "B-202",
      expiryDate: "2025-12-31",
      status: "DRAFT",
      transactionDate: "2025-12-31",
      createdDateTime: "2025-03-27T12:00:00Z",
      createdBy: "Admin",
      item: {
        id: "item-002",
        code: "RAW-MAT-01",
        description: "Sugar",
      },
    }

    const store = configureStore({
      reducer: () => ({
        auth: { user: { usercode: "admin", password: "secure123" } },
      }),
    })

    const queryClient = new QueryClient()

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <UpdateStockRawMats
            product={mockProduct}
            toggleModal={() => {}}
            isLoading={false}
            onSubmit={() => {}}
          />
        </QueryClientProvider>
      </Provider>
    )

    expect(
      screen.getByText("Update Status for RAW-MAT-01 - Sugar")
    ).toBeInTheDocument()
  })
})
