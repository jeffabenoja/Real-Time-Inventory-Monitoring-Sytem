import { TransformedItem } from "./transformItemWithComponents";

export interface PredictedRawMaterialUsageGrouped {
    unitofmeasure: string;
    quantityperMonth: Record<string, number>;
  }
  
  /**
   * Maps and aggregates predicted finished-product sales to raw material usage grouped by component.
   *
   * @param predictedSales - An object where each finished product id maps to an object whose keys are month numbers (as strings)
   *                         and values are arrays of predicted finished-product sales numbers.
   * @param rawMaterials - An object where each finished product id maps to its raw material data (TransformedItem).
   * @returns An object keyed by raw material name (lowercase) where each value contains the unit of measure and a mapping of month keys ("1" to "12") to aggregated predicted usage.
   */
  export function groupPredictedUsageByComponent(
    predictedSales: Record<string, Record<string, number[]>> | undefined,
    rawMaterials: Record<string, TransformedItem> | undefined
  ): Record<string, PredictedRawMaterialUsageGrouped> {
    if (!predictedSales || !rawMaterials) return {};
    
    const aggregated: Record<string, PredictedRawMaterialUsageGrouped> = {};
    const allMonths = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
    
    for (const fpId in predictedSales) {
      const productForecast = predictedSales[fpId];
      const productRaw = rawMaterials[fpId];
      if (!productRaw) {
        console.warn(`No raw material data for finished product id ${fpId}`);
        continue;
      }
      
      for (const monthKey in productForecast) {
        const totalSales = productForecast[monthKey].reduce((acc, val) => acc + val, 0);
        productRaw.components.forEach((comp) => {
          const compKey = comp.description.toLowerCase();
          if (!aggregated[compKey]) {
            const quantityperMonth: Record<string, number> = {};
            allMonths.forEach((m) => { quantityperMonth[m] = 0; });
            aggregated[compKey] = {
              unitofmeasure: comp.unit,
              quantityperMonth,
            };
          }
          const predictedUsage = totalSales * comp.quantity;
          aggregated[compKey].quantityperMonth[monthKey] += predictedUsage;
        });
      }
    }
    return aggregated;
  }
  