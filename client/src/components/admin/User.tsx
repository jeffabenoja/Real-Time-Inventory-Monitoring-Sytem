import Input from "../common/utils/Input";
import { useDispatch } from "react-redux";
import { User } from "../../type/userType";
import { appendUserList } from "../../store/slices/admin";
import { AppDispatch } from "../../store";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createUser, getUserGroupList } from "../../api/services/admin";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "../../utils/Toast";
import Select from "../common/utils/Select";

interface Props {
  close: () => void;
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

export default function UserForm({ close }: Props) {
  const { data, isLoading } = useQuery({
    queryFn: getUserGroupList,
    queryKey: ["admin", "getUserGroups"],
  });

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, touchedFields },
  } = useForm<FormFields>({ resolver: zodResolver(schema), mode: "onBlur" });
  const dispatch = useDispatch<AppDispatch>();

  const success = (data: User) => {
    dispatch(appendUserList(data));
    showToast.success("User Succesfully Added");
    close()
  };

  const error = () => showToast.error("Adding User Failed");

  const { mutateAsync: addUser, isPending } = useMutation({
    mutationFn: createUser,
    mutationKey: ["admin", "createUser"],
    onSuccess: success,
    onError: error,
  });

  const onSubmit = async (data: FormFields) => {
    try {
      const user: User = {
        ...data,
        status: "ACTIVE", // Default value for status
        loggedInAt: new Date().toISOString(),
      };
      await addUser(user);
    } catch (error) {
      throw new Error("user not added");
    }
    reset();
  };

  const closeModal = () => {
    close();
    reset();
  };

  const groupList = data.map((item: { id: any; code: any; }) => ({value: item.id, label: item.code})) 

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

        {/* <Input
        register={register}
        label='User Group'
        id='user-group'
        registrationKey='userGroup.id'
        attributes={{ type: "number" }}
        error={errors.userGroup?.id?.message}
        touched={touchedFields.userGroup?.id}
      /> */}
        <div className="w-[48%]">
          <Select
            register={register}
            label="User Group"
            id="user-group"
            registrationKey="userGroup.id"
            options={groupList || []}
            error={errors.userGroup?.id?.message}
            touched={touchedFields.userGroup?.id}
            isLoading={isLoading}
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
        attributes={{ type: "password" }}
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
          disabled={isPending}
        >
          {isPending ? "Adding" : "Create"}
        </button>
      </div>
    </form>
  );
}
