import AdminTableColumn from "../../components/common/AdminTableColumn";
import Table from "../../components/common/table/Table";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteUserGroup, getUserGroupList } from "../../api/services/admin";
import Spinner from "../../components/common/utils/Spinner";
import {
  replaceUserGroupList,
  updateUserGroup,
} from "../../store/slices/admin";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/index";
import CustomModal from "../../components/common/utils/CustomModal";
import Sidebar from "../../components/common/Sidebar";
import { LuUser } from "react-icons/lu";
import { LuUsers } from "react-icons/lu";
import { IoMdArrowRoundBack } from "react-icons/io";
import UserGroup from "../../components/admin/UserGroup";
import { Delete } from "../../components/common/utils/Delete";
import { showToast } from "../../utils/Toast";

const fields = [
  { key: "code", label: "Group Description", classes: "uppercase" },
  { key: "isAdmin", label: "Admin", classes: "capitalize" },
  { key: "isCreator", label: "Creator", classes: "capitalize" },
  { key: "isEditor", label: "Editor", classes: "capitalize" },
  {
    key: "status",
    label: "Status",
    classes: "lowercase",
  },
];

const sidebarItems = [
  { label: "Users", icon: LuUser, path: "/admin/users" },
  { label: "User Groups", icon: LuUsers, path: "/admin/user-groups" },
];
const sidebarButton = {
  label: "Dashboard",
  icon: IoMdArrowRoundBack,
  path: "/dashboard",
};

export default function UserGroups() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isUpdateUser, setIsUpdateUser] = useState<boolean>(false);
  const [isDeleteUser, setIsDeleteUser] = useState<boolean>(false);
  const [defaultValues, setDefaultValues] = useState<any>(undefined);
  const dispatch = useDispatch<AppDispatch>();

  const success = (data: any) => {
    dispatch(updateUserGroup(data));
    setIsDeleteUser(false);
    showToast.success("User Group deleted successfully");
  };

  const error = () => {
    showToast.error("Deletion Failed");
  };

  const { mutateAsync: deleteGroup, isPending } = useMutation({
    mutationFn: deleteUserGroup,
    mutationKey: ["admin", "deleteUserGroup"],
    onSuccess: success,
    onError: error,
  });

  const handleUpdateUserToggle = () => {
    setIsUpdateUser((prev) => !prev);
  };

  const handleDeleteToggle = () => {
    setIsDeleteUser((prev) => !prev);
  };

  const handleUpdateGroup = (user: any) => {
    handleUpdateUserToggle();
    setDefaultValues(user);
  };

  const handleDeletGroup = (user: any) => {
    handleDeleteToggle();
    setDefaultValues(user);
  };

  const onDelete = async () => {
    await deleteGroup(defaultValues);
  };

  const columns = AdminTableColumn({
    fields,
    onUpdate: handleUpdateGroup,
    onDelete: handleDeletGroup,
  });

  const { data, isLoading } = useQuery({
    queryFn: getUserGroupList,
    queryKey: ["admin", "getUserGroups"],
  });

  let tableData = useSelector((state: RootState) => state.admin.userGroup);

  const handleModalToggle = () => {
    setIsModalOpen((prev) => !prev);
  };

  useEffect(() => {
    dispatch(replaceUserGroupList(data));
  }, [data, dispatch]);

  return (
    <Sidebar navItems={sidebarItems} button={sidebarButton}>
      <div className="flex flex-col max-w-full py-4 px-4 lg:py-0 lg:px-0 overflow-hidden">
        <h1 className="text-3xl text-center font-bold mb-2">Admin Settings</h1>
        <h2 className="text-2xl lg:hidden">Users</h2>

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

        {isModalOpen && (
          <CustomModal toggleModal={handleModalToggle}>
            <h2 className="text-center text-2xl">Create User Group</h2>
            <UserGroup close={() => setIsModalOpen(false)} />
          </CustomModal>
        )}

        {isUpdateUser && (
          <CustomModal toggleModal={handleUpdateUserToggle}>
            <h2 className="text-center text-2xl">Update User Group</h2>
            <UserGroup
              close={() => setIsUpdateUser(false)}
              defaultValue={defaultValues}
            />
          </CustomModal>
        )}

        {isDeleteUser && (
          <CustomModal toggleModal={handleDeleteToggle}>
            <div className="text-center">
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
      </div>
    </Sidebar>
  );
}
