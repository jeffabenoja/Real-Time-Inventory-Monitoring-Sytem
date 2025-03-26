// ViewItemStock.test.tsx
import { render, screen } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import ViewItemStock from "./ViewItemStock"
import { describe, it, expect, vi } from "vitest"
import * as inventoryApi from "../../api/services/inventory"

vi.mock("../../api/services/inventory", async () => {
  const actual = await vi.importActual<any>("../../api/services/inventory")
  return {
    ...actual,
    getInventoryPerItem: vi.fn(),
  }
})

// ✅ Description:
// Renders ViewItemStock with mock inventory data and displays correct stock info.

describe("ViewItemStock Component", () => {
  it("displays stock data for a valid product", async () => {
    const mockProduct = {
      id: "item-001",
      code: "ITEM001",
      description: "Milk",
      category: 'Raw Mats',
      brand: "FreshCo",
      unit: "liter",
      reorderPoint: 10,
      price: 50,
      cost: 30,
      status: "active",
    }

    const mockInventory = {
      item: mockProduct,
      inQuantity: 100,
      outQuantity: 30,
      id: "inv-001",
    }

    vi.spyOn(inventoryApi, "getInventoryPerItem").mockResolvedValueOnce(
      mockInventory as any
    )

    const queryClient = new QueryClient()

    render(
      <QueryClientProvider client={queryClient}>
        <ViewItemStock product={mockProduct as any} />
      </QueryClientProvider>
    )

    expect(await screen.findByText("Stock for ITEM001")).toBeInTheDocument()
    expect(await screen.findByDisplayValue("Milk")).toBeInTheDocument()
    expect(await screen.findByDisplayValue("70.00")).toBeInTheDocument()
    expect(await screen.findByDisplayValue("30.00")).toBeInTheDocument()
  })
})
