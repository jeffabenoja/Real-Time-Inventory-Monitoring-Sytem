import Table from "../components/common/Table"
import { createColumnHelper } from "@tanstack/react-table"
import Spinner from "../components/common/Spinner"
import { useQuery } from "@tanstack/react-query"
import PageTitle from "../components/common/PageTitle"

const columnHelper = createColumnHelper<any>()

const columns = [
  columnHelper.accessor("title", {
    cell: (info) => info.getValue(),
    header: () => <span className='flex items-center truncate'>Title</span>,
  }),

  columnHelper.accessor("brand", {
    cell: (info) => info.getValue(),
    header: () => <span className='flex items-center truncate'>Brand</span>,
  }),

  columnHelper.accessor("category", {
    cell: (info) => info.getValue(),
    header: () => <span className='flex items-center truncate'>Category</span>,
  }),

  columnHelper.accessor("stock", {
    cell: (info) => info.getValue(),
    header: () => <span className='flex items-center truncate'>Stock</span>,
  }),

  columnHelper.accessor("rating", {
    cell: (info) => (
      <span className='italic text-primary'>{info.getValue()}</span>
    ),
    header: () => <span className='flex items-center truncate'>Rating</span>,
  }),

  columnHelper.accessor("price", {
    cell: (info) => (
      <span className='italic text-primary'>{info.getValue()}</span>
    ),
    header: () => <span className='flex items-center truncate'>$ Price</span>,
  }),
]

const ProductsPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch("https://dummyjson.com/products?limit=15")
      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }
      return response.json()
    },
  })

  return (
    <div className='flex flex-col max-w-full mx-auto h-dynamic-sm lg:h-dynamic-lg'>
      <PageTitle>Products Page</PageTitle>

      {isLoading ? (
        <Spinner />
      ) : (
        <Table data={data?.products} columns={columns} search={true} withImport={true} withExport={true} add={true} view={true} />
      )}
    </div>
  )
}

export default ProductsPage
