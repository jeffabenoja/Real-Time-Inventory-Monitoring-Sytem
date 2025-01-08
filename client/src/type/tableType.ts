import { ColumnDef } from "@tanstack/react-table"

export interface TableProps {
  columns: Array<ColumnDef<any>>
  data: Array<any>
  search: boolean,
  withImport: boolean,
  withExport: boolean,
  add: boolean,
  view: boolean
  handleExport?: () => void
  handleAdd?: () => void
}
