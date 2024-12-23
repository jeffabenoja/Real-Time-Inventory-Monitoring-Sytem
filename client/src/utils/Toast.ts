import { toast } from "sonner"

export const showToast = {
  success: (message: string) =>
    toast.success(message, {
      style: {
        color: "#16A34A",
      },
    }),
  error: (message: string) =>
    toast.error(message, {
      style: {
        color: "#7f1d1d",
      },
    }),
}
