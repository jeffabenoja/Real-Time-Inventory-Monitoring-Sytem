import { useMutation } from "@tanstack/react-query"
import { loginUser } from "../../api/services/user"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { login } from "../../store/slices/auth"
import { AppDispatch } from "../../store"

export const useLoginUser = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data, variables) => {
      navigate("/dashboard/overview")

      const user = {
        ...data["userDetails:  "],
        password: variables.password,
        loggedInAt: data["loggedInAt:   "],
      }

      dispatch(login(user))
    },
  })
}
