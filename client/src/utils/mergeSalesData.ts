export function mergeSalesData(
    actual: Record<string, number>,
    forecast: Record<string, number>
  ): { month: string; actual: number | null; forecast: number }[] {
    const monthOrder = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    
    return monthOrder.map((m) => {
      const monthCap = m.charAt(0).toUpperCase() + m.slice(1);
      const aVal = actual[m];
      // If actual value is undefined or 0, set it to null.
      const actualValue = (aVal === undefined || aVal === 0) ? null : aVal;
      return {
        month: monthCap,
        actual: actualValue,
        forecast: forecast[m],
      };
    });
  }