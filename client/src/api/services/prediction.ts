import apiClient from "../../utils/apiClient";
import { PREDICT } from "../urls/predictionUrl";

export const getPredictions = async () => {
  const response = await apiClient.get(PREDICT);

  const data = response.data;

  const result: Record<string, any> = {};

  for (const id in data) {
    const item = data[id];
    if (item && typeof item === "object" && "forecast" in item) {
      const forecast = item.forecast;
      const sortedEntries = Object.entries(forecast).sort((a, b) => a[0].localeCompare(b[0]));
      const monthlyGroup: Record<string, number[]> = {};

      for (const [date, value] of sortedEntries) {
        const month = parseInt(date.substring(5, 7), 10).toString();
        if (!monthlyGroup[month]) {
          monthlyGroup[month] = [];
        }
        monthlyGroup[month].push(Math.round(value as number));
      }

      const sortedMonthlyGroup: Record<string, number[]> = {};
      Object.keys(monthlyGroup)
        .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
        .forEach(month => {
          sortedMonthlyGroup[month] = monthlyGroup[month];
        });

      result[id] = sortedMonthlyGroup;
    }
  }
  return result;
};
