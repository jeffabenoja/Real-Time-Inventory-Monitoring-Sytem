export interface AccuracyMetrics {
  MAE: number;
  RMSE: number;
  MAPE: number;
  SMAPE: number;
}

export interface ProductForecast {
  forecast: Record<string, number>;
  accuracy_metrics: AccuracyMetrics;
}

export type ProductData = ProductForecast | string;

export interface Prediction {
  date: string;
  prediction: number;
}


