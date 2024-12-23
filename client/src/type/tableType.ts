import {Table as ReactTable} from "@tanstack/react-table"

export type TableProps<TData> = {
  table: ReactTable<TData>
}