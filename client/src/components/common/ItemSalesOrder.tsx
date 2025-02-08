import Table from "./table/Table"
import { createColumnHelper } from "@tanstack/react-table"
import { InventoryPerCategory } from "../../type/StockType"
import { getInventoryByCategory } from "../../api/services/inventory"
import { useQuery } from "@tanstack/react-query"
import Spinner from "./utils/Spinner"
import { FaExclamationTriangle } from "react-icons/fa"

const itemFields = [
  { key: "item.code", label: "Product Code", classes: "uppercase" },
  { key: "item.description", label: "Product Name", classes: "capitalize" },
  { key: "item.category", label: "Category", classes: "capitalize" },
  { key: "item.brand", label: "Brand", classes: "uppercase" },
  { key: "item.unit", label: "Unit", classes: "lowercase" },
  { key: "item.price", label: "Price" },
]

const Columns = ({
  itemFields,
}: {
  itemFields: { key: string; label: string; classes?: string }[]
}) => {
  const columnHelper = createColumnHelper<any>()

  return [
    columnHelper.accessor("select", {
      id: "select",
      header: () => <span className='truncate'>Select</span>,
      cell: ({ row }) => (
        <input
          type='checkbox'
          checked={row.getIsSelected()}
          onChange={() => row.toggleSelected()}
          className='w-4 h-4 cursor-pointer'
        />
      ),
    }),
    ...itemFields.map((field) =>
      columnHelper.accessor(field.key, {
        cell: (info) => (
          <span className={`${field.classes}`}>{info.getValue()}</span>
        ),
        header: () => <span className='truncate'>{field.label}</span>,
      })
    ),
  ]
}

interface ItemSalesOrderProps {
  onSubmit: (inventoryProductPerItem: InventoryPerCategory[]) => void
  toggleModal: () => void
}

const ItemSalesOrder: React.FC<ItemSalesOrderProps> = ({
  onSubmit,
  toggleModal,
}) => {
  const {
    data: inventoryData = [],
    isLoading,
    isError,
  } = useQuery<InventoryPerCategory[]>({
    queryKey: ["Stock", "Raw Mats", "Finished Goods"],
    queryFn: () => getInventoryByCategory("Finished Goods"),
  })

  const columns = Columns({
    itemFields,
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
      <h1 className='text-md mb-1'>Products</h1>
      <div className='border-t border-[#14aff1] pt-2'>
        {isLoading ? (
          <Spinner />
        ) : (
          <Table
            data={inventoryData}
            columns={columns}
            search={true}
            withImport={false}
            withExport={false}
            withSubmit={true}
            withCancel={true}
            add={false}
            view={false}
            handleSubmit={onSubmit}
            toggleModal={toggleModal}
          />
        )}
      </div>
    </>
  )
}

export default ItemSalesOrder
