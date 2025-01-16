import { createColumnHelper } from "@tanstack/react-table"
import { FaEdit, FaTrash } from "react-icons/fa"
import PageTitle from "../components/common/utils/PageTitle"
import Table from "../components/common/table/Table"
import Modal from "../components/common/Modal"
import SignUp from "../components/auth/Signup"
import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getUserList } from "../api/services/admin"
import Spinner from "../components/common/utils/Spinner"
import { replaceUserList } from "../store/slices/admin"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../store/index"

const columnHelper = createColumnHelper<any>()

const columns = [
  columnHelper.accessor("usercode", {
    cell: (info) => info.getValue(),
    header: () => <span className='flex items-center truncate'>User Code</span>,
  }),

  columnHelper.accessor("first_name", {
    cell: (info) => info.getValue(),
    header: () => (
      <span className='flex items-center truncate'>First Name</span>
    ),
  }),

  columnHelper.accessor("last_name", {
    cell: (info) => info.getValue(),
    header: () => <span className='flex items-center truncate'>Last Name</span>,
  }),

  columnHelper.accessor("userGroup.code", {
    cell: (info) => info.getValue(),
    header: () => <span className='flex items-center truncate'>User Type</span>,
  }),

  columnHelper.accessor("email", {
    cell: (info) => info.getValue(),
    header: () => <span className='flex items-center truncate'>Email</span>,
  }),

  columnHelper.accessor("password", {
    cell: (info) => info.getValue(),
    header: () => <span className='flex items-center truncate'>Password</span>,
  }),

  columnHelper.accessor("update/delete", {
    header: () => null,
    cell: () => (
      <span className='flex justify-end items-center gap-5'>
        <FaEdit size={20} className='cursor-pointer' />
        <FaTrash size={20} className='cursor-pointer' />
      </span>
    ),
  }),
]

// enum Role {
//   ADMIN = "ADMIN",
//   USER = "USER",
// }

// enum AccessType {
//   NO_ACCESS = "NO_ACCESS",
//   READ_ONLY = "READ_ONLY",
//   READ_WRITE = "READ_WRITE",
// }

// type Access = {
//   [key: string]: AccessType;
// };

// const accessKeys = ["Products", "Sales", "Stocklist", "Reports"];

export default function AdminPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  // const [isAdmin, setIsAdmin] = useState(false)
  // const handleIsAdmin = (value: boolean) => {
  //   setIsAdmin(() => value);
  // };
  const dispatch = useDispatch<AppDispatch>()
  const { data, isLoading } = useQuery({
    queryFn: getUserList,
    queryKey: ["admin", "getUsers"],
  })

  let tableData = useSelector((state: RootState) => state.admin.users)

  const closeModal = () => {
    setIsModalOpen(false)
  }

  useEffect(() => {
    dispatch(replaceUserList(data))
  }, [data, dispatch])

  return (
    <>
      <PageTitle>Admin Settings</PageTitle>

      {isLoading ? (
        <Spinner />
      ) : (
        <div className='flex flex-col max-w-full mx-auto h-dynamic-sm lg:h-dynamic-lg'>
          <Table
            data={tableData}
            columns={columns}
            search={true}
            withImport={false}
            withExport={false}
            add={true}
            view={false}
            handleAdd={() => setIsModalOpen(true)}
          />
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal} title='Modal Title'>
        <h2 className='text-center text-2xl'>Create User</h2>
        <SignUp close={closeModal} />
      </Modal>
    </>
  )
}
