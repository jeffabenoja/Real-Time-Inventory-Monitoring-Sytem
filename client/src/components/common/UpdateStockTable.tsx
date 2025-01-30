import Table from "./table/Table"
import { useState } from "react"
import Spinner from "./utils/Spinner"
import { useStockInList } from "../../hooks/stock/useStockInList"
import { createColumnHelper } from "@tanstack/react-table"
import { FaExclamationTriangle } from "react-icons/fa"
import { StockListType } from "../../type/StockType"
import CustomModal from "./utils/CustomModal"
import UpdateStockRawMats from "../modal/UpdateStockRawMats"
const fields = [
  { key: "transactionNo", label: "Transaction Number", classes: "uppercase" },
  { key: "batchNo", label: "Batch Number", classes: "uppercase" },
  { key: "item.code", label: "Item Code", classes: "uppercase" },
  { key: "item.description", label: "Product Name", classes: "uppercase" },
  { key: "quantity", label: "Quantity" },
  { key: "status", label: "Status", classes: "uppercase" },
]
type UpdateStockTableProps = {
  itemId: string
}

const Columns = ({
  fields,
}: {
  fields: { key: string; label: string; classes?: string }[]
}) => {
  const columnHelper = createColumnHelper<any>()

  return [
    ...fields.map((field) =>
      columnHelper.accessor(field.key, {
        cell: (info) => (
          <span className={`${field.classes}`}>{info.getValue()}</span>
        ),
        header: () => <span className='truncate'>{field.label}</span>,
      })
    ),
  ]
}

const UpdateStockTable = ({ itemId }: UpdateStockTableProps) => {
  const {
    data: stockData = [],
    isLoading,
    isError,
    updateStock,
    isPending,
  } = useStockInList(itemId)
  const [productData, setProductData] = useState<StockListType | null>(null)
  const [isOpenUpdate, setIsOpenUpdate] = useState<boolean>(false)

  const columns = Columns({
    fields,
  })

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

  if (stockData.length === 0) {
    return (
      <section className='text-center flex flex-col justify-center items-center h-96'>
        <FaExclamationTriangle className='text-red-900 text-6xl mb-4' />
        <h1 className='text-6xl font-bold mb-4'>No stock data available</h1>
      </section>
    )
  }

  const handleModalUpdate = () => {
    setIsOpenUpdate((prev) => !prev)
  }

  const handleUpdate = (row: StockListType) => {
    handleModalUpdate()

    setProductData(row)
  }

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <h1 className='font-bold text-xl mb-2'>
            Update {stockData[0]?.item?.code}
          </h1>
          <Table
            data={stockData}
            columns={columns}
            search={true}
            withImport={false}
            withExport={false}
            withSubmit={false}
            withCancel={false}
            add={false}
            view={false}
            handleUpdate={handleUpdate}
          />
        </>
      )}

      {isOpenUpdate && (
        <CustomModal toggleModal={handleModalUpdate}>
          <UpdateStockRawMats
            product={productData}
            toggleModal={handleModalUpdate}
            onSubmit={updateStock}
            isLoading={isPending}
          />
        </CustomModal>
      )}
    </>
  )
}
export default UpdateStockTable
