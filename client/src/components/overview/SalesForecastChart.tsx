import {
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

interface Props {
  notLoading: boolean;
  forecastData: Record<string, any>;
  itemComponents: Record<string, TransformedItem>;
  sales: SalesOrderType[];
}

export default function SalesForecastChart({
  notLoading,
  forecastData,
  itemComponents,
  sales,
}: Props) {
  if (!notLoading) {
    return <p>STILL LOADING...</p>;
  }

  const aggregatedForecast = aggregateForecastRevenue(
    forecastData,
    itemComponents
  );
  const aggregatedSales = aggregateSalesByMonth(sales);

  const data = mergeSalesData(aggregatedSales, aggregatedForecast)

  console.log(data)

  return (
    <LineChart width={600} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Legend />
      {/* Actual sales line stops at March since later months are null */}
      <Line
        type="monotone"
        dataKey="actual"
        stroke="#8884d8"
        name="Actual Sales"
      />
      {/* Forecasted sales line for the entire year */}
      <Line
        type="monotone"
        dataKey="forecast"
        stroke="#82ca9d"
        name="Forecasted Sales"
      />
      {/* Reference line at March to indicate current month */}
      <ReferenceLine
        x="Mar"
        stroke="red"
        strokeDasharray="3 3"
        label="Current Month"
      />
    </LineChart>
  );
}
