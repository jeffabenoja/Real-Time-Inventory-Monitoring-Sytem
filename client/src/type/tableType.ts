import { ColumnDef } from "@tanstack/react-table"

export interface TableProps {
  columns: Array<ColumnDef<any>>
  data: Array<any>
  handleExport?: () => void
}
