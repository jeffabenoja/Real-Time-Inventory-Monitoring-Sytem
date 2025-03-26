import apiClient from "../../utils/apiClient";
import { PREDICT } from "../urls/predictionUrl";
import { ProductForecast, ProductData, Prediction } from "../../type/productForecastType";
import formatLocalDate from "../../utils/formatLocalDate";

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

const getPredictionForForecast = (
  forecast: Record<string, number>,
  targetDate: string
): Prediction | null => {
  if (forecast[targetDate] !== undefined) {
    return { date: targetDate, prediction: forecast[targetDate] };
  }
  const forecastDates = Object.keys(forecast).sort();
  if (forecastDates.length === 0) return null;
  let closestDate = forecastDates[0];
  let minDiff = Math.abs(new Date(closestDate).getTime() - new Date(targetDate).getTime());
  for (const dateStr of forecastDates) {
    const diff = Math.abs(new Date(dateStr).getTime() - new Date(targetDate).getTime());
    if (diff < minDiff) {
      minDiff = diff;
      closestDate = dateStr;
    }
  }
  return { date: closestDate, prediction: forecast[closestDate] };
};

export const getThisWeeksPrediction = async (): Promise<
  Record<string, Prediction | string>
> => {
  try {
    const response = await apiClient.get(PREDICT);
    const data: Record<string, ProductData> = response.data;
    const predictions: Record<string, Prediction | string> = {};

    // Calculate next Sunday's date.
    const today = new Date();
    const nextSunday = new Date(today);
    nextSunday.setDate(today.getDate() + (7 - today.getDay()));
    const targetDate = formatLocalDate(nextSunday);

    // Iterate over each product, skipping "256" and "257".
    for (const [productId, productData] of Object.entries(data)) {
      if (productData === "No saved model found for this item.") continue;
      if (
        typeof productData === "object" &&
        productData !== null &&
        "forecast" in productData
      ) {
        const forecast = (productData as ProductForecast).forecast;
        const prediction = getPredictionForForecast(forecast, targetDate);
        if (prediction) {
          // Round the prediction to two decimal places.
          const roundedPrediction = Math.round(prediction.prediction);
          predictions[productId] = { date: prediction.date, prediction: roundedPrediction };
        } else {
          predictions[productId] = "Prediction not found";
        }
      } else {
        predictions[productId] = productData;
      }
    }
    return predictions;
  } catch (error) {
    console.error("Error in getThisWeeksPrediction:", error);
    return {};
  }
};