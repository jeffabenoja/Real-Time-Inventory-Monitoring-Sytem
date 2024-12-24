import React, { useState } from "react"
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table"
import { TableProps } from "../../type/tableType"
import { IoIosAdd } from "react-icons/io"
import { VscSettings } from "react-icons/vsc"
import { CiExport, CiImport } from "react-icons/ci"
import Search from "./Search"
import Buttons from "./Buttons"
const Table: React.FC<TableProps> = ({ data, columns }) => {
  const [globalFilter, setGlobalFilter] = useState<string>("")
  const table = useReactTable({
    data: data || [],
    columns,
    state: {
      globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <>
      {/* Search, Buttons, Filter */}
      <div className='flex items-center justify-between py-2'>
        <div className='flex items-center justify-center'>
          <div className=' relative'>
            <Search
              columnFilter={globalFilter}
              setColumnFilter={setGlobalFilter}
            />
          </div>

          <div className='ml-2'>
            <Buttons label={"Import"} Icon={CiImport} />
          </div>

          <div className='ml-2'>
            <Buttons label={"Export"} Icon={CiExport} />
          </div>

          <div className='ml-2'>
            <Buttons label={"Add"} Icon={IoIosAdd} />
          </div>
        </div>

        <div className='ml-2'>
          <Buttons label={"View"} Icon={VscSettings} />
        </div>
      </div>

      {/* Table */}
      <div className='overflow-x-auto bg-white shadow-md rounded-lg scrollbar'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50 sticky top-0 z-10'>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className='px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider bg-gray-50'
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className='hover:bg-gray-50'>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Table
