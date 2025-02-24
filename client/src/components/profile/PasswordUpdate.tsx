import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { User } from "../../type/userType";
import transformUserDetails from "../../utils/transformUserDetails";
import Input from "./Input";
import { useEffect, useState } from "react";

type Props = {
  closeModal: () => void;
  onSubmit: (data: any) => void;
  currentPassword: string;
  updateUserPending: boolean;
  userDetails: User | undefined;
};

export default function PasswordUpdate({
  closeModal,
  currentPassword,
  updateUserPending,
  onSubmit,
  userDetails,
}: Props) {
  const [isPending, setIsPending] = useState(updateUserPending);

  useEffect(() => {
    setIsPending(updateUserPending);
  }, [updateUserPending]);
  const passwordSchema = z
    .object({
      currentPassword: z
        .string()
        .min(1, "Current password is required")
        .refine((input) => input === currentPassword, {
          message: "Current password is incorrect",
        }),
      newPassword: z
        .string()
        .min(6, "New password must be at least 6 characters"),
      confirmPassword: z.string().min(1, "Please confirm your new password"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    });

  type PasswordFormFields = z.infer<typeof passwordSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordFormFields>({
    resolver: zodResolver(passwordSchema),
    mode: "onBlur",
  });

  const handlePasswordSubmit = async (data: PasswordFormFields) => {
    const details = transformUserDetails(userDetails);
    details!.password = data.newPassword;
    userDetails!.password = data.newPassword;

    onSubmit(details);
  };
  return (
    <form className="flex flex-col gap-5 p-5">
      <h2 className="text-center text-2xl font-bold mb-4">Update Password</h2>

      <Input
        id="currentPassword"
        label="Current Password"
        register={register}
        attributes={{ type: "password" }}
        customWidth={"w-full"}
        error={errors.currentPassword?.message}
        showFunctionality={true}
      />
      <Input
        id="newPassword"
        label="New Password"
        register={register}
        attributes={{ type: "password" }}
        customWidth={"w-full"}
        error={errors.newPassword?.message}
        showFunctionality={true}
      />
      <Input
        id="confirmPassword"
        label="Confirm Password"
        register={register}
        attributes={{ type: "password" }}
        customWidth={"w-full"}
        error={errors.confirmPassword?.message}
        showFunctionality={true}
      />

      <div className="flex justify-end gap-3 mt-4">
        <button
          type="button"
          className="px-4 py-2 bg-gray-500 text-white rounded-md"
          onClick={closeModal}
        >
          Cancel
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-primary text-white rounded-md"
          disabled={isPending}
          onClick={handleSubmit(handlePasswordSubmit)}
        >
          {isPending ? "Updating..." : "Update Password"}
        </button>
      </div>
    </form>
  );
}
