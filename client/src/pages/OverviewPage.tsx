import Table from "../components/common/Table"
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
} from "@tanstack/react-table"
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
      <span className='italic text-red-900'>{info.getValue()}</span>
    ),
    header: () => (
      <span className='flex items-center'>
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

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return <Table table={table} />
}

export default OverviewPage
