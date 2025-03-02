import { useQuery } from "@tanstack/react-query"
import { getStockListByDateRange } from "../../api/services/stock"
import { StockListType } from "../../type/stockType"
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


// const getLast3Months = () => {
//   const months = []
//   const today = new Date()
//   for (let i = 0; i < 3; i++) {
//     const month = new Date(today)
//     month.setMonth(today.getMonth() - i)
//     months.push(month.getMonth())
//   }
//   return months.reverse()
// }

const getLast3Months = () => {
  const months = []
  const today = new Date("2021-12-31") 
  for (let i = 0; i < 3; i++) {
    const month = new Date(today)
    month.setMonth(today.getMonth() - i)
    months.push(month.getMonth())
  }
  return months.reverse()
}


const CardExpensesRawMaterials = () => {
  //   const currentDate = new Date()
  //   const currentYear = currentDate.getFullYear()
  //   const previousYear = currentYear - 1

  const { data: transactions = [], isLoading } = useQuery<StockListType[]>({
    queryKey: ["Stock", "Raw Mats", "Expenses"],
    queryFn: () =>
      getStockListByDateRange({
        from: `2021-01-01`,
        to: `2021-12-31`,
      }),
  })

  

  //   const filteredTransactions = transactions.filter((transaction) => {
  //     const transactionDate = new Date(transaction.transactionDate)
  //     return transactionDate >= last12MonthsDate && transactionDate <= currentDate
  //   })

  const groupedByMonth = transactions.reduce((acc: any, curr: any) => {
    const monthName = getMonthName(curr.transactionDate)
    const expense = curr.item?.cost * curr.quantity

    if (!acc[monthName]) {
      acc[monthName] = 0
    }

    acc[monthName] += expense

    return acc
  }, {})

  const last3Months = getLast3Months()

  const monthNames = [
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

  const filledGroupedByMonth = last3Months.reduce((acc: any, monthIndex) => {
    const monthName = monthNames[monthIndex]
    acc[monthName] = groupedByMonth[monthName] || 0
    return acc
  }, {})

  const chartData = Object.keys(filledGroupedByMonth).map((monthName) => ({
    month: monthName,
    totalValue: filledGroupedByMonth[monthName],
  }))

  console.log(chartData)

  return (
    <div className='row-span-3 xl:row-span-6 bg-gray-white shadow-md rounded-2xl bg-white'>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <div>
            <h2 className='text-lg font-semibold mb-2 px-7 pt-5'>
              3 Months Expenses Summary
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
                labelFormatter={(label) => label} // Use month name directly for the label
              />
              <Bar
                dataKey='totalValue'
                // fill='#3182ce'
                fill='#E53E3E'
                barSize={10}
                radius={[10, 10, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  )
}

export default CardExpensesRawMaterials
