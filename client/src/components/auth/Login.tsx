import { useState } from "react"
import { UserLogin } from "../../type/userType"
import { useNavigate } from "react-router-dom"
import { useLoginUser } from "../../api/hooks/useUserHook"

const Login = () => {
  const [login, setLogin] = useState<UserLogin>({
    usercode: "",
    password: "",
  })
  const { mutate: loginUser } = useLoginUser()
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
        navigate("/dashboard")
      },
    })
  }

  return (
    <div className='flex items-center justify-center h-screen w-full '>
      <div className='w-6/12 rounded-xl bg-[#FFF] h-[500px] overflow-hidden shadow-2xl p-6 flex flex-col md:flex-row gap-8 md:items-center'>
        <div className='flex-1'>
          <h1 className='text-2xl font-bold mb-8 text-red-900'>
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
              <span className='text-xs font-bold cursor-pointer hover:text-red-900'>
                Forgot Password?
              </span>
            </div>
            <button
              className='w-full rounded-full border-0 outline-transparent p-2 bg-red-800
           font-medium my-5 cursor-pointer text-white hover:bg-red-900'
              type='submit'
            >
              Sign In
            </button>
          </form>
        </div>
        <div className='flex-1 px-3'>
          <h1 className='text-4xl font-bold mb-8 text-red-900'>
            E&L Delicatessen Real-Time Inventory Monitoring System
          </h1>
          <p className='text-sm text-justify'>
            "Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Repellendus eveniet tempora nobis quibusdam. Magni quo sunt
            veritatis delectus cupiditate repudiandae reprehenderit sequi minus
            cum, et voluptatibus temporibus, fugiat, enim dolorem."
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
