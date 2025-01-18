import { ColumnDef } from "@tanstack/react-table"


export interface TableProps {
  columns: Array<ColumnDef<any>>
  data: Array<any>
  search: boolean
  withImport: boolean
  withExport: boolean
  add: boolean
  view: boolean
  openModal?: () => void
  handleExport?: () => void
  handleAdd?: () => void
  handleImport?: () => void
  handleUpdate?: (row: any) => void
}
