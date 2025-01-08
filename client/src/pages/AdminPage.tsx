import { createColumnHelper } from "@tanstack/react-table";
import { FaEdit, FaTrash } from "react-icons/fa";
import PageTitle from "../components/common/PageTitle";
import Table from "../components/common/Table";
import users from "../data/users";
import Modal from "../components/common/Modal";
import { useForm } from "react-hook-form";
import { useState } from "react";

const columnHelper = createColumnHelper<any>();

const columns = [
  columnHelper.accessor("name", {
    cell: (info) => info.getValue(),
    header: () => <span className="flex items-center truncate">Name</span>,
  }),

  columnHelper.accessor("email", {
    cell: (info) => info.getValue(),
    header: () => <span className="flex items-center truncate">Email</span>,
  }),

  columnHelper.accessor("role", {
    cell: (info) => info.getValue(),
    header: () => <span className="flex items-center truncate">Role</span>,
  }),

  columnHelper.accessor("update/delete", {
    header: () => null,
    cell: () => (
      <span className="flex justify-end items-center gap-5">
        <FaEdit size={20} className="cursor-pointer" />
        <FaTrash size={20} className="cursor-pointer" />
      </span>
    ),
  }),
];

enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}

enum AccessType {
  NO_ACCESS = "NO_ACCESS",
  READ_ONLY = "READ_ONLY",
  READ_WRITE = "READ_WRITE",
}

type Access = {
  [key: string]: AccessType;
};

type FormFields = {
  name: string;
  email: string;
  role: Role;
  access: Access;
};

const accessKeys = ["Products", "Sales", "Stocklist", "Reports"];

export default function AdminPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false)
  const { handleSubmit, register, reset } = useForm<FormFields>();

  const onSubmit = (data: FormFields) => {
    let response = { ...data };

    if (data.role === Role.ADMIN) {
      response = {
        ...data,
        access: {
          Products: AccessType.READ_WRITE,
          Sales: AccessType.READ_WRITE,
          Stocklist: AccessType.READ_WRITE,
          Reports: AccessType.READ_WRITE,
        },
      };
    }

    console.log("Form Data:", response);

    reset()
    setIsAdmin(false)
  };

  const handleIsAdmin = (value: boolean) => {
    setIsAdmin(() => value);
  };

  const closeModal = () => {
    reset()
    setIsAdmin(false)
    setIsModalOpen(false)
  };

  return (
    <>
      <PageTitle>Admin Settings</PageTitle>
      <div className="flex flex-col max-w-full mx-auto h-dynamic-sm lg:h-dynamic-lg">
        <Table
          data={users}
          columns={columns}
          search={true}
          withImport={false}
          withExport={false}
          add={true}
          view={false}
          handleAdd={() => setIsModalOpen(true)}
        />
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Modal Title">
        <h2 className="text-center text-2xl">Create User</h2>
        <form
          className="flex flex-col pt-6 gap-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col">
            <label htmlFor="name">Name</label>
            <input
              {...register("name")}
              type="text"
              id="name"
              className="p-1 rounded border border-gray-300 focus:border-sky-300 focus:outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="email">Email</label>
            <input
              {...register("email")}
              type="email"
              id="email"
              className="p-1 rounded border border-gray-300 focus:border-sky-300 focus:outline-none"
            />
          </div>

          <fieldset className="flex gap-2">
            <div>Role</div>
            <div className="flex gap-1">
              <input
                {...register("role")}
                type="radio"
                id="user"
                value={Role.USER}
                name="role"
                onChange={() => handleIsAdmin(false)}
                checked={!isAdmin}
              />
              <label htmlFor="user">User</label>
            </div>
            <div className="flex gap-1">
              <input
                {...register("role")}
                type="radio"
                id="admin"
                value={Role.ADMIN}
                name="role"
                checked={isAdmin}
                onChange={() => handleIsAdmin(true)}
              />
              <label htmlFor="admin">Admin</label>
            </div>
          </fieldset>

          
          {!isAdmin && accessKeys.map((key) => (
            <div key={key} className="flex gap-2">
              <label htmlFor={`access.${key}`}>{key}</label>
              <select
                {...register(`access.${key}`, { required: true })}
                id={`access.${key}`}
                className="appearance-none px-2 text-gray-700 border border-gray-300 rounded-md focus-visible:outline-none transition ease-in-out"
              >
                <option value={AccessType.NO_ACCESS}>No Access</option>
                <option value={AccessType.READ_ONLY}>Read Only</option>
                <option value={AccessType.READ_WRITE}>Read and Write</option>
              </select>
            </div>
          ))}
          <div className="flex self-center gap-4 pt-3">
            <button
              type="submit"
              className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-200 active:bg-red-500 transition duration-150 ease-in-out"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 active:bg-blue-500 transition duration-150 ease-in-out"
            >
              Create
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
