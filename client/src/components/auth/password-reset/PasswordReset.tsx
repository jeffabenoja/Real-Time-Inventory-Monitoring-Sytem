import { z } from "zod";
import Input from "../../common/utils/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getUserDetails } from "../../../api/services/user";
import { useMutation, useQuery } from "@tanstack/react-query";
import { updateUser as updateUserFn } from "../../../api/services/admin";
import { User } from "../../../type/userType";
import { showToast } from "../../../utils/Toast";
import { useState } from "react";
import Error from "../../common/utils/Error";

type Props = {
  closeModal: () => void
  userCode: string | null | undefined;
};

const schema = z
  .object({
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type FormFields = z.infer<typeof schema>;

export default function PasswordReset({ userCode, closeModal }: Props) {
  const [showError, setShowError] = useState(false)
  const { data: userDetails } = useQuery({
    queryKey: ["profile", userCode],
    queryFn: async () => {
      if (userCode) return getUserDetails(userCode);
    },
    enabled: !!userCode,
    refetchOnWindowFocus: false,
  });

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isValid },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  let content;

  const success = (data: User) => {
    setShowError(false)
    reset()
    closeModal()
    showToast.success(`Password successfully updated for ${data.usercode}`)
  };

  const error = () => {
    setShowError(true)
  };

  const { mutateAsync: updateUserMutate, isPending: updating } = useMutation({
    mutationFn: updateUserFn,
    mutationKey: ["admin", "updateUser"],
    onSuccess: success,
    onError: error,
  });

  const onSubmit = async(data: FormFields) => {
    setShowError(false)
    const user: User = {
      ...userDetails,
      password: data.newPassword,
      status: "ACTIVE",
    };
    await updateUserMutate({id: userDetails.id, user});
  };

  if (!userDetails) {
    content = <p>Error: User doesn't exist</p>;
  } else {
    content = (
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <Input
          register={register}
          label="New Password"
          id="newPassword"
          attributes={{ type: "password" }}
          error={errors.newPassword?.message}
        />
        <Input
          register={register}
          label="Confirm Password"
          id="confirmPassword"
          attributes={{ type: "password" }}
          error={errors.confirmPassword?.message}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded-md cursor-pointer"
          disabled={!isValid}
        >
          {updating ? "Updating" : "Update"}
        </button>
        {showError && <Error error={"Failed to update password."}/>}
      </form>
    );
  }

  return (
    <>
      <h2 className="text-center font-primary text-center text-2xl mb-5">
        Password Update
      </h2>
      {content}
    </>
  );
}
