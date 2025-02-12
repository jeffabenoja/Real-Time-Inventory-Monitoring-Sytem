import Table from "./table/Table"
import Spinner from "./utils/Spinner"
import { createColumnHelper } from "@tanstack/react-table"
import { FaExclamationTriangle } from "react-icons/fa"
import { useQuery } from "@tanstack/react-query"
import { getInventoryByCategory } from "../../api/services/inventory"
import { InventoryPerCategory } from "../../type/stockType"

const fields = [
  { key: "item.code", label: "Product Code", classes: "uppercase" },
  { key: "item.description", label: "Product Name", classes: "uppercase" },
  { key: "itemType", label: "Category", classes: "uppercase" },
  { key: "inQuantity", label: "Current Stock" },
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

    columnHelper.accessor(fieldsCategory.key, {
      cell: (info) => (
        <span className={`${fieldsCategory.classes}`}>{info.getValue()}</span>
      ),
      header: () => <span className='truncate'>{fieldsCategory.label}</span>,
    }),
  ]
}

interface InventoryTableProps {
  category: string
}

const InventoryTable = ({ category }: InventoryTableProps) => {
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
        <>
          {category === "Finished Goods" ? (
            <h1 className='font-bold text-xl pb-2 border-b border-[#14aff1]'>
              Inventory for Finished Products
            </h1>
          ) : (
            <h1 className='font-bold text-xl pb-2 border-b border-[#14aff1]'>
              Inventory for Raw Materials
            </h1>
          )}

          <Table
            data={inventoryData}
            columns={columns}
            search={true}
            withImport={false}
            withExport={false}
            withSubmit={false}
            withCancel={false}
            add={false}
            view={false}
          />
        </>
      )}
    </>
  )
}
export default InventoryTable
