import React from "react"
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
} from "@tanstack/react-table"
import { TableProps } from "../../type/tableType"
import { IoIosAdd } from "react-icons/io"
import { VscSettings } from "react-icons/vsc"
import { CiSearch, CiExport, CiImport } from "react-icons/ci"

const Table: React.FC<TableProps> = ({ data, columns }) => {
  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <>
      {/* Search, Buttons, Filter */}
      <div className='flex items-center justify-between py-2'>
        <div className='flex items-center justify-center'>
          <div className=' relative'>
            <input
              type='text'
              className='text-sm md:text-base w-[100px] md:w-full px-3 py-1 outline-none placeholder:text-sm border border-gray-300 rounded-md  focus:bg-gray-50'
              placeholder='Search...'
            />
            <CiSearch
              className='absolute top-[4px] md:top-[6px] right-2 md:right-3'
              size={20}
            />
          </div>

          <div className='ml-2'>
            <button
              type='button'
              className='px-2 py-1 bg-white border border-gray-300 rounded-md flex items-center hover:bg-gray-50'
            >
              <CiImport className='md:mr-2' size={18} />
              <span className='hidden md:block'>Import</span>
            </button>
          </div>

          <div className='ml-2'>
            <button
              type='button'
              className='px-2 py-1 bg-white border border-gray-300 rounded-md flex items-center hover:bg-gray-50'
            >
              <CiExport className='md:mr-2' size={18} />
              <span className='hidden md:block'>Export</span>
            </button>
          </div>

          <div className='ml-2'>
            <button
              type='button'
              className='px-2 md:px-3 py-1 bg-white border border-gray-300 rounded-md flex items-center hover:bg-gray-50'
            >
              <IoIosAdd className='md:mr-1' size={18} />
              <span className='hidden md:block'>Add</span>
            </button>
          </div>
        </div>
        <div className='ml-2'>
          <button
            type='button'
            className='px-2 md:px-3 py-1 bg-white border border-gray-300 rounded-md flex items-center hover:bg-gray-50'
          >
            <VscSettings className='md:mr-1' size={16} />
            <span className='hidden md:block'>View</span>
          </button>
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
