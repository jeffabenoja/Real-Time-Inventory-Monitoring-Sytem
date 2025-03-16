import { ColumnDef } from "@tanstack/react-table"

export interface TableProps {
  columns: Array<ColumnDef<any>>
  data: Array<any>
  search: boolean
  withImport: boolean
  withExport: boolean
  withSubmit?: boolean
  withCancel?: boolean
  materials?: boolean
  add: boolean
  view: boolean
  approval?: boolean
  filter?: boolean
  toolTip?: string
  openModal?: () => void
  handleExport?: () => void
  handleAdd?: () => void
  handleApproval?: () => void
  handleView?: () => void
  handleFilter?: () => void
  handleImport?: () => void
  handleUpdate?: (row: any) => void
  handleSubmit?: (data: any) => void
  toggleModal?: () => void
  sorting?: { id: string; desc: boolean }[]
}
