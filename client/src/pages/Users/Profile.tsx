import { useEffect, useState } from "react";
import PageTitle from "../../components/common/utils/PageTitle";
import { useMutation, useQuery } from "@tanstack/react-query";
import usePageTitle from "../../hooks/usePageTitle";
import { getUserGroupList, updateUser } from "../../api/services/admin";
import Spinner from "../../components/common/utils/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { User, UserGroup } from "../../type/userType";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "../../utils/Toast";
import { updateCurrentUser } from "../../store/slices/auth";
import { getUserDetails } from "../../api/services/user";
import transformUserDetails from "../../utils/transformUserDetails";
import CustomModal from "../../components/common/utils/CustomModalV2";
import Input from "../../components/profile/Input";
import PasswordUpdate from "../../components/profile/PasswordUpdate";
import md5 from "md5"

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
  const [updatePasswordModal, setIsUpdatePasswordModal] = useState(false);

  const toggleUpdatePasswordModal = () => {
    setIsUpdatePasswordModal((prev) => !prev);
  };

  usePageTitle("User Profile");

  const dispatch = useDispatch<AppDispatch>();

  const [transformedUser, setTransformedUser] = useState<
    FormFields | undefined
  >(undefined);
  const [userId, setUserId] = useState("");

  const currentUser = useSelector((state: RootState) => state.auth.user);

  const userCode = currentUser?.usercode!;

  const { data: userDetails, isFetching: userDetailsFetching } = useQuery({
    queryKey: ["profile", userCode],
    queryFn: async () => {
      return getUserDetails(userCode);
    },
    enabled: !!userCode,
    refetchOnWindowFocus: false,
  });

  const {
    handleSubmit,
    register,
    reset,
    formState: { dirtyFields, errors },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: transformedUser || undefined,
  });

  useEffect(() => {
    if (userDetails && !userDetailsFetching) {
      console.log("did this run")
      const formDefaultValue = transformUserDetails(userDetails);
      console.log(formDefaultValue)
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
  }, [userDetails, reset, dispatch, userDetailsFetching]);

  const {
    data: groupList,
    isLoading: groupListLoading,
    isFetching: groupListFetching,
  } = useQuery({
    queryFn: getUserGroupList,
    queryKey: ["profile", "getGroups"],
    refetchOnWindowFocus: false,
  });

  let groupListData: { code: string; id: string }[] | undefined =
    groupList &&
    groupList.map((item: UserGroup) => ({ code: item.code, id: item.id }));

  const success = (data: User) => {
    const formDefaultValue = transformUserDetails(data);
    const { id, password, ...user } = data;

    const hashPassword = md5(password)

    const transformedUser = {
      ...user,
      password: hashPassword,
      loggedInAt: data?.loggedInAt,
      userGroup: {
        ...user?.userGroup,
        id: user?.userGroup.id?.toString(),
      },
    };
    dispatch(updateCurrentUser(transformedUser));
    reset(formDefaultValue);
    showToast.success("User Updated");
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
    const isPassword = updatePasswordModal
    const user: User = {
      ...data,
      status: "ACTIVE",
    };
    await updateUserMutate({ id: userId, user });
    if(isPassword){
      toggleUpdatePasswordModal()
    }
  };

  if (userDetailsFetching && groupListFetching) {
    return <Spinner />;
  }

  const isDirty = Object.keys(dirtyFields).length > 0;

  return (
    <>
      <PageTitle>Profile</PageTitle>
      <form
        className="flex flex-col py-4 gap-10"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="p-10 border rounded-2xl shadow-lg bg-white flex flex-col gap-10">
          <div>
            <h2 className="text-xl mb-5 font-bold">Personal Information</h2>
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3">
                <Input id="first_name" label="First Name" register={register} error={errors.first_name?.message} />
              </div>
              <div className="md:w-1/3">
                <Input id="last_name" label="Last Name" register={register} />
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-xl mb-5 font-bold">Account Information</h2>
            <div className="flex flex-col md:flex-row gap-2">
              <div className="md:w-1/3">
                <Input id="usercode" label="User Name" register={register} />
              </div>
              <div className="md:w-1/3">
                <Input id="email" label="Email" register={register} />
              </div>
              <div className="flex flex-col md:w-1/3">
                <label className="text-lg mb-2">Role</label>
                <select
                  className="p-1 bg-white border-b border-b-gray-500 focus-visible:outline-none outline-none md:w-5/6"
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
            </div>
          </div>
          <div className="flex justify-between gap-10 md:justify-end md:gap-5">
            <button
              className="p-3 bg-gray-500 text-white rounded-md flex-1 md:flex-none font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed disabled:font-normal"
              onClick={handleReset}
              disabled={!isDirty || updateUserPending}
            >
              Reset
            </button>
            <button
              className="p-3 bg-primary text-white rounded-md disabled:bg-gray-400 font-semibold disabled:cursor-not-allowed flex-1 md:flex-none disabled:font-normal"
              disabled={!isDirty || updateUserPending}
              type="submit"
            >
              {updateUserPending && !updatePasswordModal ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
        <div className="p-10 border rounded-2xl shadow-lg bg-white flex flex-col ">
          <h2 className="text-xl mb-5 font-bold">Security</h2>
          <div className="flex flex-col gap-2 md:flex-row md:gap-0 md:justify-between">
            <div className="md:w-1/3">
              <Input
                customWidth="md:w-5/6"
                id="password"
                label="Password"
                attributes={{ type: "password" }}
                register={register}
                isDisabled={true}
              />
            </div>
            <button
              type="button"
              className="p-3 bg-primary rounded text-white cursor-pointer"
              onClick={toggleUpdatePasswordModal}
            >
              Update Password
            </button>
          </div>
        </div>
      </form>
      {updatePasswordModal && (
        <CustomModal closeModal={() => setIsUpdatePasswordModal(false)}>
          <PasswordUpdate
            closeModal={() => setIsUpdatePasswordModal(false)}
            currentPassword={userDetails.password}
            updateUserPending={updateUserPending}
            userDetails={userDetails}
            onSubmit={onSubmit}
          />
        </CustomModal>
      )}
    </>
  );
}
