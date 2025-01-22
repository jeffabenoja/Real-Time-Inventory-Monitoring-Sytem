import Input from "../common/utils/Input";
import { useDispatch } from "react-redux";
import { UserGroup } from "../../type/userType";
import {
  appendUserGroupList,
  updateUserGroup as updateGroup,
} from "../../store/slices/admin";
import { AppDispatch } from "../../store";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { createUserGroup, updateUserGroup } from "../../api/services/admin";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "../../utils/Toast";
import Select from "../common/utils/Select";

interface Props {
  close: () => void;
  defaultValue?: {
    id: string;
    status: string;
    isAdmin: string;
    isCreator: string;
    isEditor: string;
    code: string;
  };
  update?: boolean;
}

const schema = z.object({
  code: z.string().min(1, "Required Field"),
  isAdmin: z.string().min(1, "Required Field"),
  isCreator: z.string().min(1, "Required Field"),
  isEditor: z.string().min(1, "Required Field"),
});

type FormFields = z.infer<typeof schema>;

export default function UserGroupForm({ close, defaultValue }: Props) {
  const defaultId = defaultValue?.id;
  const defaultStatus = defaultValue?.status;

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, touchedFields },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: defaultValue
      ? {
          ...defaultValue,
          isAdmin: defaultValue.isAdmin ? "true" : "false",
          isCreator: defaultValue.isCreator ? "true" : "false",
          isEditor: defaultValue.isEditor ? "true" : "false",
        }
      : undefined,
  });
  const dispatch = useDispatch<AppDispatch>();

  const success = (data: UserGroup) => {
    if (!defaultValue) {
      dispatch(appendUserGroupList(data));
    } else {
      dispatch(updateGroup(data));
    }
    showToast.success(
      !defaultValue
        ? "User Group Succesfully Added"
        : "User Group Succesfully Updated"
    );
    close();
  };

  const error = () => {
    showToast.error(
      !defaultValue ? "Adding User Group Failed" : "Updating User Group Failed"
    );
  };

  const { mutateAsync: addUserGroup, isPending: adding } = useMutation({
    mutationFn: createUserGroup,
    mutationKey: ["admin", "createUserGroup"],
    onSuccess: success,
    onError: error,
  });

  const { mutateAsync: editUserGroup, isPending: editing } = useMutation({
    mutationFn: updateUserGroup,
    mutationKey: ["admin", "updateUserGroup"],
    onSuccess: success,
    onError: error,
  });

  const onSubmit = async (data: FormFields) => {
    try {
      if (!defaultValue) {
        const transformedData = {
          ...data,
          isAdmin: data.isAdmin === "true",
          isCreator: data.isCreator === "true",
          isEditor: data.isEditor === "true",
        };
        await addUserGroup(transformedData);
      } else {
        const transformedData = {
          ...data,
          isAdmin: data.isAdmin === "true",
          isCreator: data.isCreator === "true",
          isEditor: data.isEditor === "true",
          id: defaultId,
          status: defaultStatus as "active" | "inactive" | "pending",
        };
        await editUserGroup(transformedData);
      }
    } catch (error) {
      throw new Error(
        !defaultValue ? "user group not added" : "user group not updated"
      );
    }
    reset();
  };

  const closeModal = () => {
    close();
    reset();
  };

  const options: any = [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ];

  return (
    <form
      className="flex flex-col pt-6 gap-3"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        register={register}
        label="Group Description"
        id="group_description"
        registrationKey="code"
        error={errors["code"]?.message}
        touched={touchedFields["code"]}
      />
      <div className="flex justify-between">
        <div className="w-[31.33%]">
          <Select
            register={register}
            label="Admin"
            id="admin"
            registrationKey="isAdmin"
            options={options}
            error={errors?.isAdmin?.message}
            isLoading={false}
          />
        </div>
        <div className="w-[31.33%]">
          <Select
            register={register}
            label="Creator"
            id="creator"
            registrationKey="isCreator"
            options={options}
            error={errors?.isCreator?.message}
            isLoading={false}
          />
        </div>
        <div className="w-[31.33%]">
          <Select
            register={register}
            label="Editor"
            id="editor"
            registrationKey="isEditor"
            options={options}
            error={errors?.isEditor?.message}
            isLoading={false}
          />
        </div>
      </div>

      <div className="flex self-center gap-4 pt-3">
        <button
          type="button"
          className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-200 active:bg-red-500 transition duration-150 ease-in-out"
          onClick={closeModal}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 active:bg-blue-500 transition duration-150 ease-in-out"
          disabled={adding || editing}
        >
          {!defaultValue
            ? adding || editing
              ? "Creating"
              : "Create"
            : adding || editing
            ? "Updating"
            : "Update"}
        </button>
      </div>
    </form>
  );
}
