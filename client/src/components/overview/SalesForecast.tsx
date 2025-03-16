import React, { useMemo } from "react";
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
import { TransformedItem } from "../../utils/transformItemWithComponents";
import { SalesOrderType } from "../../type/salesType";
import { aggregateForecastRevenue } from "../../utils/aggregateForecastRevenue";
import { aggregateSalesByMonth } from "../../utils/aggregateSalesByMonth";
import { mergeSalesData } from "../../utils/mergeSalesData";
import getCurrentMonth from "../../utils/getCurrentMonth";

let currentMonth = getCurrentMonth();

interface Props {
  notLoading: boolean;
  forecastData: Record<string, any>;
  itemComponents: Record<string, TransformedItem>;
  sales: SalesOrderType[];
}

const SalesForecastChart: React.FC<Props> = React.memo(
  ({ notLoading, forecastData, itemComponents, sales }) => {
    if (!notLoading) return <p>STILL LOADING...</p>;

    // Memoize aggregated forecast and sales data.
    const aggregatedForecast = useMemo(
      () => aggregateForecastRevenue(forecastData, itemComponents),
      [forecastData, itemComponents]
    );
    const aggregatedSales = useMemo(
      () => aggregateSalesByMonth(sales),
      [sales]
    );
    const data = useMemo(
      () => mergeSalesData(aggregatedSales, aggregatedForecast),
      [aggregatedSales, aggregatedForecast]
    );

    // Y-axis tick formatter: retain "P" prefix; if value >= 1000, show in thousands with "K".
    const formatYAxisTick = (value: number) => {
      if (value >= 1000) {
        return `P${(value / 1000).toFixed(0)}K`;
      }
      return `P${value}`;
    };

    return (
      <div className="shadow-md rounded-2xl bg-[#FAFAFA] p-5">
        <h2 className="text-lg font-semibold mb-2">Sales Forecast</h2>
        <hr />
        <ResponsiveContainer width="100%" height={450}>
          <LineChart
            data={data}
            margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#333" }} />
            <YAxis
              tickFormatter={formatYAxisTick}
              tick={{ fontSize: 12, fill: "#333" }}
              label={{
                angle: -90,
                position: "insideLeft",
                offset: 10,
              }}
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                `P${value.toFixed(2)}`,
                name,
              ]}
            />
            <Legend verticalAlign="top" height={36} />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#8884d8"
              name="Actual Sales"
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="forecast"
              stroke="#82ca9d"
              name="Forecasted Sales"
              dot={{ r: 3 }}
            />
            <ReferenceLine
              x={currentMonth}
              stroke="red"
              strokeDasharray="3 3"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
);

export default SalesForecastChart;
