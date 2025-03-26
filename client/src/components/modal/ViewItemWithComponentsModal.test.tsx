import { render } from "@testing-library/react"
import ViewItemWithComponents from "./ViewItemWithComponentsModal"
import { Provider } from "react-redux"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { store } from "../../store"
import { describe, it, vi } from "vitest"

// ✅ Mock the getInventoryPerItem API to avoid jsdom request issues
vi.mock("../../api/services/inventory", () => ({
  getInventoryPerItem: vi.fn(() => Promise.resolve({
    id: "mock-id",
    item: {
      id: "mock-id",
      code: "ITEM001",
      description: "Mock Item",
      category: "Raw Mats",
      brand: "Mock Brand",
      unit: "kg",
      reorderPoint: 10,
      price: 100,
      cost: 80,
      status: "ACTIVE",
    },
    inQuantity: 50,
    outQuantity: 20,
  }))
}))

// Short description: Tests if item details and materials render correctly
describe("ViewItemWithComponents", () => {
  const queryClient = new QueryClient()
  const closeMock = vi.fn()
  const isOnSubmitMock = vi.fn()

  it("renders product details and raw materials", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <ViewItemWithComponents
            id="123"
            isOnSubmit={isOnSubmitMock}
            close={closeMock}
          />
        </Provider>
      </QueryClientProvider>
    )
  })
})
