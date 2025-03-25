import Table from "./table/Table"
import { useState } from "react"
import Spinner from "./utils/Spinner"
import { useAssembleList } from "../../hooks/stock/useAssembleList"
import { createColumnHelper } from "@tanstack/react-table"
import { FaExclamationTriangle } from "react-icons/fa"
import { AssembleTransaction } from "../../type/stockType"
import CustomModal from "./utils/CustomModal"
import Tooltip from "./Tooltip"
import { IoIosClose } from "react-icons/io"
import StockOutAssemble from "../modal/StockOutAssemble"

const fields = [
  { key: "assembleQuantity", label: "Quantity" },
  { key: "issuedQuantity", label: "Issued Quantity" },
  { key: "returnQuantity", label: "Return Quantity" },
  { key: "finishProduct.code", label: "Product Code", classes: "uppercase" },
  {
    key: "finishProduct.description",
    label: "Product Name",
    classes: "uppercase",
  },
  { key: "status", label: "Status", classes: "uppercase" },
]
type UpdateStockTableProps = {
  itemId: string
  close: () => void
}

const Columns = ({
  fields,
  onUpdate,
}: {
  fields: { key: string; label: string; classes?: string }[]
  onUpdate: (item: AssembleTransaction) => void
}) => {
  const columnHelper = createColumnHelper<any>()

  return [
    // Add the actions column
    columnHelper.accessor("actions", {
      id: "actions",
      cell: (info) => (
        <div className='flex gap-2 items-center justify-center w-[150px] lg:w-full'>
          {/* Update Button */}
          <Tooltip text='Remove Stock'>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onUpdate(info.row.original)
              }}
              className='py-2 px-4 bg-gray-200 hover:bg-gray-300 hover:text-blue-700 rounded-md shadow-md'
            >
              <IoIosClose size={20} />
            </button>
          </Tooltip>
        </div>
      ),
      header: () => <span className='text-center truncate'>Actions</span>,
    }),
    columnHelper.accessor("transactionNo", {
      cell: (info) => <span className={`uppercase`}>{info.getValue()}</span>,
      header: () => <span className='truncate'>Transaction Number</span>,
    }),
    columnHelper.accessor("batchNo", {
      cell: (info) => <span className={`uppercase`}>{info.getValue()}</span>,
      header: () => <span className='truncate'>Batch Number</span>,
    }),
    columnHelper.accessor("expiryDate", {
      cell: (info) => <span className={`uppercase`}>{info.getValue()}</span>,
      header: () => <span className='truncate'>Expiry Date</span>,
    }),
    columnHelper.accessor("stock", {
      id: "currentStock",
      cell: ({ row }) => {
        // Get the row data
        const { assembleQuantity, issuedQuantity, returnQuantity } =
          row.original

        // Calculate the current stock
        const currentStock = Math.round(
          assembleQuantity - issuedQuantity - returnQuantity
        )

        // Return the current stock as formatted text
        return <span>{currentStock}</span>
      },
      header: () => <span className='truncate'>Current Stock</span>,
    }),
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

const AssembleHistory = ({ itemId, close }: UpdateStockTableProps) => {
  const { data: stockData = [], isLoading, isError } = useAssembleList(itemId)
  const [productData, setProductData] = useState<AssembleTransaction | null>(
    null
  )
  const [isOpenUpdate, setIsOpenUpdate] = useState<boolean>(false)

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

  if (stockData.length === 0) {
    return (
      <section className='text-center flex flex-col justify-center items-center h-96'>
        <FaExclamationTriangle className='text-red-900 text-6xl mb-4' />
        <h1 className='text-6xl font-bold mb-4'>
          No Available Transaction History
        </h1>
      </section>
    )
  }

  const handleModalUpdate = () => {
    setIsOpenUpdate((prev) => !prev)
  }

  const handleUpdate = (row: AssembleTransaction) => {
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
              Remove Stock Table for{" "}
              <span className='uppercase text-[#14aff1]'>
                {stockData[0]?.finishProduct?.code}
              </span>
            </h1>
            <IoIosClose className=' cursor-pointer' size={30} onClick={close} />
          </div>
          <div className='flex-1 overflow-hidden overflow-y-auto scrollbar'>
            <Table
              data={stockData}
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
        </div>
      )}

      {isOpenUpdate && (
        <CustomModal>
          <StockOutAssemble
            stockInTransactionNo={productData?.transactionNo || ""}
            productCode={productData?.finishProduct?.code || ""}
            productName={productData?.finishProduct?.description || ""}
            toggleModal={handleModalUpdate}
          />
        </CustomModal>
      )}
    </>
  )
}
export default AssembleHistory
