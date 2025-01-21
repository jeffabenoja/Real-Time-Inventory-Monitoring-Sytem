import { createColumnHelper } from "@tanstack/react-table"
import { LuUserPen, LuUserX } from "react-icons/lu"

// Define a reusable function to generate columns
const AdminTableColumn = ({
  fields,
  onUpdate,
  onDelete,
}: {
  fields: { key: string; label: string; classes?: string }[]
  onUpdate: (item: any) => void
  onDelete: (item: any) => void
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
    // Add the actions column
    columnHelper.accessor("actions", {
      id: "actions",
      cell: (info) => (
        <div className='flex gap-2 items-center justify-center'>
          {/* Add Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onUpdate(info.row.original)
            }}
            className='px-4 py-2 bg-gray-200 hover:bg-gray-300  hover:text-blue-700 rounded-md shadow-md'
          >
            <LuUserPen size={20} />
          </button>

          {/* Update Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(info.row.original)
            }}
            className='px-4 py-2 bg-gray-200 hover:bg-gray-300 hover:text-primary rounded-md shadow-md'
          >
            <LuUserX size={20} />
          </button>
        </div>
      ),
      header: () => <span className='text-center truncate'>Actions</span>,
    }),
  ]
}

export default AdminTableColumn
