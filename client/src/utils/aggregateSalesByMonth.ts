import { SalesOrderType } from "../type/salesType"; // adjust path as needed

export function aggregateSalesByMonth(
  orders: SalesOrderType[]
): Record<string, number> {
  // Mapping of two-digit month strings to abbreviated month names.
  const monthMap: Record<string, string> = {
    "01": "jan",
    "02": "feb",
    "03": "mar",
    "04": "apr",
    "05": "may",
    "06": "jun",
    "07": "jul",
    "08": "aug",
    "09": "sep",
    "10": "oct",
    "11": "nov",
    "12": "dec",
  };

  // Initialize accumulator with all months set to 0.
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

  orders
    .filter((order) => order.status === "COMPLETED")
    .forEach((order) => {
      // Extract month from orderDate (assuming format "YYYY-MM-DD")
      const orderMonth = order.orderDate.substring(5, 7); // e.g. "01"
      const monthAbbr = monthMap[orderMonth];
      if (!monthAbbr) return;
      // Sum up the amounts for all details in the order.
      const orderTotal = order.details.reduce((sum, detail) => sum + detail.amount, 0);
      aggregated[monthAbbr] += orderTotal;
    });

  return aggregated;
}