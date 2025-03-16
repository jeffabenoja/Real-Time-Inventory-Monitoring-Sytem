import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import { SalesOrderType } from "../../type/salesType";
import { TransformedItem } from "../../utils/transformItemWithComponents";
import { groupPredictedUsageByProduct } from "../../utils/groupPredictUsageByProduct";
import { aggregateSalesToFinishedProductUsage } from "../../utils/aggregateSalesToProductUsage";
import getCurrentMonth from "../../utils/getCurrentMonth";
import Spinner from "../common/utils/Spinner";

let currentMonth = getCurrentMonth();

interface MonthData {
  month: string;
  actual: number | null;
  forecast: number;
}

interface ProductUsageData {
  unitofmeasure: string;
  quantityperMonth: Record<string, number>;
}

interface Props {
  notLoading: boolean;
  predictedData: Record<string, any>;
  itemComponents: Record<string, TransformedItem>;
  sales: SalesOrderType[];
}

const monthOrder = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

function getCurrentMonthIndex(): number {
  return new Date().getMonth();
}

const ProductsForecastChart: React.FC<Props> = React.memo(
  ({ notLoading, predictedData, itemComponents, sales }) => {
    if (!notLoading) return <p className="text-gray-500">Still loading...</p>;

    // Group predicted and actual product usage data.
    const productForecast = useMemo(
      () => groupPredictedUsageByProduct(predictedData, itemComponents),
      [predictedData, itemComponents]
    );
    const productActual = useMemo(
      () => aggregateSalesToFinishedProductUsage(sales, itemComponents),
      [sales, itemComponents]
    );

    const [selectedProduct, setSelectedProduct] = useState<string>("banana");

    const forecastData: Record<string, number> =
      (productForecast[selectedProduct] as ProductUsageData)
        ?.quantityperMonth || {};
    const actualData: Record<string, number> =
      (productActual[selectedProduct] as ProductUsageData)?.quantityperMonth ||
      {};

    const currentMonthIndex = getCurrentMonthIndex();

    const data: MonthData[] = useMemo(
      () =>
        monthOrder.map((m, index) => {
          const monthKey = (index + 1).toString();
          return {
            month: m.charAt(0).toUpperCase() + m.slice(1),
            forecast: forecastData[monthKey] ?? 0,
            actual:
              index <= currentMonthIndex ? actualData[monthKey] ?? null : null,
          };
        }),
      [forecastData, actualData, currentMonthIndex]
    );

    const productOptions = useMemo(
      () => Object.keys(productForecast),
      [productForecast]
    );
    const unit =
      (productForecast[selectedProduct] as ProductUsageData)?.unitofmeasure ||
      "";

    // Y-axis formatter: shows "P" prefix and appends "K" if value is in thousands.
    const formatYAxisTick = (value: number) => {
      return `${value}${unit}`;
    };

    let content

    if(notLoading){
      content = <>
      <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Products Forecast</h2>
            <select
              id="product-select"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="border border-gray-300 p-2 rounded block focus:outline-none focus:ring-0 text-sm cursor-pointer"
            >
              {productOptions.map((product) => (
                <option key={product} value={product}>
                  {product.charAt(0).toUpperCase() + product.slice(1)}
                </option>
              ))}
            </select>
        </div>
        <hr />

        <ResponsiveContainer width="100%" height={450}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#333" }} />
            <YAxis tickFormatter={formatYAxisTick} />
            <Tooltip
              formatter={(value: number, name: string) => [
                `${value.toFixed(2)} ${unit}`,
                name,
              ]}
            />
            <Legend verticalAlign="top" height={36} />
            <Line
              type="monotone"
              dataKey="forecast"
              stroke="#8884d8"
              name="Forecast"
              dot={{ r: 3 }}
            />
            {data.some((d) => d.actual !== null) && (
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#82ca9d"
                name="Actual"
                dot={{ r: 3 }}
                connectNulls={true}
              />
            )}
            <ReferenceLine
              x={currentMonth}
              stroke="red"
              strokeDasharray="3 3"
            />
          </LineChart>
        </ResponsiveContainer>
      </>
    } else {
      content = <Spinner />
    }

    return (
      <div className="shadow-md rounded-2xl bg-[#FAFAFA] p-5">
        {content}
      </div>
    );
  }
);

export default ProductsForecastChart;
