import { createSlice } from "@reduxjs/toolkit"
import { InventoryPerCategory } from "../../type/stockType"

interface state {
  inventory: InventoryPerCategory[]
}

const initialState: state = {
  inventory: [],
}

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    initialInventory(state, action) {
      state.inventory = action.payload
    },
    rawMatsStockOut(state, action) {
      const { itemId, quantity } = action.payload
      console.log("Dispatched")
      state.inventory = state.inventory.map((item) =>
        item.item.id === itemId
          ? { ...item, outQuantity: (item.outQuantity || 0) + quantity }
          : item
      )
    },
  },
})

export const { initialInventory, rawMatsStockOut } = inventorySlice.actions
export default inventorySlice.reducer
