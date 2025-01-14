import Table from "../components/common/Table"
import { createColumnHelper } from "@tanstack/react-table"
import Spinner from "../components/common/Spinner"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import CustomModal from "../components/common/CustomModal"
import AddItems from "../components/modal/AddItems"

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
  const [isOpen, setIsOpen] = useState(false)
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

  const handleModalToggle = () => {
    setIsOpen((prev) => !prev)
  }

  return (
    <div className='flex flex-col max-w-full mx-auto px-4 lg:px-8 py-4 h-dynamic-sm lg:h-dynamic-lg'>
      <h1 className='text-2xl font-bold mb-5'>Product Page</h1>

      {isLoading ? (
        <Spinner />
      ) : (
        <Table
          data={data?.products}
          columns={columns}
          openModal={handleModalToggle}
        />
      )}

      {isOpen && (
        <CustomModal toggleModal={handleModalToggle}>
          <AddItems toggleModal={handleModalToggle}/>
        </CustomModal>
      )}
    </div>
  )
}

export default ProductsPage
