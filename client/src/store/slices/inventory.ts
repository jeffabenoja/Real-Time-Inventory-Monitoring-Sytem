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
    updateInventory(state, action) {
      const { itemId, quantity } = action.payload

      state.inventory = state.inventory.map((item) =>
        item.item.id === itemId
          ? { ...item, outQuantity: item.outQuantity + quantity }
          : item
      )
    },
  },
})

export const { initialInventory, updateInventory } = inventorySlice.actions
export default inventorySlice.reducer
