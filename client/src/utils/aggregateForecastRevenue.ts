// Define a type for finished product data (adjust as needed)
interface FinishedProductData {
    finishedProduct: {
      id: number;
      description: string;
      price: number;
      cost: number;
      averageCost: number;
    };
  }
  
  /**
   * Aggregates forecast revenue per month.
   *
   * @param forecasts - An object keyed by product id where each value is an object with month keys ("1", "2", …, "12")
   *                    mapping to an array of numbers (the forecast values).
   * @param finishedProducts - An object keyed by product id that contains finished product data (price, etc.).
   * @returns An object mapping abbreviated month names ("jan", "feb", …, "dec") to the total revenue.
   */
  
  export function aggregateForecastRevenue(
    data: Record<string, Record<string, number[]>>,
    finishedProducts: Record<string, FinishedProductData>
  ): Record<string, number> {
    if (!data) return {};
  
    // Map month keys ("1", "2", …, "12") to abbreviated month names.
    const monthMap: Record<string, string> = {
      "1": "jan",
      "2": "feb",
      "3": "mar",
      "4": "apr",
      "5": "may",
      "6": "jun",
      "7": "jul",
      "8": "aug",
      "9": "sep",
      "10": "oct",
      "11": "nov",
      "12": "dec",
    };
  
    // Initialize aggregated results for each month.
    const aggregated: Record<string, number> = {
      jan: 0,
      feb: 0,
      mar: 0,
      apr: 0,
      may: 0,
      jun: 0,
      jul: 0,
      aug: 0,
      sep: 0,
      oct: 0,
      nov: 0,
      dec: 0,
    };
  
    // Iterate over each product id.
    for (const productId in data) {
      const productForecast = data[productId];
      // Get finished product's price.
      const price = finishedProducts[productId]?.finishedProduct.price;
      if (price === undefined) continue;
  
      // For each month in this product's forecast.
      for (const monthKey in productForecast) {
        const valuesArray = productForecast[monthKey];
        // Sum the forecast values.
        const sum = valuesArray.reduce((acc, val) => acc + val, 0);
        // Multiply by the finished product price.
        const revenue = sum * price;
        const monthName = monthMap[monthKey];
        if (monthName) {
          aggregated[monthName] += revenue;
        }
      }
    }
    return aggregated;
  }
  