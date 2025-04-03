import { ItemType } from "../type/itemType";
import { InventoryPerCategory } from "../type/stockType";

export default function mergeData(
    products: ItemType[],
    inventory: InventoryPerCategory[]
  ): ItemType[] {
    return products
      .map((product) => {
        const matchingPin = inventory.find((inv) => inv.item.id === product.id);
        if (matchingPin) {
          // Compute current stock from the pin data
          const currentStock = Math.round(
            matchingPin.inQuantity - matchingPin.outQuantity
          );
          return { ...product, currentStock };
        }
        // Ensure every product has a currentStock property, defaulting to 0 if not found.
        return { ...product, currentStock: 0 };
      })
      .sort((a, b) => (a.currentStock ?? 0) - (b.currentStock ?? 0));
  }
