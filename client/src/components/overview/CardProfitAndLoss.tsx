import { useQuery } from "@tanstack/react-query"
import { getSalesOrderListByDateRange } from "../../api/services/sales"
import { SalesOrderType } from "../../type/salesType"
import Spinner from "../common/utils/Spinner"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const getMonthName = (dateString: string) => {
  const date = new Date(dateString)
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  return months[date.getMonth()]
}

const getLast12Months = () => {
  const months = []
  const today = new Date("2024-12-31")
  for (let i = 0; i < 12; i++) {
    const month = new Date(today)
    month.setMonth(today.getMonth() - i)
    months.push(month.getMonth())
  }
  return months.reverse()
}

const CardProfitAndLoss = () => {
  const { data: transactionsData = [], isLoading } = useQuery<SalesOrderType[]>(
    {
      queryKey: ["Sales", "Summary"],
      queryFn: () =>
        getSalesOrderListByDateRange({
          from: "2024-01-01",
          to: "2024-12-31",
        }),
    }
  )

  const groupedByMonthExpenses = transactionsData.reduce(
    (acc: any, curr: any) => {
      const monthName = getMonthName(curr.orderDate)
      const totalAmount = Array.isArray(curr.details)
        ? curr.details.reduce(
            (sum: number, item: any) => sum + item.item.averageCost,
            0
          )
        : 0

      if (!acc[monthName]) {
        acc[monthName] = 0
      }

      acc[monthName] += totalAmount
      return acc
    },
    {}
  )

  const groupedByMonthSales = transactionsData.reduce((acc: any, curr: any) => {
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

  const last12Months = getLast12Months()

  const chartData = last12Months.map((monthIndex) => {
    const monthName = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ][monthIndex]
    const total =
      (groupedByMonthSales[monthName] || 0) +
      (groupedByMonthExpenses[monthName] || 0)

    return {
      month: monthName,
      sales: total ? (groupedByMonthSales[monthName] / total) * 100 : 0,
      expenses: total ? (groupedByMonthExpenses[monthName] / total) * 100 : 0,
    }
  })

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div className='row-span-3 xl:row-span-6 bg-gray-white shadow-md rounded-2xl bg-white'>
      <div>
        <h2 className='text-lg font-semibold mb-2 px-7 pt-5'>
          12 Months Profit vs Expenses
        </h2>
        <hr />
      </div>

      <ResponsiveContainer width='100%' height={450} className='px-7'>
        <BarChart
          data={chartData}
          margin={{ top: 0, right: 0, left: -25, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray='' vertical={false} />
          <XAxis dataKey='month' />
          <YAxis
            tickFormatter={(value) => `${value.toFixed(0)}%`}
            tick={{ fontSize: 12, dx: -1 }}
            tickLine={false}
            axisLine={false}
            domain={[0, 100]}
          />
          <Tooltip
            formatter={(value) => {
              const numericValue = Number(value)
              if (!isNaN(numericValue)) {
                return [`${numericValue.toFixed(1)}%`]
              }
              return [value]
            }}
            labelFormatter={(label) => label}
          />

          <Bar dataKey='expenses' stackId='a' fill='#E53E3E' barSize={15} />
          <Bar dataKey='sales' stackId='a' fill='#3182CE' barSize={15} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CardProfitAndLoss
