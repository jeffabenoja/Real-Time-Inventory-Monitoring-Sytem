import Table from "./table/Table"
import Spinner from "./utils/Spinner"
import { createColumnHelper } from "@tanstack/react-table"
import { FaExclamationTriangle } from "react-icons/fa"
import { useQuery } from "@tanstack/react-query"
import { getInventoryByCategory } from "../../api/services/inventory"
import { InventoryPerCategory } from "../../type/stockType"
import { IoIosClose } from "react-icons/io"

const fields = [
  { key: "item.code", label: "Product Code", classes: "uppercase" },
  { key: "item.description", label: "Product Name", classes: "uppercase" },
  { key: "itemType", label: "Category", classes: "uppercase" },
]

const Columns = ({
  fields,
  fieldsCategory,
}: {
  fields: { key: string; label: string; classes?: string }[]
  fieldsCategory: { key: string; label: string; classes?: string }
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

    columnHelper.accessor("currentStock", {
      cell: (info) => (
        <span className={`${fieldsCategory.classes}`}>
          {info.getValue().toFixed(2)}
        </span>
      ),
      header: () => <span className='truncate'>Current Stock</span>,
    }),

    columnHelper.accessor(fieldsCategory.key, {
      cell: (info) => (
        <span className={`${fieldsCategory.classes}`}>
          {info.getValue().toFixed(2)}
        </span>
      ),
      header: () => <span className='truncate'>{fieldsCategory.label}</span>,
    }),
  ]
}

interface InventoryTableProps {
  category: string
  close: () => void
}

const InventoryTable = ({ category, close }: InventoryTableProps) => {
  const {
    data: inventoryData = [],
    isLoading,
    isError,
  } = useQuery<InventoryPerCategory[]>({
    queryKey: ["Stock", "Raw Mats", "Finished Goods"],
    queryFn: () => getInventoryByCategory(category),

    enabled: !!category,
  })

  const fieldsCategory =
    category === "Finished Goods"
      ? { key: "outQuantity", label: "Sold Item" }
      : { key: "outQuantity", label: "Used Materials" }

  const adjustedInventoryData = inventoryData.map((item) => ({
    ...item,
    currentStock: item.inQuantity - item.outQuantity,
  }))

  const columns = Columns({
    fields,
    fieldsCategory,
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

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className='flex flex-col gap-2 h-full'>
          {category === "Finished Goods" ? (
            <div className='flex gap-2 justify-between items-center border-b border-[#14aff1]'>
              <h1 className='font-bold'>Inventory for Finished Products</h1>
              <IoIosClose
                className=' cursor-pointer'
                size={30}
                onClick={close}
              />
            </div>
          ) : (
            <div className='flex gap-2 justify-between items-center border-b border-[#14aff1]'>
              <h1 className='font-bold'>Inventory for Raw Materials</h1>
              <IoIosClose
                className=' cursor-pointer'
                size={30}
                onClick={close}
              />
            </div>
          )}

          <Table
            data={adjustedInventoryData}
            columns={columns}
            search={true}
            withImport={false}
            withExport={true}
            withSubmit={false}
            withCancel={false}
            add={false}
            view={false}
          />
        </div>
      )}
    </>
  )
}
export default InventoryTable
