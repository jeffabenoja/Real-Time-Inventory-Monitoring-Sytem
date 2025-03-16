import usePageTitle from "../hooks/usePageTitle";
import PageTitle from "../components/common/utils/PageTitle";
import CardExpensesRawMaterials from "../components/overview/CardExpensesRawMaterials";
import CardSalesSummary from "../components/overview/CardSalesSummary";
import CardSalesAnalytics from "../components/overview/CardSalesAnalytics";
import CardSalesMetrics from "../components/overview/CardSalesMetrics";
import { useQuery } from "@tanstack/react-query";
import { getSalesOrderListByDateRange } from "../api/services/sales";
import { SalesOrderType } from "../type/salesType";
import Spinner from "../components/common/utils/Spinner";
import CardSalesVsCost from "../components/overview/CardSalesVsCost";
import { getPredictions } from "../api/services/prediction";
import { fetchMultipleItemWithComponents } from "../api/services/item";
import SalesForecastChart from "../components/overview/SalesForecast";
import RawMatsForecast from "../components/overview/RawMatsForecast";
import ProductsForecastChart from "../components/overview/ProductForecast";

const getMonthName = (dateString: string) => {
  const date = new Date(dateString);
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
  ];
  return months[date.getMonth()];
};

const getLast12Months = () => {
  const months = [];
  const today = new Date();

  for (let i = 0; i < 12; i++) {
    const monthStart = new Date(today);
    monthStart.setMonth(today.getMonth() - i);
    monthStart.setDate(1);
    months.push(monthStart);
  }

  return months.reverse();
};

const getLast6Months = () => {
  const months = [];
  const today = new Date();

  for (let i = 0; i < 6; i++) {
    const monthStart = new Date(today);
    monthStart.setMonth(today.getMonth() - i);
    monthStart.setDate(1);
    months.push(monthStart);
  }

  return months.reverse();
};

const getLastYearMonths = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const previousYear = currentYear - 1;
  const months = [];

  for (let i = 0; i < 12; i++) {
    const monthStart = new Date(previousYear, i, 1);
    months.push(monthStart);
  }

  return months;
};

