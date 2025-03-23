import { createColumnHelper } from "@tanstack/react-table";

// Define a reusable function to generate columns
const PredictionTableColumn = ({
  fields,
}: {
  fields: { key: string; label: string; classes?: string }[];
}) => {
  const columnHelper = createColumnHelper<any>();

  return [
    // Dynamically generate columns based on fields
    columnHelper.display({
      id: "select",
      header: ({ table }) => (
        <div className="px-1">
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="px-1">
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        </div>
      ),
    }),
    ...fields.map((field) =>
      columnHelper.accessor(field.key, {
        cell: (info) => {
          return (
            <span className={`${field.classes}`}>
              {info.getValue() === true
                ? "Yes"
                : info.getValue() === false
                ? "No"
                : info.getValue()}
            </span>
          );
        },
        header: () => <span className="truncate">{field.label}</span>,
      })
    ),
  ];
};

export default PredictionTableColumn;
