import { useParams } from "react-router-dom"
import { SalesOrderType } from "../../type/salesType"
import { useQuery } from "@tanstack/react-query"
import SalesOrderPdfComponent from "./SalesOrderPdfComponent"
import { getSalesOrderPerNumber } from "../../api/services/sales"
import Spinner from "../common/utils/Spinner"
import { FaExclamationTriangle } from "react-icons/fa"

const SalesOrderPdf = () => {
  const { id } = useParams<{ id: string }>()

  const {
    data: salesOrderDetails,
    isLoading,
    isError,
  } = useQuery<SalesOrderType>({
    queryKey: ["saleOrder", id],
    queryFn: () => getSalesOrderPerNumber(id!),
    enabled: !!id,
  })

  if (isLoading) {
    return <Spinner />
  }

  if (isError) {
    return (
      <section className='text-center flex flex-col justify-center items-center h-96'>
        <FaExclamationTriangle className='text-red-900 text-6xl mb-4' />
        <h1 className='text-6xl font-bold mb-4'>Something went wrong</h1>
        <p className='text-xl mb-5 text-primary'>
          Please contact your administrator
        </p>
      </section>
    )
  }

  return <SalesOrderPdfComponent row={salesOrderDetails as SalesOrderType} />
}

export default SalesOrderPdf
