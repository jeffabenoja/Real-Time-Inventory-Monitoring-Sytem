import usePageTitle from "../hooks/usePageTitle"
import PageTitle from "../components/common/utils/PageTitle"
import CardExpensesRawMaterials from "../components/overview/CardExpensesRawMaterials"
import CardSalesSummary from "../components/overview/CardSalesSummary"
import CardProfitAndLoss from "../components/overview/CardProfitAndLoss"

const OverviewPage = () => {
  usePageTitle("OverView")
  return (
    <div className='xl:overflow-auto scrollbar px-2'>
      <PageTitle>Overview Page</PageTitle>
      <div className='grid grid-cols-1 md:grid-cols-2  gap-10 custom-grid-rows'>
        <div className='flex flex-col justify-between row-span-2 xl:row-span-3 col-span-1 md:col-span-2 xl:col-span-1 shadow-md rounded-2xl bg-gray-500'></div>
        <div className='row-span-3 shadow-md rounded-2xl flex flex-col justify-between bg-gray-500'></div>
        {/* 2021 Data  */}
        <CardSalesSummary />
        <CardExpensesRawMaterials />

        {/* <div className='row-span-3  bg-gray-500 ' />
        <div className='md:row-span-1 xl:row-span-3 bg-gray-500' />
        <div className='md:row-span-1 xl:row-span-3 bg-gray-500' /> */}
      </div>
      <CardProfitAndLoss />
    </div>
  )
}

export default OverviewPage
