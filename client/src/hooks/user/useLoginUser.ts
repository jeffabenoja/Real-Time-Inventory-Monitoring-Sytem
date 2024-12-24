import { useMutation } from "@tanstack/react-query"
import { loginUser } from "../../api/services/user"
import { useNavigate } from "react-router-dom"
import { showToast } from "../../utils/Toast"

export const useLoginUser = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      navigate("/dashboard/overview")
      showToast.success("Login Successful")
    },
    onError: () => {
      showToast.error("Unauthorized Access")
    },
  })
}
