import { useState } from "react";
import { UserLogin } from "../../type/userType";
import { useLoginUser } from "../../hooks/user/useLoginUser";

const Login = () => {
  const [login, setLogin] = useState<UserLogin>({
    usercode: "",
    password: "",
  });
  const { mutate: loginUser, isPending, error } = useLoginUser();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogin({
      ...login,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    loginUser(login);
  };

  const getErrorMessage = (error: any): string => {
    if (error?.response?.data?.message || error?.message) {
      return "The information you provided doesn't match our records. Please check and try again.";
    } else {
      return "Something went wrong. Please try again";
    }
  };
  
  return (
    <div className="flex relative gap-10 p-10 md:p-10 h-screen w-screen justify-center ">
      <div className="lg:hidden absolute top-10  left-1/2 transform -translate-x-1/2">
        <div className="text-center font-heading">
          <h1 className="text-5xl">E&L</h1>
          <p className="text-2xl">Delicatessen</p>
        </div>
      </div>
      <div className="hidden lg:flex flex-col justify-between flex-1 bg-primary text-white p-10 rounded font-heading">
        <h1 className="text-5xl">E&L Delicatessen</h1>
        <h3 className="text-2xl">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magni,
          distinctio?
        </h3>
      </div>
      <div className="flex flex-col justify-center flex-1">
        <h2 className="text-2xl lg:text-4xl mb-10 text-center">
          Welcome Back! Please Sign In
        </h2>
        <form onSubmit={handleSubmit} className="flex justify-center">
          <div className="w-full md:w-3/5 lg:w-4/5 2xl:w-3/5">
            <div className="flex flex-col mb-5">
              <label htmlFor="usercode" className="text-sm">
                User Code
              </label>
              <input
                type="text"
                id="usercode"
                name="usercode"
                className="text-base p-2 border border-gray-500 focus:border-sky-500 focus-visible:outline-none rounded"
                required
                autoComplete="off"
                value={login.usercode}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col mb-2">
              <label htmlFor="password" className="text-sm">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="text-base p-2 border border-gray-500 focus:border-sky-500 focus-visible:outline-none rounded"
                required
                autoComplete="off"
                value={login.password}
                onChange={handleChange}
              />
            </div>
            <div className="text-right">
              <span className="text-sm font-bold cursor-pointer hover:text-primary">
                Forgot Password?
              </span>
            </div>
            <button
              className="text-xl w-full my-5 rounded bg-primary p-2
           font-medium cursor-pointer text-white hover:bg-secondary"
              type="submit"
            >
              {!isPending ? "Sign In" : "Loading..."}
            </button>
            {error && (
              <div className="text-center text-red-700 font-bold text-xs">
                {getErrorMessage(error)}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
