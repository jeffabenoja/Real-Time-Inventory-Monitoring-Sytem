import { createColumnHelper } from "@tanstack/react-table";
import { CiEdit } from "react-icons/ci";
import { TiClipboard } from "react-icons/ti";
import { IoEyeOutline } from "react-icons/io5";
import { ItemType } from "../../../type/itemType";
import { MdOutlineInventory } from "react-icons/md";
import Tooltip from "../Tooltip";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

const StockListColumns = ({
  fields,
  onUpdate,
  onAdd,
  onView,
  onApproval,
}: {
  fields: { key: string; label: string; classes?: string }[];
  onUpdate: (item: ItemType) => void;
  onAdd: (item: ItemType) => void;
  onView: (item: ItemType) => void;
  onApproval: (item: ItemType) => void;
}) => {
  const columnHelper = createColumnHelper<any>();
  const isEditor = useSelector(
    (state: RootState) => state.auth.user?.userGroup.isEditor
  );
  const groupCode = useSelector(
    (state: RootState) => state.auth.user?.userGroup.code
  );
  return [
    // Dynamically generate columns based on fields
    ...fields.map((field) =>
      columnHelper.accessor(field.key, {
        cell: (info) => (
          <span className={`${field.classes}`}>{info.getValue()}</span>
        ),
        header: () => <span className="truncate">{field.label}</span>,
      })
    ),

    columnHelper.accessor("currentStock", {
      id: "productStock",
      cell: (info) => {
        const stock = info.getValue();

        const formattedCurrentStock = stock.toFixed(2);

        return <span>{formattedCurrentStock}</span>;
      },
      header: () => <span className="truncate">Current Stock</span>,
    }),

    columnHelper.accessor("price", {
      id: "productPrice",
      cell: (info) => {
        const price = info.getValue();
        const formattedPrice =
          price % 1 === 0 ? `${price}.00` : price.toFixed(2);

        return <span>{formattedPrice}</span>;
      },
      header: () => <span className="truncate">Price</span>,
    }),

    columnHelper.accessor("cost", {
      id: "productAmount",
      cell: (info) => {
        const price = info.getValue();
        const formattedPrice =
          price % 1 === 0 ? `${price}.00` : price.toFixed(2);

        return <span>{formattedPrice}</span>;
      },
      header: () => <span className="truncate">Cost</span>,
    }),

    // Add the actions column
    columnHelper.accessor("actions", {
      id: "actions",
      cell: (info) => (
        <div className="flex gap-2 items-center justify-center w-[150px] lg:w-full">
          {/* View Button */}
          <Tooltip text="View">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView(info.row.original);
              }}
              className="lg:py-2 lg:px-4 p-2 bg-gray-200 hover:bg-gray-300 hover:text-primary rounded-md shadow-md"
            >
              <IoEyeOutline size={20} />
            </button>
          </Tooltip>

          {/* Add Button */}
          {isEditor && groupCode !== "APPROVER" && (
            <Tooltip text="Stock">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAdd(info.row.original);
                }}
                className="lg:py-2 lg:px-4 p-2 bg-gray-200 hover:bg-gray-300 hover:text-primary rounded-md shadow-md"
              >
                <TiClipboard size={20} />
              </button>
            </Tooltip>
          )}

          {/* Update Button */}
          {isEditor && groupCode !== "APPROVER" && <Tooltip text="Update">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpdate(info.row.original);
              }}
              className="lg:py-2 lg:px-4 p-2 bg-gray-200 hover:bg-gray-300 hover:text-blue-700 rounded-md shadow-md"
            >
              <CiEdit size={20} />
            </button>
          </Tooltip>}

          {isEditor && (groupCode === "APPROVER" || groupCode === "ADMIN" || groupCode === "MANAGER") && 
          <Tooltip text="Approval">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onApproval(info.row.original);
              }}
              className="lg:py-2 lg:px-4 p-2 bg-gray-200 hover:bg-gray-300 hover:text-blue-700 rounded-md shadow-md"
            >
              <MdOutlineInventory size={20} />
            </button>
          </Tooltip>}
        </div>
      ),
      header: () => <span className="text-center truncate">Actions</span>,
    }),
  ];
};

export default StockListColumns;
