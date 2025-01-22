import AdminTableColumn from "../../components/common/AdminTableColumn";
import Table from "../../components/common/table/Table";
import SignUp from "../../components/admin/User";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserList } from "../../api/services/admin";
import Spinner from "../../components/common/utils/Spinner";
import { replaceUserList } from "../../store/slices/admin";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/index";
import CustomModal from "../../components/common/utils/CustomModal";
import Sidebar from "../../components/common/Sidebar";
import { LuUser } from "react-icons/lu";
import { LuUsers } from "react-icons/lu";
import { IoMdArrowRoundBack } from "react-icons/io";

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

export default function Users() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isUpdateUser, setIsUpdateUser] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleUpdateUserToggle = () => {
    setIsUpdateUser((prev) => !prev);
  };

  const handleUpdateUser = (user: any) => {
    handleUpdateUserToggle();
    console.log("Update User", user);
  };

  const handleDeleteUser = (user: any) => {
    console.log("Delete User", user);
  };

  const columns = AdminTableColumn({
    fields,
    onUpdate: handleUpdateUser,
    onDelete: handleDeleteUser,
  });

  const { data, isLoading } = useQuery({
    queryFn: getUserList,
    queryKey: ["admin", "getUsers"],
  });

  let tableData = useSelector((state: RootState) => state.admin.users);

  const handleModalToggle = () => {
    setIsModalOpen((prev) => !prev);
  };

  useEffect(() => {
    dispatch(replaceUserList(data));
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
            <h2 className="text-center text-2xl">Create User</h2>
            <SignUp close={handleModalToggle} />
          </CustomModal>
        )}

        {isUpdateUser && (
          <CustomModal toggleModal={handleUpdateUserToggle}>
            <h2 className="text-2xl">Update User</h2>
          </CustomModal>
        )}
      </div>
    </Sidebar>
  );
}
