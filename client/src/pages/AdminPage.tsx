import AdminTableColumn from "../components/common/AdminTableColumn"
import PageTitle from "../components/common/utils/PageTitle"
import Table from "../components/common/table/Table"
// import Modal from "../components/common/Modal"
import SignUp from "../components/auth/Signup"
import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getUserList } from "../api/services/admin"
import Spinner from "../components/common/utils/Spinner"
import { replaceUserList } from "../store/slices/admin"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../store/index"
import CustomModal from "../components/common/utils/CustomModal"

const fields = [
  { key: "usercode", label: "User Code", classes: "uppercase" },
  { key: "first_name", label: "First Name", classes: "capitalize" },
  { key: "last_name", label: "Last Name", classes: "capitalize" },
  { key: "userGroup.code", label: "User Type", classes: "uppercase" },
  { key: "email", label: "Email", classes: "lowercase" },
  { key: "password", label: "Password" },
  {
    key: "status",
    label: "Status",
    classes: "lowercase",
  },
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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isUpdateUser, setIsUpdateUser] = useState<boolean>(false)
  // const [isAdmin, setIsAdmin] = useState(false)
  // const handleIsAdmin = (value: boolean) => {
  //   setIsAdmin(() => value);
  // };
  const dispatch = useDispatch<AppDispatch>()

  const handleUpdateUserToggle = () => {
    setIsUpdateUser((prev) => !prev)
  }

  const handleUpdateUser = (user: any) => {
    handleUpdateUserToggle()
    console.log("Update User", user)
  }

  const handleDeleteUser = (user: any) => {
    console.log("Delete User", user)
  }

  const columns = AdminTableColumn({
    fields,
    onUpdate: handleUpdateUser,
    onDelete: handleDeleteUser,
  })

  const { data, isLoading } = useQuery({
    queryFn: getUserList,
    queryKey: ["admin", "getUsers"],
  })

  let tableData = useSelector((state: RootState) => state.admin.users)

  // const closeModal = () => {
  //   setIsModalOpen(false)
  // }

  const handleModalToggle = () => {
    setIsModalOpen((prev) => !prev)
  }

  useEffect(() => {
    dispatch(replaceUserList(data))
  }, [data, dispatch])

  return (
    <div className='flex flex-col max-w-full mx-auto h-full px-4 lg:px-8 py-4'>
      <PageTitle>Admin Settings</PageTitle>

      {isLoading ? (
        <Spinner />
      ) : (
        <Table
          data={tableData}
          columns={columns}
          search={true}
          withImport={false}
          withExport={false}
          add={true}
          view={false}
          handleAdd={handleModalToggle}
        />
      )}

      {/* <Modal isOpen={isModalOpen} onClose={closeModal} title='Modal Title'>
        <h2 className='text-center text-2xl'>Create User</h2>
        <SignUp close={closeModal} />
      </Modal> */}

      {isModalOpen && (
        <CustomModal toggleModal={handleModalToggle}>
          <h2 className='text-center text-2xl'>Create User</h2>
          <SignUp close={handleModalToggle} />
        </CustomModal>
      )}

      {isUpdateUser && (
        <CustomModal toggleModal={handleUpdateUserToggle}>
          <h2 className='text-2xl'>Update User</h2>
        </CustomModal>
      )}
    </div>
  )
}
