import { SalesOrderType } from "../type/salesType";
import { TransformedItem } from "./transformItemWithComponents";

export interface FinishedProductUsageGrouped {
  unitofmeasure: string;
  quantityperMonth: Record<string, number>;
}

export function aggregateSalesToFinishedProductUsage(
  orders: SalesOrderType[],
  items: Record<string, TransformedItem>
): Record<string, FinishedProductUsageGrouped> {
  const aggregated: Record<string, FinishedProductUsageGrouped> = {};
  const months = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

  // Process only orders with status "COMPLETED"
  for (const order of orders) {
    if (order.status !== "COMPLETED") continue;
    // Extract month from order.orderDate (e.g., "2025-01-01" -> "01" -> "1")
    const orderMonthStr = order.orderDate.substring(5, 7);
    const orderMonth = parseInt(orderMonthStr, 10).toString();

    for (const detail of order.details) {
      // Use detail.item.id as the finished product id.
      const itemId = detail.item.id?.toString();
      const transformed = itemId && items[itemId];
      if (!transformed) continue; // Skip if there's no transformed item for this order detail
      
      // Use the finished product description (lowercase) as the grouping key.
      const key = transformed.finishedProduct.description.toLowerCase();

      // Initialize if missing.
      if (!aggregated[key]) {
        const quantityperMonth: Record<string, number> = {};
        for (const m of months) {
          quantityperMonth[m] = 0;
        }
        aggregated[key] = {
          unitofmeasure: "pcs",
          quantityperMonth,
        };
      }
      // Aggregate usage: order detail quantity represents the number of finished products sold.
      aggregated[key].quantityperMonth[orderMonth] += detail.orderQuantity;
    }
  }
  return aggregated;
}