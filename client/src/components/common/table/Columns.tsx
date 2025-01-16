import { createColumnHelper } from "@tanstack/react-table"
import { CiEdit } from "react-icons/ci"
import { MdDeleteOutline } from "react-icons/md"

// Define a reusable function to generate columns
const Columns = ({
  fields,
  onUpdate,
  onDelete,
}: {
  fields: { key: string; label: string }[]
  onUpdate: (item: any) => void
  onDelete: (item: any) => void
}) => {
  const columnHelper = createColumnHelper<any>()

  return [
    // Dynamically generate columns based on fields
    ...fields.map((field) =>
      columnHelper.accessor(field.key, {
        cell: (info) => info.getValue(),
        header: () => (
          <span className='flex items-center truncate'>{field.label}</span>
        ),
      })
    ),
    // Add the actions column
    columnHelper.accessor("actions", {
      id: "actions",
      cell: (info) => (
        <div className='flex space-x-2'>
          {/* Update Button */}
          <button
            onClick={() => onUpdate(info.row.original)}
            className='px-4 py-2 bg-gray-200 hover:bg-gray-300 hover:text-blue-700 rounded-md shadow-md'
          >
            <CiEdit size={20} />
          </button>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(info.row.original)}
            className='px-4 py-2 bg-gray-200 hover:bg-gray-300 hover:text-primary rounded-md shadow-md'
          >
            <MdDeleteOutline size={20} />
          </button>
        </div>
      ),
      header: () => <span className='flex items-center truncate'>Actions</span>,
    }),
  ]
}

export default Columns
