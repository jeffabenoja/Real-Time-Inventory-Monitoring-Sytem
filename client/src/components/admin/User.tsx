import Input from "../common/utils/Input";
import { useDispatch } from "react-redux";
import { User } from "../../type/userType";
import { appendUserList, updateUser } from "../../store/slices/admin";
import { AppDispatch } from "../../store";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import {
  createUser,
  updateUser as updateUserFn,
} from "../../api/services/admin";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "../../utils/Toast";
import Select from "../common/utils/Select";

interface UserList {
  id: any;
  code: any;
}

interface Props {
  close: () => void;
  defaultValue?: User;
  userList?: UserList[];
}

const schema = z.object({
  first_name: z.string().min(1, "Required Field"),
  last_name: z.string().min(1, "Required Field"),
  usercode: z.string().min(1, "Required Field"),
  userGroup: z.object({
    id: z.string().min(1, "Required Field"),
  }),
  email: z
    .string()
    .min(1, "Required Field")
    .email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, "Required Field"),
});

type FormFields = z.infer<typeof schema>;

export default function UserForm({ close, defaultValue, userList }: Props) {
  let defaultValueTransformed = {
    usercode: defaultValue?.usercode,
    password: defaultValue?.password,
    first_name: defaultValue?.first_name,
    last_name: defaultValue?.last_name,
    email: defaultValue?.email,
    userGroup: {
      id: defaultValue?.userGroup?.id?.toString(),
    },
  };
  
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, touchedFields },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: defaultValue ? defaultValueTransformed : undefined,
  });
  const dispatch = useDispatch<AppDispatch>();

  const success = (data: User) => {
    if (!defaultValue) {
      dispatch(appendUserList(data));
    } else {
      dispatch(updateUser(data));
    }
    showToast.success(
      !defaultValue ? "User Succesfully Added" : "User Succesfully Updated"
    );
    close();
  };

  const error = () => {
    showToast.error(
      !defaultValue ? "Adding User Failed" : "Updating User Failed"
    );
  };

  const { mutateAsync: addUser, isPending: adding } = useMutation({
    mutationFn: createUser,
    mutationKey: ["admin", "createUser"],
    onSuccess: success,
    onError: error,
  });

  const { mutateAsync: updateUserMutate, isPending: editing } = useMutation({
    mutationFn: updateUserFn,
    mutationKey: ["admin", "updateUser"],
    onSuccess: success,
    onError: error,
  });

  const onSubmit = async (data: FormFields) => {
    const user: User = {
      ...data,
      status: "ACTIVE",
    };
    console.log(user)
    if (!defaultValue) {
      await addUser(user);
    } else {
      await updateUserMutate({ id: defaultValue.id!, user });
    }
    reset();
  };

  const closeModal = () => {
    close();
    reset();
  };

  let groupList = userList?.map((item) => ({
    value: item.id,
    label: item.code,
  }));

  return (
    <form
      className="flex flex-col pt-6 gap-3"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex justify-between">
        <div className="w-[48%]">
          <Input
            register={register}
            label="First Name"
            id="first_name"
            error={errors["first_name"]?.message}
            touched={touchedFields["first_name"]}
          />
        </div>
        <div className="w-[48%]">
          <Input
            register={register}
            label="Last Name"
            id="last_name"
            error={errors["last_name"]?.message}
            touched={touchedFields["last_name"]}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <div className="w-[48%]">
          <Input
            register={register}
            label="User Code"
            id="usercode"
            error={errors.usercode?.message}
            touched={touchedFields.usercode}
          />
        </div>

        <div className="w-[48%]">
          <Select
            register={register}
            label="User Group"
            id="user-group"
            registrationKey="userGroup.id"
            options={groupList || []}
            error={errors.userGroup?.id?.message}
            touched={touchedFields.userGroup?.id}
          />
        </div>
      </div>

      <Input
        register={register}
        label="Email"
        id="email"
        error={errors.email?.message}
        touched={touchedFields.email}
      />

      <Input
        register={register}
        label="Password"
        id="password"
        error={errors.password?.message}
        touched={touchedFields.password}
      />
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
          disabled={adding}
        >
          {!defaultValue
            ? adding || editing
              ? "Creating..."
              : "Create"
            : adding || editing
            ? "Updating..."
            : "Update"}
        </button>
      </div>
    </form>
  );
}
