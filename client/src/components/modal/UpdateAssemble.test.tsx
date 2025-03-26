// UpdateAssemble.test.tsx
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import UpdateAssemble from "./UpdateAssemble"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

// Fake Redux store (no real reducer needed for this test)
const store = configureStore({ reducer: () => ({}) })

// Create React Query client
const queryClient = new QueryClient()

describe("UpdateAssemble", () => {
  it("renders without crashing", () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <UpdateAssemble
            row={{
              transactionNo: "TXN-001",
              createdDateTime: "2024-03-28T00:00:00Z",
              transactionDate: "2024-03-28",
              remarks: "Sample",
              finishProduct: {
                id: "prod-1",
                code: "ITEM-001",
                description: "Sample Product",
                category: "Finished Goods", // ✅ valid enum value
                brand: "Brand A",
                unit: "pcs",
                reorderPoint: 10,
                price: 100,
                cost: 50,
                status: "ACTIVE",
              },
              assembleQuantity: 10,
              batchNo: "B001",
              status: "DRAFT",
            }}
            close={() => {}}
          />
        </QueryClientProvider>
      </Provider>
    )

    expect(screen.getByText(/Order Number: TXN-001/i)).toBeInTheDocument()
  })
})
