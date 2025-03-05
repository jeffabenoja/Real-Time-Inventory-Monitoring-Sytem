import usePageTitle from "../hooks/usePageTitle"
import PageTitle from "../components/common/utils/PageTitle"
import CardExpensesRawMaterials from "../components/overview/CardExpensesRawMaterials"
import CardSalesSummary from "../components/overview/CardSalesSummary"
import CardSalesAnalytics from "../components/overview/CardSalesAnalytics"
import CardSalesMetrics from "../components/overview/CardSalesMetrics"
import { useQuery } from "@tanstack/react-query"
import { getSalesOrderListByDateRange } from "../api/services/sales"
import { SalesOrderType } from "../type/salesType"
import Spinner from "../components/common/utils/Spinner"
import CardSalesVsCost from "../components/overview/CardSalesVsCost"

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

const getLast6Months = () => {
  const months = []
  const today = new Date()

  for (let i = 0; i < 6; i++) {
    const monthStart = new Date(today)
    monthStart.setMonth(today.getMonth() - i)
    monthStart.setDate(1)
    months.push(monthStart)
  }

  return months.reverse()
}

const OverviewPage = () => {
  usePageTitle("OverView")
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const previousYear = currentYear - 1

  const { data: transactions = [], isLoading } = useQuery<SalesOrderType[]>({
    queryKey: ["Sales"],
    queryFn: () =>
      getSalesOrderListByDateRange({
        from: `${previousYear}-01-01`,
        to: `${currentYear}-12-31`,
      }),
  })

  const last12MonthsDate = getLast12Months()
  const last6MonthsDate = getLast6Months()

  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.orderDate)

    return last12MonthsDate.some((monthStart) => {
      return (
        transactionDate >= monthStart &&
        transactionDate <
          new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0)
      )
    })
  })

  const filteredTransactions6Months = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.orderDate)

    return last6MonthsDate.some((monthStart) => {
      return (
        transactionDate >= monthStart &&
        transactionDate <
          new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0)
      )
    })
  })

  const groupedByMonthSales6Months = filteredTransactions6Months.reduce(
    (acc: any, curr: any) => {
      const monthName = getMonthName(curr.orderDate)
      const totalAmount = Array.isArray(curr.details)
        ? curr.details.reduce((sum: number, item: any) => sum + item.amount, 0)
        : 0

      if (!acc[monthName]) {
        acc[monthName] = 0
      }

      acc[monthName] += totalAmount
      return acc
    },
    {}
  )

  const salesData6Months = last6MonthsDate.map((monthStart) => {
    const monthName = getMonthName(monthStart.toISOString())

    return {
      month: monthName,
      sales: groupedByMonthSales6Months[monthName] || 0,
    }
  })

  const groupedByMonth6MonthsCost = filteredTransactions6Months.reduce(
    (acc: any, curr: any) => {
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
    },
    {}
  )

  const costData6Months = last6MonthsDate.map((monthStart) => {
    const monthName = getMonthName(monthStart.toISOString())

    return {
      month: monthName,
      cost: groupedByMonth6MonthsCost[monthName] || 0,
    }
  })

  const groupedByMonthSales = filteredTransactions.reduce(
    (acc: any, curr: any) => {
      const monthName = getMonthName(curr.orderDate)
      const totalAmount = Array.isArray(curr.details)
        ? curr.details.reduce((sum: number, item: any) => sum + item.amount, 0)
        : 0

      if (!acc[monthName]) {
        acc[monthName] = 0
      }

      acc[monthName] += totalAmount
      return acc
    },
    {}
  )

  const salesData = last12MonthsDate.map((monthStart) => {
    const monthName = getMonthName(monthStart.toISOString())

    return {
      month: monthName,
      sales: groupedByMonthSales[monthName] || 0,
    }
  })

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div className='flex flex-col gap-10'>
      <PageTitle>Overview Page</PageTitle>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10 custom-grid-rows'>
        <CardSalesMetrics />
        <CardSalesVsCost filteredTransactions={filteredTransactions} />
        <div className='row-span-2 shadow-md rounded-2xl flex flex-col justify-between bg-gray-500 items-center'>
          <h1 className='text-white font-bold'>ARIMA METRICS</h1>
        </div>
        <div className='row-span-2 shadow-md rounded-2xl flex flex-col justify-between bg-gray-500 items-center'>
          <h1 className='text-white font-bold'>ARIMA METRICS</h1>
        </div>

        <CardSalesSummary salesData={salesData6Months} />
        <CardExpensesRawMaterials salesData={costData6Months} />
      </div>
      <CardSalesAnalytics salesData={salesData} />
    </div>
  )
}

export default OverviewPage
