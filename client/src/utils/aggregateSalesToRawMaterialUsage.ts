import { SalesOrderType } from "../type/salesType";
import { TransformedItem } from "./transformItemWithComponents";

export interface RawMaterialUsageGrouped {
  unitofmeasure: string;
  quantityperMonth: Record<string, number>;
}

export function aggregateSalesToRawMaterialUsage(
  orders: SalesOrderType[],
  rawMaterials: Record<string, TransformedItem>
): Record<string, RawMaterialUsageGrouped> {
  const aggregated: Record<string, RawMaterialUsageGrouped> = {};
  const months = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

  // Process only orders with status "COMPLETED"
  for (const order of orders) {
    if (order.status !== "COMPLETED") continue;
    // Extract month from order.orderDate (e.g., "2025-01-01" -> "01" -> "1")
    const orderMonthStr = order.orderDate.substring(5, 7);
    const orderMonth = parseInt(orderMonthStr, 10).toString();

    for (const detail of order.details) {
      // Use detail.item.id as the finished product id.
      const fpId = detail.item.id?.toString();
      const productRaw = fpId && rawMaterials[fpId];
      if (!productRaw) continue; // Skip if there's no raw material mapping for this finished product

      // For each component in the finished product raw material data
      for (const comp of productRaw.components) {
        // Use the component's raw material description (lowercase) as the grouping key.
        const compKey = comp.description.toLowerCase();
        // Initialize if missing.
        if (!aggregated[compKey]) {
          const quantityperMonth: Record<string, number> = {};
          for (const m of months) {
            quantityperMonth[m] = 0;
          }
          aggregated[compKey] = {
            unitofmeasure: comp.unit,
            quantityperMonth,
          };
        }
        // Calculate usage: order detail quantity * component.quantity
        const usage = detail.orderQuantity * comp.quantity;
        // Aggregate usage into the proper month.
        aggregated[compKey].quantityperMonth[orderMonth] += usage;
      }
    }
  }
  return aggregated;
}
