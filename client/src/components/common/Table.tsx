import { Table as ReactTable, flexRender } from "@tanstack/react-table"

type TableProps<TData> = {
  table: ReactTable<TData>
}

const Table = <TData,>({ table }: TableProps<TData>) => {
  return (
    <div className='flex flex-col max-w-full mx-auto px-4 lg:px-8 py-4 h-dynamic-sm lg:h-dynamic-lg'>
      <h1 className='text-2xl font-bold mb-5'>Overview Page</h1>
      <div className='overflow-x-auto bg-white shadow-md rounded-lg scrollbar '>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50 sticky top-0 z-10'>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className='px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider bg-gray-50'
                  >
                    <div>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </div>
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
    </div>
  )
}

export default Table
