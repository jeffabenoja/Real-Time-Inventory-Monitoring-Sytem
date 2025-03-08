import { useEffect, useState } from "react";
import { UserLogin } from "../../type/userType";
import { useLoginUser } from "../../hooks/user/useLoginUser";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import banner from "../../assets/banner.jpg";

const Login = () => {
  useEffect(() => {
    document.title = "Login | E&L Delicatessen";
  }, []);

  const [login, setLogin] = useState<UserLogin>({
    usercode: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="flex flex-col items-center md:items-stretch  lg:flex lg:flex-row lg:items-stretch relative p-10 md:p-0 h-screen w-screen justify-center">
      <div className="lg:hidden">
        <div className="text-center font-heading">
          <h1 className="text-xl md:text-3xl gap-2 text-primary">
            E&L DELICATESSEN
          </h1>
        </div>
      </div>
      <div className="flex flex-col justify-center lg:flex-1 lg:px-10">
        <h2 className="text-2xl lg:text-4xl mb-10 text-center">
          Welcome! Let’s get you signed in.
        </h2>
        <form onSubmit={handleSubmit} className="flex justify-center">
          <div className="w-full md:w-3/5 lg:w-4/5 2xl:w-3/5">
            <div className="flex flex-col mb-5">
              <label htmlFor="usercode" className="text-sm">
                User Name
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
            <div className="flex flex-col mb-2 relative">
              <label htmlFor="password" className="text-sm">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className="text-base p-2 border border-gray-500 focus:border-sky-500 focus-visible:outline-none rounded pr-10"
                required
                autoComplete="off"
                value={login.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-8 text-primary"
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold cursor-pointer hover:text-primary">
                Forgot Password?
              </span>
            </div>
            <button
              className="text-xl w-full my-5 rounded bg-primary p-2 font-medium cursor-pointer text-white hover:bg-secondary"
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
      <div className="hidden lg:block flex-1 relative">
        <img src={banner} alt="Banner" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/60 to-primary/95 p-5 lg:flex flex-col justify-between text-white font-heading">
          <h1 className="text-5xl flex items-center gap-2">E&L DELICATESSEN</h1>
          <h3 className="text-2xl">
            Ensuring quality ingredients, seamless inventory, and strong
            supplier partnerships with integrity and innovation.
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Login;
