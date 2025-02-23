import { ReactNode, useEffect, useState } from "react";
import PageTitle from "../../components/common/utils/PageTitle";
import { useMutation, useQuery } from "@tanstack/react-query";
import usePageTitle from "../../hooks/usePageTitle";
import { getUserGroupList, updateUser } from "../../api/services/admin";
import Spinner from "../../components/common/utils/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { User, UserGroup } from "../../type/userType";
import { z } from "zod";
import { useForm, UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "../../utils/Toast";
import { updateCurrentUser } from "../../store/slices/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { getUserDetails } from "../../api/services/user";
import transformUserDetails from "../../utils/transformUserDetails";

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
export default function Profile() {
  usePageTitle("User Profile");

  const dispatch = useDispatch<AppDispatch>();

  const [transformedUser, setTransformedUser] = useState<
    FormFields | undefined
  >(undefined);
  const [userId, setUserId] = useState("");

  const currentUser = useSelector((state: RootState) => state.auth.user);

  const userCode = currentUser?.usercode!;

  const { data: userDetails, isFetching: userDetailsFetching } = useQuery({
    queryKey: ["profile", userCode], // Correctly pass queryKey as part of an object
    queryFn: async () => {
      return getUserDetails(userCode); // Pass userCode to getUserDetails
    },
    enabled: !!userCode,
    refetchOnWindowFocus: false,
  });

  const {
    handleSubmit,
    register,
    reset,
    formState: { isDirty },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: undefined,
  });

  useEffect(() => {
    if (userDetails && !userDetailsFetching) {
      console.log(userDetails);
      const formDefaultValue = transformUserDetails(userDetails);
      setTransformedUser(formDefaultValue);

      reset(formDefaultValue);

      const { id, password, ...rest } = userDetails;
      setUserId(id);
      dispatch(
        updateCurrentUser({
          ...rest,
          userGroup: {
            ...rest.userGroup,
          },
        })
      );
    }
  }, [userDetails, reset, dispatch]);

  const {
    data: groupList,
    isLoading: groupListLoading,
    isFetching: groupListFetching,
  } = useQuery({
    queryFn: getUserGroupList,
    queryKey: ["profile", "getGroups"],
  });

  let groupListData: { code: string; id: string }[] | undefined =
    groupList &&
    groupList.map((item: UserGroup) => ({ code: item.code, id: item.id }));

  const success = (data: User) => {
    const { id, password, ...user } = data;
    console.log(user);
    const transformedUser = {
      ...user,
      userGroup: {
        ...user?.userGroup,
        id: user?.userGroup.id?.toString(),
      },
    };
    dispatch(updateCurrentUser(transformedUser));
    showToast.success("User Updated");
    reset(transformedUser);
  };

  const error = () => {
    showToast.error("Failed updating user");
  };

  const { mutateAsync: updateUserMutate, isPending: updateUserPending } =
    useMutation({
      mutationFn: updateUser,
      mutationKey: ["admin", "updateUser"],
      onSuccess: success,
      onError: error,
    });

  const handleReset = () => {
    if (transformedUser) {
      reset(transformedUser);
    }
  };

  const onSubmit = async (data: FormFields) => {
    const user: User = {
      ...data,
      status: "ACTIVE",
    };
    await updateUserMutate({ id: userId, user });
  };

  if (userDetailsFetching && groupListFetching) {
    return <Spinner />;
  }

  return (
    <>
      <PageTitle>Profile</PageTitle>
      <form
        className="flex flex-col py-4 gap-10"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Container title="Personal Information">
          <div className="flex flex-col md:justify-around md:flex-row gap-2">
            <div className="flex-1">
              <Input id="first_name" label="First Name" register={register} />
            </div>
            <div className="flex-1">
              <Input id="last_name" label="Last Name" register={register} />
            </div>
          </div>
        </Container>
        <Container title="Identification">
          <div className="flex flex-col md:justify-around md:flex-row  gap-2">
            <div className="flex-1">
              <Input id="usercode" label="User Name" register={register} />
            </div>
            <div className="flex-1">
              <Input id="email" label="Email" register={register} />
            </div>
          </div>
        </Container>
        <Container title="Account Details">
          <div className="flex flex-col md:justify-around md:flex-row  gap-2">
            <div className="flex-1 flex flex-col">
              <label className="text-lg">Role</label>
              <select
                className="md:w-4/6 p-1 bg-white border-b border-b-gray-500 focus-visible:outline-none outline-none"
                id="role"
                {...register("userGroup.id")}
                disabled={!currentUser?.userGroup.isAdmin || groupListLoading}
              >
                {groupListData?.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.code}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 hidden">
              <Input
                id="password"
                label="Password"
                attributes={{ type: "password" }}
                register={register}
              />
            </div>
          </div>
        </Container>
        <div className="flex justify-between gap-10 md:justify-end md:gap-5 md:px-5">
          <button
            className="p-3 bg-green-500 text-white rounded-md flex-1 md:flex-none disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={handleReset}
            disabled={!isDirty || updateUserPending}
          >
            Reset
          </button>
          <button
            className="p-3 bg-primary text-white rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed flex-1 md:flex-none"
            disabled={!isDirty || updateUserPending}
            type="submit"
          >
            {updateUserPending ? "Loading..." : "Update"}
          </button>
        </div>
      </form>
    </>
  );
}

function Container({
  children,
  title,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="p-10 border rounded-2xl shadow-lg bg-white">
      <h2 className="text-xl mb-5 font-bold">{title}</h2>
      {children}
    </div>
  );
}

function Input({
  register,
  id,
  label,
  attributes,
}: {
  register: UseFormRegister<any>;
  id: string;
  label: string;
  attributes?: Partial<JSX.IntrinsicElements["input"]>;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = attributes?.type === "password";
  return (
    <div className="flex flex-col">
        <label htmlFor={id} className="text-lg">
          {label}
        </label>
      <div className="relative md:w-4/6">
        <input
          className="w-full text-base p-1 pr-10 border-b border-b-gray-500 focus:border-b-sky-500 focus-visible:outline-none"
          {...register(id)}
          {...attributes}
          type={isPasswordType && showPassword ? "text" : attributes?.type}
          id={id}
        />

        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary focus:outline-none"
          >
            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}
