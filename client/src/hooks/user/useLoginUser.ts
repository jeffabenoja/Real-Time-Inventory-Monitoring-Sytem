import { useMutation } from "@tanstack/react-query"
import { loginUser } from "../../api/services/user"
import { useNavigate } from "react-router-dom"
import { showToast } from "../../utils/Toast"
import { useDispatch } from "react-redux"
import { login } from "../../store/slices/auth"
import { AppDispatch } from "../../store"

export const useLoginUser = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      navigate("/dashboard/overview")
      showToast.success("Login Successful")

      const user = {
        ...data["userDetails:  "],
        loggedInAt: data["loggedInAt:   "],
      }

      dispatch(login(user))
    },
    onError: () => {
      showToast.error("Unauthorized Access")
    },
  })
}
