import { createColumnHelper } from "@tanstack/react-table"
import { CiEdit } from "react-icons/ci"
import { IoIosAdd } from "react-icons/io"
import { HiOutlineViewfinderCircle } from "react-icons/hi2"
import { ItemType } from "../../../type/itemType"


// Define a reusable function to generate columns
const StockListColumns = ({
  fields,
  onUpdate,
  onAdd,
  onView,
}: {
  fields: { key: string; label: string; classes?: string }[]
  onUpdate: (item: ItemType) => void
  onAdd: (item: ItemType) => void
  onView: (item: ItemType) => void
}) => {
  const columnHelper = createColumnHelper<any>()

  return [
    // Dynamically generate columns based on fields
    ...fields.map((field) =>
      columnHelper.accessor(field.key, {
        cell: (info) => (
          <span className={`${field.classes}`}>{info.getValue()}</span>
        ),
        header: () => <span className='truncate'>{field.label}</span>,
      })
    ),
    columnHelper.accessor("cost", {
      id: "productAmount",
      cell: (info) => {
        const price = info.getValue()
        const formattedPrice =
          price % 1 === 0 ? `${price}.00` : price.toFixed(2)

        return <span>{formattedPrice}</span>
      },
      header: () => <span className='truncate'>Cost</span>,
    }),
    // Add the actions column
    columnHelper.accessor("actions", {
      id: "actions",
      cell: (info) => (
        <div className='flex gap-2 items-center justify-center w-[150px] lg:w-full'>
          {/* View Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onView(info.row.original)
            }}
            className=' py-2 px-4 bg-gray-200 hover:bg-gray-300 hover:text-primary rounded-md shadow-md'
          >
            <HiOutlineViewfinderCircle size={20} />
          </button>

          {/* Add Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onAdd(info.row.original)
            }}
            className='py-2 px-4 bg-gray-200 hover:bg-gray-300 hover:text-primary rounded-md shadow-md'
          >
            <IoIosAdd size={20} />
          </button>

          {/* Update Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onUpdate(info.row.original)
            }}
            className='py-2 px-4 bg-gray-200 hover:bg-gray-300 hover:text-blue-700 rounded-md shadow-md'
          >
            <CiEdit size={20} />
          </button>
        </div>
      ),
      header: () => <span className='text-center truncate'>Actions</span>,
    }),
  ]
}

export default StockListColumns
