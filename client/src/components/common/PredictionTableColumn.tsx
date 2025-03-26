import { createColumnHelper } from "@tanstack/react-table";

// Define a reusable function to generate columns
const PredictionTableColumn = ({
  fields,
  isEditor,
}: {
  fields: { key: string; label: string; classes?: string }[];
  isEditor?: boolean;
}) => {
  const columnHelper = createColumnHelper<any>();

  // Conditionally add the select column only if isEditor is true
  const selectColumn = isEditor
    ? [
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
                className="disabled:cursor-not-allowed"
              />
            </div>
          ),
        }),
      ]
    : [];

  const dataColumns = fields.map((field) =>
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
  );

  return [...selectColumn, ...dataColumns];
};

export default PredictionTableColumn;
