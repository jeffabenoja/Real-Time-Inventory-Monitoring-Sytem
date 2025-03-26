export interface ItemType {
    code: string;
    description: string;
    category: "Raw Mats" | "Finished Goods" | "";
    brand: string;
    unit: string;
    reorderPoint?: number;
    price?: number;
    cost?: number;
    averageCost?: number;
    status?: "ACTIVE" | "INACTIVE";
    id?: string;
  }
  
  export interface ComponentsMaterials {
    rawMaterial: ItemType;
    quantity?: string;
  }
  
  export interface ProductWithComponents {
    finishProduct: ItemType;
    components: ComponentsMaterials[];
  }
  
  export interface InventoryPerCategory {
    item: ItemType;
    id: string;
    itemType: string;
    inQuantity: number;
    outQuantity: number;
  }
  
  // Define a ForecastEntry interface
  export interface ForecastEntry {
    id: number;
    forecast: number;
    label: string;
  }
  
  // The forecast mapping is keyed by description
  export type ForecastMapping = { [description: string]: ForecastEntry };
  
  // Define the merged result interface
  export interface MergedResult {
    name: string;
    id: string;
    forecast: number;
    label: string;
    currentStock: number;
  }
  
  export type MergedMapping = { [id: string]: MergedResult };
  
  export default function mergeInventoryForecast(
    inventory: InventoryPerCategory[],
    forecastMapping: { [description: string]: { id: number; forecast: number; label: string } }
  ): { name: string; id: string; forecast: string; currentStock: string }[] {
    // Build a lookup map for inventory using the inventory item's id as a string
    const inventoryMap = new Map<string, InventoryPerCategory>();
    inventory.forEach((inv) => {
      // Convert the item's id to string for consistency
      if (inv.item.id) {
        inventoryMap.set(String(inv.item.id), inv);
      }
    });
  
    const merged: { name: string; id: string; forecast: string; currentStock: string; code: string }[] = [];
  
    // Iterate over each forecast entry
    for (const description in forecastMapping) {
      const forecastEntry = forecastMapping[description];
      // Convert the forecast id to string so it can be matched in inventoryMap
      const key = String(forecastEntry.id);
      const invItem = inventoryMap.get(key);
      if (invItem) {
        merged.push({
          name: invItem.item.description,
          id: key,
          forecast: `${Math.ceil(forecastEntry.forecast)} ${forecastEntry.label}`,
          currentStock: `${invItem.inQuantity - invItem.outQuantity} ${forecastEntry.label}`,
          code: invItem.item.code
        });
      }
    }
  
    return merged;
  }