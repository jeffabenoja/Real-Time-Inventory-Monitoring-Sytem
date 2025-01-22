import React, { useState } from "react"
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table"
import { TableProps } from "../../../type/tableType"
import { IoIosAdd } from "react-icons/io"
import { VscSettings } from "react-icons/vsc"
import { CiExport, CiImport } from "react-icons/ci"
import { FaChevronUp, FaChevronDown } from "react-icons/fa"
import {
  FiChevronsLeft,
  FiChevronsRight,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi"
import Search from "./Search"
import Buttons from "../buttons/Buttons"
import Papa from "papaparse"
import { flattenObject } from "../../../utils/flattenObject"

const Table: React.FC<TableProps> = ({
  data,
  columns,
  search,
  withImport,
  withExport,
  add,
  view,
  handleAdd,
  handleImport,
  handleUpdate,
}) => {
  const [isOpenExport, setIsOpenExport] = useState<boolean>(false)
  const [globalFilter, setGlobalFilter] = useState<string>("")
  const table = useReactTable({
    data: data || [],
    columns,
    state: {
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const handleExport = (exportCurrentPage: boolean) => {
    // Optional if we wanted to set the specific headers
    // const modifiedData = data.map(() => ({
    //   "Post ID": item.postId,
    //   "Full Name": item.name,
    //   "Email Address": item.email,
    // }))

    // Data to export: all data or just current page
    const dataToExport = exportCurrentPage
      ? table.getRowModel().rows.map((row) => row.original) // Current page data
      : data // All data

    // Flatten data before exporting
    const flattenData = dataToExport.map((item) => flattenObject(item))

    const csv = Papa.unparse(flattenData, {
      header: true,
    })

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = exportCurrentPage
      ? "current_page_export.csv"
      : "all_pages_export.csv"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setIsOpenExport((prev) => !prev)
  }

  const openExport = () => {
    setIsOpenExport((prev) => !prev)
  }

  return (
    <>
      {/* Search, Imports, Export, Add Buttons, Filter */}
      <div className='flex items-center justify-between py-2'>
        <div className='flex items-center justify-center'>
          {search && (
            <div className=' relative'>
              <Search
                columnFilter={globalFilter}
                setColumnFilter={setGlobalFilter}
              />
            </div>
          )}

          {withImport && (
            <div className='ml-2'>
              <Buttons
                label={"Import"}
                Icon={CiImport}
                onClick={handleImport}
              />
            </div>
          )}

          {withExport && (
            <div className='ml-2 relative'>
              <Buttons label={"Export"} Icon={CiExport} onClick={openExport} />
              {isOpenExport && (
                <div className='absolute z-20 top-10 left-0 bg-white shadow-lg w-[120px] rounded-md'>
                  <p
                    className='text-xs cursor-pointer  p-2 hover:bg-gray-100'
                    onClick={() => handleExport(false)}
                  >
                    Export all pages
                  </p>
                  <p
                    className='text-xs cursor-pointer  p-2 hover:bg-gray-100'
                    onClick={() => handleExport(true)}
                  >
                    Export current pages
                  </p>
                </div>
              )}
            </div>
          )}

          {add && (
            <div className='ml-2'>
              <Buttons label={"Add"} Icon={IoIosAdd} onClick={handleAdd} />
            </div>
          )}
        </div>

        {view && (
          <div className='ml-2'>
            <Buttons label={"View"} Icon={VscSettings} />
          </div>
        )}
      </div>

      <div className='overflow-x-auto bg-white shadow-md rounded-lg scrollbar'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50 sticky top-0'>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className='px-6 py-3 text-center text-xs font-medium text-black uppercase tracking-wider  bg-gray-50'
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
              <tr
                key={row.id}
                className='hover:bg-gray-50'
                onClick={(e) => e.stopPropagation()}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer text-center'
                    onClick={(e) => {
                      e.stopPropagation()
                      if (handleUpdate) {
                        handleUpdate(row.original)
                      }
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='flex items-center md:justify-between justify-end py-2'>
        <div className='hidden md:flex items-center justify-center '>
          <span className='text-xs text-gray-700'>
            Showing{" "}
            <span className='font-medium'>
              {table.getRowModel().rows.length}
            </span>{" "}
            of <span className='font-medium'>{data?.length}</span> results
          </span>
        </div>

        <div className='flex items-center gap-3'>
          <div className='flex items-center'>
            <div className='flex items-center justify-between py-2 border-primary rounded-md'>
              <label
                htmlFor='pageSize'
                className=' hidden md:block text-xs text-gray-700 mr-2'
              >
                Rows per page:
              </label>
              <label
                htmlFor='pageSize'
                className='md:hidden text-xs text-gray-700 mr-2'
              >
                Per page:
              </label>
              <div className='flex items-center justify-between gap-2.5 border border-gray-300 rounded-md p-1 px-3'>
                <span className='text-xs text-gray-700'>
                  {table.getState().pagination.pageSize}
                </span>
                <div className='flex flex-col ml-1'>
                  <button
                    type='button'
                    className='hover:bg-gray-200 px-1'
                    onClick={() => {
                      let current = table.getState().pagination.pageSize
                      if (current < 100) {
                        table.setPageSize(current + 10) // Increment by 10
                      }
                    }}
                  >
                    <FaChevronUp size={8} />
                  </button>
                  <button
                    type='button'
                    className='hover:bg-gray-200 px-1'
                    onClick={() => {
                      let current = table.getState().pagination.pageSize
                      if (current > 10) {
                        table.setPageSize(current - 10) // Decrement by 10
                      }
                    }}
                  >
                    <FaChevronDown size={8} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className='text-xs text-gray-700'>
            Page{" "}
            <span className='font-medium'>
              {table.getState().pagination.pageIndex + 1}
            </span>{" "}
            of <span className='font-medium'>{table.getPageCount()}</span>
          </div>

          {/* Buttons */}
          <div className='flex items-center space-x-2'>
            <button
              className='p-1 border rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50'
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.setPageIndex(0)}
            >
              <FiChevronsLeft size={12} />
            </button>

            <button
              className='p-1 border rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50'
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
            >
              <FiChevronLeft size={12} />
            </button>

            <button
              className='p-1 border rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50'
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
            >
              <FiChevronRight size={12} />
            </button>

            <button
              className='p-1 border rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50'
              disabled={!table.getCanNextPage()}
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            >
              <FiChevronsRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Table
