import { useQuery } from "@tanstack/react-query"
import { StockCardType } from "../../type/stockType"
import { getInventoryStockCard } from "../../api/services/inventory"
import { FaExclamationTriangle } from "react-icons/fa"
import Spinner from "./utils/Spinner"
import { IoIosClose } from "react-icons/io"
import Table from "./table/Table"
import { createColumnHelper } from "@tanstack/react-table"

const fields = [
  { key: "date", label: "Transaction Date" },
  { key: "transactionNo", label: "Transaction Number", classes: "uppercase" },
  { key: "stockIn", label: "Stock In" },
  { key: "stockOut", label: "Stock Out" },
  { key: "runningBalance", label: "Running Balance" },
]

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

type StockCardTableProps = {
  itemId: string
  close: () => void
}
const StockCardTable = ({ itemId, close }: StockCardTableProps) => {
  const {
    data: runningInventory = [],
    isLoading,
    isError,
  } = useQuery<StockCardType[]>({
    queryKey: ["StockCard"],
    queryFn: () => getInventoryStockCard(itemId),
  })

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

  // Create a shallow copy and reverse the array
  const reversedInventory = Array.isArray(runningInventory)
    ? [...runningInventory].reverse()
    : []

  const columns = Columns({
    fields,
  })

  return (
    <>
      <div className='flex flex-col h-full'>
        <div className='flex items-center justify-end'>
          <IoIosClose className='cursor-pointer' size={30} onClick={close} />
        </div>

        <div className='flex justify-center items-center pb-2 lg:text-2xl text-base border-b border-[#14aff1]'>
          <h1 className='font-bold text-center'>RUNNING INVENTORY TABLE</h1>
        </div>

        {isLoading ? (
          <Spinner />
        ) : (
          <Table
            data={reversedInventory}
            columns={columns}
            search={true}
            withImport={false}
            withExport={true}
            withSubmit={false}
            withCancel={false}
            add={false}
            view={false}
          />
        )}
      </div>
    </>
  )
}

export default StockCardTable
