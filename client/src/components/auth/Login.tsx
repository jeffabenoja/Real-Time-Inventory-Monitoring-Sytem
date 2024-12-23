import { useState } from "react"
import { UserLogin } from "../../type/userType"
import { useNavigate } from "react-router-dom"
import { useLoginUser } from "../../api/hooks/useUserHook"
import Spinner from "../common/Spinner"
import { showToast } from "../../utils/Toast"

const Login = () => {
  const [login, setLogin] = useState<UserLogin>({
    usercode: "",
    password: "",
  })
  const { mutate: loginUser, isPending, error } = useLoginUser()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogin({
      ...login,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    loginUser(login, {
      onSuccess: () => {
        navigate("/dashboard/overview")
        showToast.success("Login Successful")
      },

      onError: () => {
        showToast.error("Unauthorized Access")
      },
    })
  }

  // Error message handling
  const getErrorMessage = (error: any): string => {
    if (error?.response?.data?.message) {
      return error.response.data.message // If the backend returns a custom message
    }
    if (error?.message) {
      return error.message // Generic error message
    }
    return "An unknown error occurred." // Default error message
  }

  return (
    <div className='flex items-center justify-center h-screen w-full '>
      {isPending ? (
        <Spinner loading={isPending} />
      ) : (
        <div className='w-6/12 rounded-xl bg-[#FFF] h-[500px] overflow-hidden shadow-2xl p-6 flex md:flex-row gap-8 items-center justify-center'>
          <div className='flex-1'>
            <h1 className='text-md md:text-2xl font-bold mb-8 text-primary'>
              Sign In Credentials
            </h1>

            <form onSubmit={handleSubmit}>
              <div className='flex flex-col gap-16'>
                <div className='input-field'>
                  <input
                    type='text'
                    id='usercode'
                    name='usercode'
                    required
                    className='peer'
                    autoComplete='off'
                    value={login.usercode}
                    onChange={handleChange}
                  />
                  <label htmlFor='usercode'>User Code</label>
                </div>
                <div className='input-field'>
                  <input
                    type='password'
                    id='password'
                    name='password'
                    required
                    className='peer'
                    autoComplete='off'
                    value={login.password}
                    onChange={handleChange}
                  />
                  <label htmlFor='password'>Password</label>
                </div>
              </div>
              <div className='w-full mt-14 flex items-center justify-end'>
                <span className='text-xs font-bold cursor-pointer hover:text-primary'>
                  Forgot Password?
                </span>
              </div>
              <button
                className='w-full rounded-full border-0 outline-transparent p-2 bg-red-800
           font-medium my-5 cursor-pointer text-white hover:bg-primary'
                type='submit'
              >
                Sign In
              </button>
            </form>
            {error && (
              <div className='w-full text-center text-primary font-bold text-xs'>
                {getErrorMessage(error)}
              </div>
            )}
          </div>
          <div className='hidden lg:block flex-1 px-3'>
            <h1 className='text-2xl xl:text-4xl font-bold mb-8 text-primary'>
              E&L Delicatessen Real-Time Inventory Monitoring System
            </h1>
            <p className='text-sm text-justify'>
              "Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Repellendus eveniet tempora nobis quibusdam. Magni quo sunt
              veritatis delectus cupiditate repudiandae reprehenderit sequi
              minus cum, et voluptatibus temporibus, fugiat, enim dolorem."
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Login
