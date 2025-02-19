import AdminTableColumn from "../../components/common/AdminTableColumn"
import Table from "../../components/common/table/Table"
import SignUp from "../../components/admin/User"
import { useEffect, useState } from "react"
import usePageTitle from "../../hooks/usePageTitle"
import { useMutation, useQuery } from "@tanstack/react-query"
import {
  deleteUser,
  getUserGroupList,
  getUserList,
} from "../../api/services/admin"
import Spinner from "../../components/common/utils/Spinner"
import {
  replaceUserList,
  deleteUser as deleteUserDispatch,
} from "../../store/slices/admin"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../store/index"
import CustomModal from "../../components/common/utils/CustomModalV2"
import { showToast } from "../../utils/Toast"
import { Delete } from "../../components/common/utils/Delete"
import User from "../../components/admin/User"
import { User as TypeUser } from "../../type/userType"

const fields = [
  { key: "usercode", label: "User Code", classes: "uppercase" },
  { key: "first_name", label: "First Name", classes: "capitalize" },
  { key: "last_name", label: "Last Name", classes: "capitalize" },
  { key: "userGroup.code", label: "User Type", classes: "uppercase" },
  { key: "email", label: "Email", classes: "lowercase" },
]

export default function Users() {
  usePageTitle("User Settings")

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isUpdateUser, setIsUpdateUser] = useState<boolean>(false)
  const [isDeleteUser, setIsDeleteUser] = useState<boolean>(false)
  const [defaultValues, setDefaultValues] = useState<any>(undefined)

  const { data: userListData } = useQuery({
    queryFn: getUserGroupList,
    queryKey: ["admin", "getUserGroups"],
  })

  const dispatch = useDispatch<AppDispatch>()

  const success = (data: any) => {
    dispatch(deleteUserDispatch(data))
    setIsDeleteUser(false)
    showToast.success("User deleted successfully")
  }

  const error = () => {
    showToast.error("Deletion Failed")
  }

  const { mutateAsync: deleteUserFn, isPending } = useMutation({
    mutationFn: deleteUser,
    mutationKey: ["admin", "deleteUser"],
    onSuccess: success,
    onError: error,
  })

  const handleUpdateUserToggle = () => {
    setIsUpdateUser((prev) => !prev)
  }

  const handleUpdateUser = (user: TypeUser) => {
    handleUpdateUserToggle()
    setDefaultValues(user)
  }

  const handleDeleteToggle = () => {
    setIsDeleteUser((prev) => !prev)
  }

  const handleDeleteUser = (user: TypeUser) => {
    handleDeleteToggle()
    setDefaultValues(user)
  }

  const onDelete = async () => {
    await deleteUserFn(defaultValues)
  }

  let currentUserCode = useSelector((state: RootState) => {
    return state.auth.user?.usercode!
  })

  const columns = AdminTableColumn({
    fields,
    onUpdate: handleUpdateUser,
    onDelete: handleDeleteUser,
    currentUserCode,
    entity: "User",
  })

  const { data, isFetching } = useQuery({
    queryFn: getUserList,
    queryKey: ["admin", "getUsers"],
    refetchOnWindowFocus: false
  })

  let tableData = useSelector((state: RootState) => {
    return state.admin.users
  })

  const handleModalToggle = () => {
    setIsModalOpen((prev) => !prev)
  }

  useEffect(() => {
    dispatch(replaceUserList(data))
  }, [data, dispatch])

  return (
    <>
      {isFetching ? (
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

      {isModalOpen && (
        <CustomModal toggleModal={handleModalToggle}>
          <h2 className='text-center text-2xl'>Create User</h2>
          <SignUp close={handleModalToggle} userList={userListData} />
        </CustomModal>
      )}

      {isUpdateUser && (
        <CustomModal toggleModal={handleUpdateUserToggle}>
          <h2 className='text-center text-2xl'>Update User</h2>
          <User
            close={() => setIsUpdateUser(false)}
            defaultValue={defaultValues}
            userList={userListData}
          />
        </CustomModal>
      )}
      {isDeleteUser && (
        <CustomModal toggleModal={handleDeleteToggle}>
          <div className='text-center'>
            <Delete
              pending={isPending}
              clicked={onDelete}
              closeModal={() => setIsDeleteUser(false)}
            >
              {defaultValues!.usercode}
            </Delete>
          </div>
        </CustomModal>
      )}
    </>
  )
}
