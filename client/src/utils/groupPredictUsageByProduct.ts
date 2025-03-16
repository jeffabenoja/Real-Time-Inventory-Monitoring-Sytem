import { TransformedItem } from "./transformItemWithComponents";

export interface PredictedProductUsageGrouped {
  unitofmeasure: string;
  quantityperMonth: Record<string, number>;
}

/**
 * Aggregates predicted finished-product sales into finished-product usage grouped by product.
 *
 * @param predictedSales - An object where each finished product id maps to an object whose keys are month numbers (as strings)
 *                         and values are arrays of predicted finished-product sales numbers.
 * @param items - An object where each finished product id maps to its transformed item data.
 * @returns An object keyed by finished product name (lowercase) where each value contains the unit of measure and a mapping
 *          of month keys ("1" to "12") to aggregated predicted usage, formatted to two decimal points.
 */
export function groupPredictedUsageByProduct(
  predictedSales: Record<string, Record<string, number[]>> | undefined,
  items: Record<string, TransformedItem> | undefined
): Record<string, PredictedProductUsageGrouped> {
  if (!predictedSales || !items) return {};

  const aggregated: Record<string, PredictedProductUsageGrouped> = {};
  const allMonths = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

  for (const fpId in predictedSales) {
    const productForecast = predictedSales[fpId];
    const item = items[fpId];
    if (!item) {
      console.warn(`No item data for finished product id ${fpId}`);
      continue;
    }

    // Use the finished product description (lowercase) as the grouping key.
    const productKey = item.finishedProduct.description.toLowerCase();

    if (!aggregated[productKey]) {
      const quantityperMonth: Record<string, number> = {};
      allMonths.forEach((m) => {
        quantityperMonth[m] = 0;
      });
      aggregated[productKey] = {
        unitofmeasure: "pcs", // Finished products are counted in pieces
        quantityperMonth,
      };
    }

    for (const monthKey in productForecast) {
      const totalSales = productForecast[monthKey].reduce(
        (acc, val) => acc + val,
        0
      );
      aggregated[productKey].quantityperMonth[monthKey] += totalSales;
    }
  }

  // Format each aggregated value to two decimal points.
  for (const key in aggregated) {
    allMonths.forEach((month) => {
      aggregated[key].quantityperMonth[month] = parseFloat(
        aggregated[key].quantityperMonth[month].toFixed(2)
      );
    });
  }

  return aggregated;
}