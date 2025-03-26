// UpdateSalesOrder.test.tsx
import { render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { configureStore } from "@reduxjs/toolkit"
import UpdateSalesOrder from "./UpdateSalesOrder"
import { SalesOrderType } from "../../type/salesType"
import { describe, expect, it } from "vitest"

// Create a fake Redux store with an auth slice that includes a user
const store = configureStore({
  reducer: () => ({
    auth: { user: { usercode: "fakeUser", password: "fakePass" } },
  }),
})

// Create a QueryClient instance for React Query
const queryClient = new QueryClient()

/*
✅ Description:
Renders UpdateSalesOrder component with mock sales order data and verifies that customer name and order number appear correctly. The fake store provides the required auth user data.
*/

const mockSalesOrder: SalesOrderType = {
  salesorderNo: "SO-12345",
  orderDate: "2025-03-26",
  remarks: "Test order",
  status: "DRAFT",
  customer: {
    id: "1",
    name: "Test Customer",
    address: "123 Test Street",
    contactPerson: "Jane Doe",
    contactNumber: "09123456789",
    status: "ACTIVE",
  },
  details: [],
  createdDateTime: "2025-03-25T10:00:00Z",
}

describe("UpdateSalesOrder Component", () => {
  it("renders customer name and order number", () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <UpdateSalesOrder row={mockSalesOrder} close={() => {}} />
        </QueryClientProvider>
      </Provider>
    )

    expect(screen.getByDisplayValue("Test Customer")).toBeInTheDocument()
    expect(screen.getByText("Order Number: SO-12345")).toBeInTheDocument()
  })
})
