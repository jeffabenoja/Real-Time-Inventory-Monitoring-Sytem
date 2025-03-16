import React, { useState } from "react"
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table"
import { TableProps } from "../../../type/tableType"
import { IoIosAdd } from "react-icons/io"
import { IoEyeOutline } from "react-icons/io5"
import { CiExport, CiImport } from "react-icons/ci"
import { FaChevronUp, FaChevronDown } from "react-icons/fa"
import { LuArrowUpDown } from "react-icons/lu"
import { CiFilter } from "react-icons/ci"
import Tooltip from "../Tooltip"
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
import { MdOutlineInventory } from "react-icons/md"

const Table: React.FC<TableProps> = ({
  data,
  columns,
  search,
  withImport,
  withExport,
  withSubmit,
  materials,
  add,
  approval,
  toolTip,
  filter,
  view,
  handleFilter,
  handleApproval,
  handleAdd,
  handleImport,
  handleUpdate,
  handleView,
  handleSubmit,
  toggleModal,
  sorting,
}) => {
  const [isOpenExport, setIsOpenExport] = useState<boolean>(false)
  const [globalFilter, setGlobalFilter] = useState<string>("")
  const [rowSelection, setRowSelection] = useState({})
  const [sortingArrow, setSortingArrow] = useState<SortingState>(
    sorting ? sorting : []
  )

  const table = useReactTable({
    data: data || [],
    columns,
    state: {
      globalFilter,
      rowSelection: rowSelection,
      sorting: sortingArrow,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSortingArrow,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
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

  const handleSubmitButton = () => {
    const selectedRows = table
      .getSelectedRowModel()
      .rows.map((row) => row.original)
    if (handleSubmit && toggleModal) {
      handleSubmit(selectedRows)
    }
  }

  return (
    <>
      {/* Search, Imports, Export, Add Buttons, Filter */}
      <div className='flex items-center justify-between py-2'>
        <div className='flex items-center justify-center'>
          {search && (
            <div className='relative'>
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
                <div className='absolute z-50 top-10 left-0 bg-white shadow-lg w-[130px] rounded-md'>
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

        <div className='inline-flex'>
          {view && (
            <div className='ml-2 text-cente'>
              <Tooltip text={toolTip || ""}>
                <Buttons
                  label={"View"}
                  Icon={IoEyeOutline}
                  onClick={handleView}
                />
              </Tooltip>
            </div>
          )}

          {filter && (
            <div className='ml-2'>
              <Buttons
                label={"Filter"}
                Icon={CiFilter}
                onClick={handleFilter}
              />
            </div>
          )}

          {approval && (
            <div className='ml-2 text-cente'>
              <Buttons
                label={"Approval"}
                Icon={MdOutlineInventory}
                onClick={handleApproval}
              />
            </div>
          )}
        </div>

        {materials && (
          <div className='ml-2'>
            <Buttons Icon={IoIosAdd} onClick={toggleModal} />
          </div>
        )}
      </div>

      <div className='overflow-x-auto bg-white shadow-md rounded-lg scrollbar'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50 sticky top-0 z-20'>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className='px-6 py-3 text-center text-xs font-medium text-black uppercase tracking-wider  bg-gray-50'
                  >
                    <div
                      {...{
                        className: header.column.getCanSort()
                          ? "flex items-center justify-center cursor-pointer select-none"
                          : "",
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanSort() &&
                        header.column.id !== "actions" &&
                        header.column.id !== "remove" &&
                        header.column.id !== "qty" &&
                        header.column.id !== "select" && (
                          <LuArrowUpDown className='ml-2 font-no' size={12} />
                        )}
                    </div>
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
                        table.setPageSize(current + 10)
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
              {table.getPageCount() === 0
                ? table.getState().pagination.pageIndex
                : table.getState().pagination.pageIndex + 1}
            </span>{" "}
            of <span className='font-medium'>{table.getPageCount()}</span>
          </div>

          {/* Buttons */}
          <div className='flex items-center space-x-2'>
            <button
              type='button'
              className='p-1 border rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50'
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.setPageIndex(0)}
            >
              <FiChevronsLeft size={12} />
            </button>

            <button
              type='button'
              className='p-1 border rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50'
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
            >
              <FiChevronLeft size={12} />
            </button>

            <button
              type='button'
              className='p-1 border rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50'
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
            >
              <FiChevronRight size={12} />
            </button>

            <button
              type='button'
              className='p-1 border rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50'
              disabled={!table.getCanNextPage()}
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            >
              <FiChevronsRight size={12} />
            </button>
          </div>
        </div>
      </div>
      {withSubmit && (
        <div className='flex items-center justify-end'>
          <div className='flex gap-2.5 lg:gap-5 items-center justify-between'>
            <button
              onClick={toggleModal}
              type='button'
              className='bg-red-700 rounded-md py-2.5 w-[120px] lg:w-[150px]'
            >
              <p className='text-white font-bold text-xs'>Cancel</p>
            </button>
            <button
              type='button'
              onClick={handleSubmitButton}
              className='bg-blue-700 rounded-md py-2.5 w-[120px] lg:w-[150px]'
            >
              <p className='text-white font-bold text-xs'>Select</p>
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default Table
