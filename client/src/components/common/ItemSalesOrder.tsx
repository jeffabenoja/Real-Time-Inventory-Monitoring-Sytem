import Table from "./table/Table"
import { createColumnHelper } from "@tanstack/react-table"
import { InventoryPerCategory } from "../../type/StockType"

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
  inventoryData: InventoryPerCategory[]
  onSubmit: (inventoryProductPerItem: InventoryPerCategory[]) => void
  toggleModal: () => void
}

const ItemSalesOrder: React.FC<ItemSalesOrderProps> = ({
  inventoryData,
  onSubmit,
  toggleModal,
}) => {
  const columns = Columns({
    itemFields,
  })
  return (
    <>
      <h1 className='text-md mb-1'>Products</h1>
      <div className='border-t border-[#14aff1] pt-2'>
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
      </div>
    </>
  )
}

export default ItemSalesOrder
