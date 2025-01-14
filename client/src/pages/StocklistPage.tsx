import Table from "../components/common/Table"
import { createColumnHelper } from "@tanstack/react-table"
import Spinner from "../components/common/Spinner"
import { useQuery } from "@tanstack/react-query"
import PageTitle from "../components/common/PageTitle"
import { getItemList } from "../api/services/admin"
import { Items } from "../type/itemType"

const columnHelper = createColumnHelper<any>()

const columns = [
  columnHelper.accessor("code", {
    cell: (info) => info.getValue(),
    header: () => <span className='flex items-center truncate'>Code</span>,
  }),

  columnHelper.accessor("description", {
    cell: (info) => info.getValue(),
    header: () => <span className='flex items-center truncate'>Description</span>,
  }),

  columnHelper.accessor("category", {
    cell: (info) => info.getValue(),
    header: () => <span className='flex items-center truncate'>Category</span>,
  }),

  columnHelper.accessor("brand", {
    cell: (info) => info.getValue(),
    header: () => <span className='flex items-center truncate'>Brand</span>,
  }),

  columnHelper.accessor("unit", {
    cell: (info) => (
      <span className='italic text-primary'>{info.getValue()}</span>
    ),
    header: () => <span className='flex items-center truncate'>Unit</span>,
  }),

  columnHelper.accessor("reoderPoint", {
    cell: (info) => (
      <span className='italic text-primary'>{info.getValue()}</span>
    ),
    header: () => <span className='flex items-center truncate'>Reorder Point</span>,
  }),

  columnHelper.accessor("price", {
    cell: (info) => (
      <span className='italic text-primary'>${info.getValue()}</span>
    ),
    header: () => <span className='flex items-center truncate'>Price</span>,
  }),

  columnHelper.accessor("cost", {
    cell: (info) => (
      <span className='italic text-primary'>${info.getValue()}</span>
    ),
    header: () => <span className='flex items-center truncate'>Price</span>,
  }),

  columnHelper.accessor("status", {
    cell: (info) => (
      <span className='italic text-primary'>{info.getValue()}</span>
    ),
    header: () => <span className='flex items-center truncate'>Status</span>,
  }),
]

const StocklistPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getItemList
  })

  const tableData = data.filter((data: Items) => data.category === "Raw Mats")

  return (
    <div className='flex flex-col max-w-full mx-auto h-dynamic-sm lg:h-dynamic-lg'>
      <PageTitle>Stocklist Page</PageTitle>

      {isLoading ? (
        <Spinner />
      ) : (
        <Table data={tableData} columns={columns} search={true} withImport={true} withExport={true} add={true} view={true} />
      )}
    </div>
  )
}

export default StocklistPage
