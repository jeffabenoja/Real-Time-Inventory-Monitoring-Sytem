import { createColumnHelper } from "@tanstack/react-table";
import { LuUserPen, LuUserX } from "react-icons/lu";
import Tooltip from "./Tooltip";

// Define a reusable function to generate columns
const AdminTableColumn = ({
  fields,
  onUpdate,
  onDelete,
  currentUserCode,
  entity,
}: {
  fields: { key: string; label: string; classes?: string }[];
  onUpdate: (item: any) => void;
  onDelete: (item: any) => void;
  currentUserCode?: string;
  entity?: string;
}) => {
  const columnHelper = createColumnHelper<any>();

  return [
    // Dynamically generate columns based on fields
    ...fields.map((field) =>
      columnHelper.accessor(field.key, {
        cell: (info) => (
          <span className={`${field.classes}`}>
            {info.getValue() === true
              ? "Yes"
              : info.getValue() === false
              ? "No"
              : info.getValue()}
          </span>
        ),
        header: () => <span className="truncate">{field.label}</span>,
      })
    ),
    // Add the actions column
    columnHelper.accessor("actions", {
      id: "actions",
      cell: (info) => {
        let isCurrentUser = false;
        if (currentUserCode) {
          isCurrentUser = info.row.original.usercode === currentUserCode;
        }
        return (
          <div className="flex gap-2 items-center justify-center">
            {/* Add Button */}
            <Tooltip
              text={
                isCurrentUser
                  ? "Forbidden to edit own info."
                  : `Edit ${entity || ""}`
              }
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdate(info.row.original);
                }}
                className={`px-4 py-2 bg-gray-200 ${!isCurrentUser ? `hover:bg-gray-300  hover:text-blue-700` : ""} rounded-md shadow-md disabled:cursor-not-allowed`}
                disabled={isCurrentUser}
              >
                <LuUserPen size={20} />
              </button>
            </Tooltip>

            {/* Update Button */}

            <Tooltip
              text={
                isCurrentUser
                  ? "Forbidden to delete own info."
                  : `Delete ${entity || ""}`
              }
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(info.row.original);
                }}
                className={`px-4 py-2 bg-gray-200 ${!isCurrentUser ? `hover:bg-gray-300  hover:text-blue-700` : ""} rounded-md shadow-md disabled:cursor-not-allowed`}
                disabled={isCurrentUser}
              >
                <LuUserX size={20} />
              </button>
            </Tooltip>
          </div>
        );
      },
      header: () => <span className="text-center truncate">Actions</span>,
    }),
  ];
};

export default AdminTableColumn;
