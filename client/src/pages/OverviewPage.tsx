import Table from "../components/common/Table"
import { createColumnHelper } from "@tanstack/react-table"
import { CiUser } from "react-icons/ci"
import { MdOutlineEmail } from "react-icons/md"

import { useQuery } from "@tanstack/react-query"

const columnHelper = createColumnHelper<any>()

const columns = [
  columnHelper.accessor("id", {
    cell: (info) => info.getValue(),
    header: () => (
      <span className='flex items-center truncate'>
        <CiUser size={12} className='mr-1 hidden lg:block' />
        Id
      </span>
    ),
  }),

  columnHelper.accessor("postId", {
    cell: (info) => info.getValue(),
    header: () => (
      <span className='flex items-center truncate'>
        <CiUser size={12} className='mr-1 hidden lg:block' />
        Post ID
      </span>
    ),
  }),

  columnHelper.accessor("name", {
    cell: (info) => info.getValue(),
    header: () => (
      <span className='flex items-center truncate'>
        <CiUser size={12} className='mr-1 hidden lg:block' />
        Name
      </span>
    ),
  }),

  columnHelper.accessor("email", {
    cell: (info) => (
      <span className='italic text-primary'>{info.getValue()}</span>
    ),
    header: () => (
      <span className='flex items-center truncate'>
        <MdOutlineEmail size={14} className='mr-1 hidden lg:block' />
        Email
      </span>
    ),
  }),
]

const OverviewPage = () => {
  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/comments?_start=0&_limit=20"
      )
      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }
      return response.json()
    },
  })

  return (
    <div className='flex flex-col max-w-full mx-auto px-4 lg:px-8 py-4 h-dynamic-sm lg:h-dynamic-lg'>
      <h1 className='text-2xl font-bold mb-5'>Overview Page</h1>

      <Table data={data} columns={columns} />
    </div>
  )
}

export default OverviewPage
