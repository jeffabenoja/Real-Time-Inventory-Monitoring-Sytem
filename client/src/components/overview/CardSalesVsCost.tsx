import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { SalesOrderType } from "../../type/salesType"
import { useState, useMemo } from "react"

const getMonthName = (dateString: string) => {
  const date = new Date(dateString)
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ]
  return months[date.getMonth()]
}

const getLast12Months = () => {
  const months = []
  const today = new Date()

  for (let i = 0; i < 12; i++) {
    const monthStart = new Date(today)
    monthStart.setMonth(today.getMonth() - i)
    monthStart.setDate(1)
    months.push(monthStart)
  }

  return months.reverse()
}
const getLast4Weeks = () => {
  const weeks = []
  const today = new Date()

  for (let i = 0; i < 4; i++) {
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - (today.getDay() + i * 7))
    startOfWeek.setHours(0, 0, 0, 0)

    const endOfWeek = new Date(today)
    endOfWeek.setDate(today.getDate() - (today.getDay() + (i - 1) * 7))
    endOfWeek.setHours(23, 59, 59, 999)

    weeks.push({ start: startOfWeek, end: endOfWeek })
  }

  return weeks.reverse()
}

const getLast7Days = () => {
  const days = []
  const today = new Date()

  for (let i = 0; i < 7; i++) {
    const day = new Date(today)
    day.setDate(today.getDate() - i)
    day.setHours(0, 0, 0, 0)
    days.push(day)
  }

  return days.reverse()
}
const formatDate = (date: Date) => {
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${month}/${day}`
}

interface SalesCostCircleProps {
  filteredTransactions: SalesOrderType[]
}

const CardSalesVsCost: React.FC<SalesCostCircleProps> = ({
  filteredTransactions,
}) => {
  const [timeframe, setTimeframe] = useState("yearly")

  const filterSalesByTimeframe = (
    sales: SalesOrderType[],
    timeframe: string
  ) => {
    return sales.filter((sale) => {
      const orderDate = new Date(sale.orderDate)

      switch (timeframe) {
        case "weekly":
          const last7Days = getLast7Days()
          return last7Days.some((day) => {
            return orderDate.toDateString() === day.toDateString()
          })
        case "monthly":
          const fourWeeks = getLast4Weeks()

          return fourWeeks.some(
            (week) => orderDate >= week.start && orderDate <= week.end
          )
        default:
          return true
      }
    })
  }

  const filteredSales = useMemo(() => {
    return filterSalesByTimeframe(filteredTransactions, timeframe)
  }, [filteredTransactions, timeframe])

  const last12MonthsDate = getLast12Months()
  const last4WeeksDate = getLast4Weeks()

  const groupedByYearlySales = filteredSales.reduce((acc: any, curr: any) => {
    const monthName = getMonthName(curr.orderDate)
    const totalAmount = Array.isArray(curr.details)
      ? curr.details.reduce((sum: number, item: any) => sum + item.amount, 0)
      : 0

    if (!acc[monthName]) {
      acc[monthName] = 0
    }

    acc[monthName] += totalAmount
    return acc
  }, {})

  const groupedByYearlyCost = filteredSales.reduce((acc: any, curr: any) => {
    const monthName = getMonthName(curr.orderDate)
    const totalAmount = Array.isArray(curr.details)
      ? curr.details.reduce(
          (sum: number, item: any) =>
            sum + item.item.averageCost * item.orderQuantity,
          0
        )
      : 0

    if (!acc[monthName]) {
      acc[monthName] = 0
    }

    acc[monthName] += totalAmount
    return acc
  }, {})

  const salesAndCostData = last12MonthsDate.map((monthStart) => {
    const monthName = getMonthName(monthStart.toISOString())

    return {
      month: monthName,
      sales: groupedByYearlySales[monthName] || 0,
      cost: groupedByYearlyCost[monthName] || 0,
    }
  })

  const groupedByWeeklySales = filteredSales.reduce((acc: any, curr: any) => {
    const orderDate = new Date(curr.orderDate)
    const weekStart = new Date(orderDate)
    weekStart.setDate(orderDate.getDate() - orderDate.getDay())

    const weekLabel = `${weekStart.getMonth() + 1}/${weekStart.getDate()}`

    const totalAmount = Array.isArray(curr.details)
      ? curr.details.reduce((sum: number, item: any) => sum + item.amount, 0)
      : 0

    if (!acc[weekLabel]) {
      acc[weekLabel] = 0
    }

    acc[weekLabel] += totalAmount
    return acc
  }, {})

  const groupedByWeeklyCost = filteredSales.reduce((acc: any, curr: any) => {
    const orderDate = new Date(curr.orderDate)
    const weekStart = new Date(orderDate)
    weekStart.setDate(orderDate.getDate() - orderDate.getDay())

    const weekLabel = `${weekStart.getMonth() + 1}/${weekStart.getDate()}`

    const totalAmount = Array.isArray(curr.details)
      ? curr.details.reduce(
          (sum: number, item: any) =>
            sum + item.item.averageCost * item.orderQuantity,
          0
        )
      : 0

    if (!acc[weekLabel]) {
      acc[weekLabel] = 0
    }

    acc[weekLabel] += totalAmount
    return acc
  }, {})

  const salesAndCostDataWeekly = last4WeeksDate.map((week) => {
    const weekLabel = `${week.start.getMonth() + 1}/${week.start.getDate()}`

    return {
      week: weekLabel,
      sales: groupedByWeeklySales[weekLabel] || 0,
      cost: groupedByWeeklyCost[weekLabel] || 0,
    }
  })

  const groupedByDailySales = filteredSales.reduce((acc: any, curr: any) => {
    const formattedDate = formatDate(new Date(curr.orderDate))

    const totalAmount = Array.isArray(curr.details)
      ? curr.details.reduce((sum: number, item: any) => sum + item.amount, 0)
      : 0

    if (!acc[formattedDate]) {
      acc[formattedDate] = 0
    }

    acc[formattedDate] += totalAmount
    return acc
  }, {})

  const groupedByDailyCost = filteredSales.reduce((acc: any, curr: any) => {
    const formattedDate = formatDate(new Date(curr.orderDate))

    const totalAmount = Array.isArray(curr.details)
      ? curr.details.reduce(
          (sum: number, item: any) =>
            sum + item.item.averageCost * item.orderQuantity,
          0
        )
      : 0

    if (!acc[formattedDate]) {
      acc[formattedDate] = 0
    }

    acc[formattedDate] += totalAmount
    return acc
  }, {})

  const last7Days = getLast7Days()

  const salesAndCostDataDaily = last7Days.map((day) => {
    const formattedDay = formatDate(day)
    return {
      day: formattedDay,
      sales: groupedByDailySales[formattedDay] || 0,
      cost: groupedByDailyCost[formattedDay] || 0,
    }
  })

  const totalSales = salesAndCostData.reduce((acc, curr) => acc + curr.sales, 0)
  const totalCost = salesAndCostData.reduce((acc, curr) => acc + curr.cost, 0)

  const salesPercentage = (totalSales / (totalSales + totalCost)) * 100
  const costPercentage = (totalCost / totalSales) * 100

  const circleRadius = 50
  const circleCircumference = 2 * Math.PI * circleRadius

  const strokeDashoffset =
    circleCircumference - (circleCircumference * salesPercentage) / 100

  const isCostGreater = totalCost > totalSales
  const circleText = isCostGreater
    ? `${costPercentage.toFixed(2)}%`
    : `${salesPercentage.toFixed(2)}%`

  const gradientStart = salesPercentage <= 50 ? salesPercentage : 50
  const gradientEnd = salesPercentage > 50 ? salesPercentage : 50

  return (
    <div className='flex flex-col row-span-6 shadow-md rounded-2xl bg-[#FAFAFA] px-5'>
      <div className='flex justify-between items-center px-2.5 pt-5 mb-2'>
        <h2 className='text-lg font-semibold'>Sales vs Cost Percentages</h2>
        <select
          className='shadow-sm border border-gray-300 p-2 rounded'
          value={timeframe}
          onChange={(e) => {
            setTimeframe(e.target.value)
          }}
        >
          <option value='weekly'>Weekly</option>
          <option value='monthly'>Montly</option>
          <option value='yearly'>1 Year</option>
        </select>
      </div>
      <hr />

      <div className='flex justify-between items-center'>
        <div className='flex-1 flex items-center justify-center'>
          <svg width='250' height='250' viewBox='0 0 120 120'>
            <defs>
              <linearGradient id='gradient'>
                {/* Red for 0% to 50% */}
                <stop offset={`${gradientStart}%`} stop-color='#8b5cf6' />
                {/* Green for 50% to 100% */}
                <stop offset={`${gradientEnd}%`} stop-color='#3b82f6' />
              </linearGradient>
            </defs>

            <circle
              cx='60'
              cy='60'
              r={circleRadius}
              fill='none'
              stroke='#ddd'
              strokeWidth='7'
            />

            <circle
              cx='60'
              cy='60'
              r={circleRadius}
              fill='none'
              stroke={`${isCostGreater ? "#F44336" : "url(#gradient)"}`}
              strokeWidth='7'
              strokeDasharray={circleCircumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap='round'
              transform='rotate(-90 60 60)'
            />

            <text
              x='50%'
              y='50%'
              textAnchor='middle'
              dominantBaseline='middle'
              className='text-xl font-extrabold'
            >
              {circleText}
            </text>
          </svg>
        </div>

        <div className='flex flex-col gap-2.5'>
          <div className='flex flex-col gap-2.5 p-2.5 shadow-md rounded-md'>
            <p className='text-sm text-gray-400 font-medium'>Amounts</p>
            <span className='text-sm  text-green-500 font-medium'>
              Total Sales:{" "}
              {new Intl.NumberFormat("en-PH", {
                style: "currency",
                currency: "PHP",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(totalSales)}
            </span>
            <span className='text-sm  text-red-500 font-medium'>
              Total Costs:{" "}
              {new Intl.NumberFormat("en-PH", {
                style: "currency",
                currency: "PHP",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(totalCost)}
            </span>
          </div>

          <div className='p-2.5 shadow-md rounded-md'>
            <div className='flex flex-col gap-2.5'>
              <p className='text-sm text-gray-400 font-medium'>Percentages</p>
              <span className='text-sm text-green-500 font-medium'>
                Sales: {salesPercentage.toFixed(2)}%
              </span>
              <span className='text-sm text-red-500 font-medium'>
                Costs: {costPercentage.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {timeframe === "yearly" && (
        <ResponsiveContainer width='100%' height={200}>
          <AreaChart
            data={salesAndCostData}
            height={100}
            margin={{ top: 0, right: 0, left: -10, bottom: 0 }}
          >
            <XAxis dataKey='month' tick={{ fontSize: 12, dx: -1 }} />
            <YAxis
              tickFormatter={(value) => {
                if (value >= 1000000) {
                  return `P${(value / 1000000).toFixed(1)}M`
                } else if (value >= 1000) {
                  return `P${(value / 1000).toFixed(0)}K`
                }
                return `P${value}`
              }}
              tick={{ fontSize: 12, dx: -1 }}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              formatter={(totalValue: number) => [
                `P${totalValue.toLocaleString("en")}`,
              ]}
              labelFormatter={(label) => label}
            />
            <Area
              type='monotone'
              dataKey='sales'
              stroke='#2563eb'
              fill='#3b82f6'
            />

            <Area
              type='monotone'
              dataKey='cost'
              stroke='#7c3aed'
              fill='#8b5cf6'
            />
          </AreaChart>
        </ResponsiveContainer>
      )}

      {timeframe === "weekly" && (
        <ResponsiveContainer width='100%' height={200}>
          <AreaChart
            data={salesAndCostDataDaily}
            height={100}
            margin={{ top: 0, right: 0, left: -10, bottom: 0 }}
          >
            <XAxis dataKey='day' tick={{ fontSize: 12, dx: -1 }} />
            <YAxis
              tickFormatter={(value) => {
                if (value >= 1000000) {
                  return `P${(value / 1000000).toFixed(1)}M`
                } else if (value >= 1000) {
                  return `P${(value / 1000).toFixed(0)}K`
                }
                return `P${value}`
              }}
              tick={{ fontSize: 12, dx: -1 }}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              formatter={(totalValue: number) => [
                `P${totalValue.toLocaleString("en")}`,
              ]}
              labelFormatter={(label) => label}
            />
            <Area
              type='monotone'
              dataKey='sales'
              stroke='#2563eb'
              fill='#3b82f6'
            />

            <Area
              type='monotone'
              dataKey='cost'
              stroke='#7c3aed'
              fill='#8b5cf6'
            />
          </AreaChart>
        </ResponsiveContainer>
      )}

      {timeframe === "monthly" && (
        <ResponsiveContainer width='100%' height={200}>
          <AreaChart
            data={salesAndCostDataWeekly}
            height={100}
            margin={{ top: 0, right: 0, left: -10, bottom: 0 }}
          >
            <XAxis dataKey='week' tick={{ fontSize: 12, dx: -1 }} />
            <YAxis
              tickFormatter={(value) => {
                if (value >= 1000000) {
                  return `P${(value / 1000000).toFixed(1)}M`
                } else if (value >= 1000) {
                  return `P${(value / 1000).toFixed(0)}K`
                }
                return `P${value}`
              }}
              tick={{ fontSize: 12, dx: -1 }}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              formatter={(totalValue: number) => [
                `P${totalValue.toLocaleString("en")}`,
              ]}
              labelFormatter={(label) => label}
            />
            <Area
              type='monotone'
              dataKey='sales'
              stroke='#2563eb'
              fill='#3b82f6'
            />

            <Area
              type='monotone'
              dataKey='cost'
              stroke='#7c3aed'
              fill='#8b5cf6'
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default CardSalesVsCost
