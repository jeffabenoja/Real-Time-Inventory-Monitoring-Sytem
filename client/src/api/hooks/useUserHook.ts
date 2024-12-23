import { useMutation } from "@tanstack/react-query"
import { loginUser } from "../services/user"

export const useLoginUser = () => {
  return useMutation({
    mutationFn: loginUser,
  })
}
