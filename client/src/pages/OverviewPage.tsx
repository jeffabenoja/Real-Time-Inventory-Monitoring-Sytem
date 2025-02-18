// import Table from "../components/common/Table"
// import { createColumnHelper } from "@tanstack/react-table"
// import { CiUser } from "react-icons/ci"
// import { MdOutlineEmail } from "react-icons/md"
// import Spinner from "../components/common/Spinner"
// import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react";
import PageTitle from "../components/common/utils/PageTitle"

// const columnHelper = createColumnHelper<any>()

// const columns = [
//   columnHelper.accessor("id", {
//     cell: (info) => info.getValue(),
//     header: () => (
//       <span className='flex items-center truncate'>
//         <CiUser size={12} className='mr-1 hidden lg:block' />
//         Id
//       </span>
//     ),
//   }),

//   columnHelper.accessor("postId", {
//     cell: (info) => info.getValue(),
//     header: () => (
//       <span className='flex items-center truncate'>
//         <CiUser size={12} className='mr-1 hidden lg:block' />
//         Post ID
//       </span>
//     ),
//   }),

//   columnHelper.accessor("name", {
//     cell: (info) => info.getValue(),
//     header: () => (
//       <span className='flex items-center truncate'>
//         <CiUser size={12} className='mr-1 hidden lg:block' />
//         Name
//       </span>
//     ),
//   }),

//   columnHelper.accessor("email", {
//     cell: (info) => (
//       <span className='italic text-primary'>{info.getValue()}</span>
//     ),
//     header: () => (
//       <span className='flex items-center truncate'>
//         <MdOutlineEmail size={14} className='mr-1 hidden lg:block' />
//         Email
//       </span>
//     ),
//   }),
// ]

const OverviewPage = () => {
  // const { data, isLoading } = useQuery({
  //   queryKey: ["comments"],
  //   queryFn: async () => {
  //     const response = await fetch(
  //       "https://jsonplaceholder.typicode.com/comments"
  //     )
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch users")
  //     }
  //     return response.json()
  //   },
  // })
  useEffect(() => {
      document.title = "Overview | E&L Delicatessen";
    }, []);
  
  return (
    <>
      <PageTitle>Overview Page</PageTitle>

      {/* {isLoading ? (
        <Spinner />
      ) : (
        <Table
          data={data}
          columns={columns}
          search={true}
          withImport={true}
          withExport={true}
          add={true}
          view={true}
        />
      )} */}
    </>
  )
}

export default OverviewPage
