import React, { useState, useMemo } from "react"
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
} from "recharts"
import { SalesOrderType } from "../../type/salesType"
import { TransformedItem } from "../../utils/transformItemWithComponents"
import { groupPredictedUsageByComponent } from "../../utils/groupPredictedUsageByComponent"
import { aggregateSalesToRawMaterialUsage } from "../../utils/aggregateSalesToRawMaterialUsage"
import getCurrentMonth from "../../utils/getCurrentMonth"
import Spinner from "../common/utils/Spinner"

let currentMonth = getCurrentMonth()

interface MonthData {
  month: string
  actual: number | null
  forecast: number
}

interface RawMaterialData {
  unitofmeasure: string
  quantityperMonth: Record<string, number>
}

interface Props {
  notLoading: boolean
  predictedData: Record<string, any>
  itemComponents: Record<string, TransformedItem>
  sales: SalesOrderType[]
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
]

function getCurrentMonthIndex(): number {
  return new Date().getMonth()
}

const RawMatForecast: React.FC<Props> = React.memo(
  ({ notLoading, predictedData, itemComponents, sales }) => {
    if (!notLoading) return <Spinner />

    const rawMaterialForecast = useMemo(
      () => groupPredictedUsageByComponent(predictedData, itemComponents),
      [predictedData, itemComponents]
    )
    
    const rawMaterialActual = useMemo(
      () => aggregateSalesToRawMaterialUsage(sales, itemComponents),
      [sales, itemComponents]
    )


    const [selectedMaterial, setSelectedMaterial] = useState<string>("sugar")

    const forecastData: Record<string, number> =
      (rawMaterialForecast[selectedMaterial] as RawMaterialData)
        ?.quantityperMonth || {}
    const actualData: Record<string, number> =
      (rawMaterialActual[selectedMaterial] as RawMaterialData)
        ?.quantityperMonth || {}

    const currentMonthIndex = getCurrentMonthIndex()

    const data: MonthData[] = useMemo(
      () =>
        monthOrder.map((m, index) => ({
          month: m.charAt(0).toUpperCase() + m.slice(1),
          forecast: forecastData[(index + 1).toString()] ?? 0,
          actual:
            index <= currentMonthIndex
              ? actualData[(index + 1).toString()] ?? null
              : null,
        })),
      [forecastData, actualData, currentMonthIndex]
    )

    const materialOptions = useMemo(
      () => Object.keys(rawMaterialForecast),
      [rawMaterialForecast]
    )
    const unit =
      (rawMaterialForecast[selectedMaterial] as RawMaterialData)
        ?.unitofmeasure || ""

    const formatYAxisTick = (value: number) => {
      if (unit === "liters") {
        return `${value}ltrs`
      }
      return `${value}${unit}`
    }

    let content

    if (notLoading) {
      content = (
        <>
          <div className='flex justify-between items-center mb-2'>
            <h2 className='text-lg font-semibold'>Resources Forecast</h2>
            <select
              id='material-select'
              value={selectedMaterial}
              onChange={(e) => setSelectedMaterial(e.target.value)}
              className='border border-gray-300 p-2  rounded block focus:outline-none focus:ring-0 text-sm cursor-pointer'
            >
              {materialOptions.map((material) => (
                <option key={material} value={material}>
                  {material.charAt(0).toUpperCase() + material.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <hr />

          <ResponsiveContainer width='100%' height={450}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='month' tick={{ fontSize: 12, fill: "#333" }} />
              <YAxis tickFormatter={formatYAxisTick} />
              <Tooltip
                formatter={(value: number, name: string) => [
                  `${value.toFixed(2)} ${unit}`,
                  name,
                ]}
              />
              <Legend verticalAlign='top' />
              <Line
                type='monotone'
                dataKey='forecast'
                stroke='#8884d8'
                name='Forecast'
                dot={{ r: 3 }}
              />
              {data.some((d) => d.actual !== null) && (
                <Line
                  type='monotone'
                  dataKey='actual'
                  stroke='#82ca9d'
                  name='Actual'
                  dot={{ r: 3 }}
                  connectNulls={true}
                />
              )}
              <ReferenceLine
                x={currentMonth}
                stroke='red'
                strokeDasharray='3 3'
              />
            </LineChart>
          </ResponsiveContainer>
        </>
      )
    } else {
      content = <Spinner />
    }

    return (
      <div className='shadow-md rounded-2xl bg-[#FAFAFA] p-5'>{content}</div>
    )
  }
)

export default RawMatForecast
