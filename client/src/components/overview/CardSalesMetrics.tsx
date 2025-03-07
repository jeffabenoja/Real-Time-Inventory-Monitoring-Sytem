import { SalesOrderType } from "../../type/salesType"
import { useState, useMemo } from "react"
import CardSalesRevenue from "./salesMetrics/CardSalesRevenue"
import CardTotalSales from "./salesMetrics/CardTotalSales"
import CardAveragePrice from "./salesMetrics/CardAveragePrice"

const formatDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

interface CardSalesMetricsProps {
  sales: SalesOrderType[]
}

const getCurrentMonthRange = () => {
  const today = new Date()
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

  console.log(endOfMonth)

  return { startOfMonth, endOfMonth }
}

const CardSalesMetrics: React.FC<CardSalesMetricsProps> = ({ sales }) => {
  const currentDate = new Date()
  const [timeframe, setTimeframe] = useState("monthly")

  const { startOfMonth, endOfMonth } = getCurrentMonthRange()

  const filterSalesByTimeframe = (
    sales: SalesOrderType[],
    timeframe: string
  ) => {
    const currentFormattedDate = formatDate(currentDate)

    return sales.filter((sale) => {
      const orderDate = formatDate(new Date(sale.orderDate))

      switch (timeframe) {
        case "daily":
          return orderDate === currentFormattedDate
        case "weekly":
          const sevenDaysAgo = new Date(currentDate)
          sevenDaysAgo.setDate(currentDate.getDate() - 7)
          const sevenDaysAgoFormatted = formatDate(sevenDaysAgo)
          return (
            orderDate >= sevenDaysAgoFormatted &&
            orderDate <= currentFormattedDate
          )
        case "monthly":
          return (
            orderDate >= startOfMonth.toISOString().split("T")[0] &&
            orderDate <= endOfMonth.toISOString().split("T")[0]
          )
      }
    })
  }

  const filteredSales = useMemo(() => {
    return filterSalesByTimeframe(sales, timeframe)
  }, [sales, timeframe])

  const averageChangePercentage =
    filteredSales.reduce((acc: number, curr: any) => {
      const totalAmount = Array.isArray(curr.details)
        ? curr.details.reduce((sum: number, item: any) => sum + item.amount, 0)
        : 0
      return acc + totalAmount
    }, 0) / filteredSales.length || 0

  const totalValueSum =
    filteredSales.reduce((acc: number, curr: any) => {
      const totalAmount = Array.isArray(curr.details)
        ? curr.details.reduce((sum: number, item: any) => sum + item.amount, 0)
        : 0
      return acc + totalAmount
    }, 0) || 0

  const totalSales = filteredSales.length

  const totalItems = filteredSales.reduce((acc: number, curr: any) => {
    return acc + (Array.isArray(curr.details) ? curr.details.length : 0)
  }, 0)

  const totalItemPrice = filteredSales.reduce((acc: number, curr: any) => {
    if (Array.isArray(curr.details)) {
      return (
        acc +
        curr.details.reduce((sum: number, item: any) => sum + item.itemPrice, 0)
      )
    }
    return acc
  }, 0)

  const averageItemPrice = totalItems > 0 ? totalItemPrice / totalItems : 0

  return (
    <div className='flex flex-col justify-between row-span-2 shadow-md rounded-2xl bg-[#FAFAFA] px-5 '>
      <div className='flex justify-between items-center px-2.5 pt-5 mb-2'>
        <h2 className='text-lg font-semibold '>Sales Metrics</h2>
        <select
          className='shadow-sm border border-gray-300 p-2 rounded'
          value={timeframe}
          onChange={(e) => {
            setTimeframe(e.target.value)
          }}
        >
          <option value='daily'>Daily</option>
          <option value='weekly'>Weekly</option>
          <option value='monthly'>Monthly</option>
        </select>
      </div>
      <hr />
      <div className='flex justify-between items-center gap-2.5'>
        <CardSalesRevenue
          totalValueSum={totalValueSum}
          averageChangePercentage={averageChangePercentage}
        />
        <CardAveragePrice averageItemPrice={averageItemPrice} />
        <CardTotalSales totalSales={totalSales} />
      </div>
    </div>
  )
}

export default CardSalesMetrics