const OverviewPage = () => {
  usePageTitle("OverView");
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const previousYear = currentYear - 1;

  const { data: predictions, isFetching: fetchingPredections } = useQuery({
    queryKey: ["Prediction"],
    queryFn: () => getPredictions(),
    refetchOnWindowFocus: false,
  });

  const { data: itemWithComponents, isFetching: fetchingItemWithComponents } =
    useQuery({
      queryKey: ["Item", "Components", predictions],
      queryFn: () => {
        const itemIds = Object.keys(predictions || {});
        return fetchMultipleItemWithComponents(itemIds);
      },
      refetchOnWindowFocus: false,
      enabled: !!predictions,
    });

  const {
    data: transactionSalesForThisYear = [],
    isFetching: fetchingTracsactionSalesForThisYear,
  } = useQuery<SalesOrderType[]>({
    queryKey: ["Sales", "VS", "PREDICTION"],
    queryFn: () =>
      getSalesOrderListByDateRange({
        from: `${currentYear}-01-01`,
        to: `${currentYear}-12-31`,
      }),
    refetchOnWindowFocus: false,
  });

  const { data: transactions = [], isLoading } = useQuery<SalesOrderType[]>({
    queryKey: ["Sales"],
    queryFn: () =>
      getSalesOrderListByDateRange({
        from: `${previousYear}-01-01`,
        to: `${currentYear}-12-31`,
      }),
  });

  const last12MonthsDate = getLast12Months();
  const last6MonthsDate = getLast6Months();
  const lastYearMonths = getLastYearMonths();

  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.orderDate);
    return last12MonthsDate.some((monthStart) => {
      return (
        transactionDate >= monthStart &&
        transactionDate <
          new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0)
      );
    });
  });

  const filteredTransactions6Months = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.orderDate);
    return last6MonthsDate.some((monthStart) => {
      return (
        transactionDate >= monthStart &&
        transactionDate <
          new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0)
      );
    });
  });

  const groupedByMonthSales6Months = filteredTransactions6Months.reduce(
    (acc: any, curr: any) => {
      const monthName = getMonthName(curr.orderDate);
      const totalAmount = Array.isArray(curr.details)
        ? curr.details.reduce((sum: number, item: any) => sum + item.amount, 0)
        : 0;

      if (!acc[monthName]) {
        acc[monthName] = 0;
      }
      acc[monthName] += totalAmount;
      return acc;
    },
    {}
  );

  const salesData6Months = last6MonthsDate.map((monthStart) => {
    const monthName = getMonthName(monthStart.toISOString());
    return {
      month: monthName,
      sales: groupedByMonthSales6Months[monthName] || 0,
    };
  });

  const groupedByMonth6MonthsCost = filteredTransactions6Months.reduce(
    (acc: any, curr: any) => {
      const monthName = getMonthName(curr.orderDate);
      const totalAmount = Array.isArray(curr.details)
        ? curr.details.reduce(
            (sum: number, item: any) =>
              sum + item.item.averageCost * item.orderQuantity,
            0
          )
        : 0;
      if (!acc[monthName]) {
        acc[monthName] = 0;
      }
      acc[monthName] += totalAmount;
      return acc;
    },
    {}
  );

  const costData6Months = last6MonthsDate.map((monthStart) => {
    const monthName = getMonthName(monthStart.toISOString());
    return {
      month: monthName,
      cost: groupedByMonth6MonthsCost[monthName] || 0,
    };
  });

  const groupedByMonthSales = filteredTransactions.reduce(
    (acc: any, curr: any) => {
      const monthName = getMonthName(curr.orderDate);
      const totalAmount = Array.isArray(curr.details)
        ? curr.details.reduce((sum: number, item: any) => sum + item.amount, 0)
        : 0;
      if (!acc[monthName]) {
        acc[monthName] = 0;
      }
      acc[monthName] += totalAmount;
      return acc;
    },
    {}
  );

  const salesData = lastYearMonths.map((monthStart) => {
    const monthName = getMonthName(monthStart.toISOString());
    return {
      month: monthName,
      sales: groupedByMonthSales[monthName] || 0,
    };
  });

  if (isLoading) {
    return <Spinner />;
  }

  const salesForecastChartLoading =
    !fetchingPredections &&
    !fetchingItemWithComponents &&
    !fetchingTracsactionSalesForThisYear;

  return (
    <div className="flex flex-col gap-10">
      <PageTitle>Overview Page</PageTitle>

      {/* Responsive Grid */}
      <div className="flex flex-wrap -mx-2 space-y-8">
        <div className="w-full">
        <CardSalesMetrics sales={transactions} />
        </div>
        <div className="w-full lg:w-1/2 lg:px-2 xl:px-5">
          <CardSalesVsCost filteredTransactions={filteredTransactions} />
        </div>
        <div className="w-full lg:w-1/2 lg:px-2 xl:px-5">
          <SalesForecastChart
            notLoading={salesForecastChartLoading}
            forecastData={predictions!}
            itemComponents={itemWithComponents!}
            sales={transactionSalesForThisYear}
          />
        </div>
        <div className="w-full lg:w-1/2 lg:px-2 xl:px-5">
          <RawMatsForecast
            notLoading={salesForecastChartLoading}
            predictedData={predictions!}
            itemComponents={itemWithComponents!}
            sales={transactionSalesForThisYear}
          />
        </div>
        <div className="w-full lg:w-1/2 lg:px-2 xl:px-5">
          <ProductsForecastChart
            notLoading={salesForecastChartLoading}
            predictedData={predictions!}
            itemComponents={itemWithComponents!}
            sales={transactionSalesForThisYear}
          />
        </div>
        <div className="w-full lg:w-1/2 lg:px-2 xl:px-5">
          <CardSalesSummary salesData={salesData6Months} />
        </div>
        <div className="w-full lg:w-1/2 lg:px-2 xl:px-5">
          <CardExpensesRawMaterials salesData={costData6Months} />
        </div>
        <div className="w-full">

      <CardSalesAnalytics salesData={salesData} />
        </div>
      </div>

      {/* Full-width component outside the grid */}
    </div>
  );
};

export default OverviewPage;
