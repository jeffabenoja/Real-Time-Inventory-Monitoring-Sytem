import { useMutation } from "@tanstack/react-query"
import { loginUser } from "../services/user"

// Login user mutation hook
export const useLoginUser = () => {
  return useMutation({
    mutationFn: loginUser,
    onError: (error: Error) => {
      console.error("Error logging in:", error.message)
    },
  })
}
