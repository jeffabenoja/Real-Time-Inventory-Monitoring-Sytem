import AdminTableColumn from "../../components/common/AdminTableColumn"
import Table from "../../components/common/table/Table"
import { useEffect, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { deleteUserGroup, getUserGroupList } from "../../api/services/admin"
import Spinner from "../../components/common/utils/Spinner"
import usePageTitle from "../../hooks/usePageTitle"
import {
  replaceUserGroupList,
  deleteUserGroup as deleteUserGroupDispatch,
} from "../../store/slices/admin"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../store/index"
import CustomModal from "../../components/common/utils/CustomModalV2"
import UserGroup from "../../components/admin/UserGroup"
import { Delete } from "../../components/common/utils/Delete"
import { showToast } from "../../utils/Toast"
// import { extractErrorMessage } from "../../utils/extractErrorMessage"

const fields = [
  { key: "code", label: "Group Description", classes: "uppercase" },
  { key: "isAdmin", label: "Admin", classes: "capitalize" },
  { key: "isCreator", label: "Creator", classes: "capitalize" },
  { key: "isEditor", label: "Editor", classes: "capitalize" },
]

export default function UserGroups() {
  usePageTitle("Group Settings")

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isUpdateUser, setIsUpdateUser] = useState<boolean>(false)
  const [isDeleteUser, setIsDeleteUser] = useState<boolean>(false)
  const [defaultValues, setDefaultValues] = useState<any>(undefined)
  const dispatch = useDispatch<AppDispatch>()

  const success = (data: any) => {
    dispatch(deleteUserGroupDispatch(data))
    setIsDeleteUser(false)
    showToast.success("User Group deleted successfully")
  }

  const error = () => {
    showToast.error("Deletion Failed")
  }

  const { mutateAsync: deleteGroup, isPending } = useMutation({
    mutationFn: deleteUserGroup,
    mutationKey: ["admin", "deleteUserGroup"],
    onSuccess: success,
    onError: error,
  })

  const handleUpdateUserToggle = () => {
    setIsUpdateUser((prev) => !prev)
  }

  const handleDeleteToggle = () => {
    setIsDeleteUser((prev) => !prev)
  }

  const handleUpdateGroup = (user: any) => {
    handleUpdateUserToggle()
    setDefaultValues(user)
  }

  const handleDeletGroup = (user: any) => {
    handleDeleteToggle()
    setDefaultValues(user)
  }

  const onDelete = async () => {
    await deleteGroup(defaultValues)
  }

  const columns = AdminTableColumn({
    fields,
    onUpdate: handleUpdateGroup,
    onDelete: handleDeletGroup,
    entity: "Group",
  })

  const { data, isFetching } = useQuery({
    queryFn: getUserGroupList,
    queryKey: ["admin", "getUserGroups"],
    refetchOnWindowFocus: false,
  })

  let tableData = useSelector((state: RootState) => state.admin.userGroup)

  const handleModalToggle = () => {
    setIsModalOpen((prev) => !prev)
  }

  useEffect(() => {
    dispatch(replaceUserGroupList(data))
  }, [data, dispatch])

  return (
    <>
      {isFetching ? (
        <Spinner />
      ) : (
        <Table
          isAdmin={true}
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
        <CustomModal closeModal={handleModalToggle}>
          <h2 className='text-center text-2xl'>Create User Group</h2>
          <UserGroup close={() => setIsModalOpen(false)} />
        </CustomModal>
      )}

      {isUpdateUser && (
        <CustomModal closeModal={handleUpdateUserToggle}>
          <h2 className='text-center text-2xl'>Update User Group</h2>
          <UserGroup
            close={() => setIsUpdateUser(false)}
            defaultValue={defaultValues}
          />
        </CustomModal>
      )}

      {isDeleteUser && (
        <CustomModal closeModal={handleDeleteToggle}>
          <div className='text-center'>
            <Delete
              pending={isPending}
              clicked={onDelete}
              closeModal={() => setIsDeleteUser(false)}
            >
              {defaultValues!.code}
            </Delete>
          </div>
        </CustomModal>
      )}
    </>
  )
}
