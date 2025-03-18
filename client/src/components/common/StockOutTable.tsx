import Table from "./table/Table"
import { useState } from "react"
import Spinner from "./utils/Spinner"
import { createColumnHelper } from "@tanstack/react-table"
import { FaExclamationTriangle } from "react-icons/fa"
import { StockListType } from "../../type/stockType"
import CustomModal from "./utils/CustomModal"
import { CiEdit } from "react-icons/ci"
import Tooltip from "./Tooltip"
import { IoIosClose } from "react-icons/io"
import UpdateStockOut from "../modal/UpdateStockOut"
import { useStockOut } from "../../hooks/stock/useStockOut"

const fields = [
  { key: "transactionNo", label: "Transaction Number", classes: "uppercase" },
  { key: "batchNo", label: "Batch Number", classes: "uppercase" },
  { key: "item.code", label: "Product Code", classes: "uppercase" },
  { key: "item.description", label: "Product Name", classes: "uppercase" },
  { key: "quantity", label: "Quantity" },
  { key: "status", label: "Status", classes: "uppercase" },
]

const Columns = ({
  fields,
  onUpdate,
}: {
  fields: { key: string; label: string; classes?: string }[]
  onUpdate: (item: StockListType) => void
}) => {
  const columnHelper = createColumnHelper<any>()

  return [
    // Add the actions column
    columnHelper.accessor("actions", {
      id: "actions",
      cell: (info) => (
        <div className='flex gap-2 items-center justify-center w-[150px] lg:w-full'>
          {/* Update Button */}
          <Tooltip text='Update'>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onUpdate(info.row.original)
              }}
              className='py-2 px-4 bg-gray-200 hover:bg-gray-300 hover:text-blue-700 rounded-md shadow-md'
            >
              <CiEdit size={20} />
            </button>
          </Tooltip>
        </div>
      ),
      header: () => <span className='text-center truncate'>Actions</span>,
    }),
    ...fields.map((field) =>
      columnHelper.accessor(field.key, {
        cell: (info) => {
          if (field.key === "item.code") {
            const code = info.row.original.item?.code ?? "No code available"
            return <span className={`${field.classes}`}>{code}</span>
          }
          return <span className={`${field.classes}`}>{info.getValue()}</span>
        },
        header: () => <span className='truncate'>{field.label}</span>,
      })
    ),
  ]
}

interface StockOutTableProps {
  productId: string
  close: () => void
}

const StockOutTable = ({ productId, close }: StockOutTableProps) => {
  const [productData, setProductData] = useState<StockListType | null>(null)
  const [isOpenUpdate, setIsOpenUpdate] = useState<boolean>(false)

  const {
    data: stockOut = [],
    isLoading,
    isError,
    updateStockOut,
    isPending,
  } = useStockOut({ id: productId })

  if (isError) {
    return (
      <section className='text-center flex flex-col justify-center items-center h-96'>
        <FaExclamationTriangle className='text-red-900 text-6xl mb-4' />
        <h1 className='text-6xl font-bold mb-4'>Error Fetching Data</h1>
        <p className='text-xl mb-5 text-primary'>
          Please contact your administrator
        </p>
      </section>
    )
  }

  if (stockOut.length === 0) {
    return (
      <section className='text-center flex flex-col justify-center items-center h-96'>
        <FaExclamationTriangle className='text-red-900 text-6xl mb-4' />
        <h1 className='text-2xl font-bold mb-4'>
          No Available Transaction History
        </h1>
        <button
          type='button'
          onClick={close}
          className='bg-red-700 rounded-md py-2.5 w-[150px] text-white font-bold text-xs text-center'
        >
          Go Back
        </button>
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
  const columns = Columns({
    fields,
    onUpdate: handleUpdate,
  })

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className='flex flex-col gap-2 h-full'>
          <div className='flex gap-2 justify-between items-center border-b border-[#14aff1]'>
            <h1 className='font-bold text-xl'>
              Stock Out Approval{" "}
              <span className='uppercase text-[#14aff1]'>
                {stockOut[0]?.item?.code}
              </span>
            </h1>
            <IoIosClose className=' cursor-pointer' size={30} onClick={close} />
          </div>

          <Table
            data={stockOut}
            columns={columns}
            sorting={[{ id: "transactionNo", desc: true }]}
            search={true}
            withImport={false}
            withExport={false}
            withSubmit={false}
            withCancel={false}
            add={false}
            view={false}
          />
        </div>
      )}
      {isOpenUpdate && (
        <CustomModal>
          <UpdateStockOut
            product={productData}
            toggleModal={handleModalUpdate}
            onSubmit={updateStockOut}
            isLoading={isPending}
          />
        </CustomModal>
      )}
    </>
  )
}
export default StockOutTable
