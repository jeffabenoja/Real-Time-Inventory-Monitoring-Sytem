import { useEffect, useState } from "react";
import { User, UserLogin } from "../../type/userType";
import { useLoginUser } from "../../hooks/user/useLoginUser";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import banner from "../../assets/banner.jpg";
import Modal from "../common/utils/CustomModalV2";
import { z } from "zod";
import Input from "../common/utils/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserList } from "../../api/services/admin";
import Spinner from "../common/utils/Spinner";
import { forgotPassword } from "../../api/services/user";
import { useLocation } from "react-router-dom";
import PasswordReset from "./password-reset/PasswordReset";
import Error from "../common/utils/Error";

const schema = z.object({
  reset_email: z
    .string()
    .min(1, "Required Field")
    .email({ message: "Please enter a valid email address" }),
});

type FormFields = z.infer<typeof schema>;

const Login = () => {
  const location = useLocation();

  const isPasswordReset = location.pathname.includes("/password-reset");
  let userCode;

  if (isPasswordReset) {
    const queryParams = new URLSearchParams(location.search);
    userCode = queryParams.get("userCode");
  }

  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);


  useEffect(() => {
    document.title = "Login | E&L Delicatessen";
  }, []);

  const [login, setLogin] = useState<UserLogin>({
    usercode: "",
    password: "",
  });

  const [isDisabled, setIsDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(
    isPasswordReset && userCode
  );

  const { mutate: loginUser, isPending, error } = useLoginUser();
  const { data: userList, isFetching } = useQuery<User[]>({
    queryFn: getUserList,
    queryKey: ["admin", "getUserList"],
    refetchOnWindowFocus: false,
  });
  
  const successState = () => {
    setShowError(false)
    setShowSuccess(true)
  }

  const errorState = () => {
    setShowSuccess(false)
    setShowError(true);
  }
  
  const { mutateAsync: resetPassword, isPending: reseting } = useMutation({
    mutationFn: forgotPassword,
    mutationKey: ["user", "forgotPassword"],
    onSuccess: successState,
    onError: errorState,
  });

  const {
    handleSubmit: submit,
    register,
    reset,
    setError,
    formState: { errors, isValid },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const onSubmit = async (data: FormFields) => {
    const currentUser = userList?.find(
      (user) => user.email === data.reset_email
    );
    if (!currentUser) {
      setError("reset_email", {
        type: "manual",
        message: "Email not found.",
      });
      return;
    }

    const baseUrl = window.location.origin;

    const payload = {
      service_id: import.meta.env.VITE_EMAIL_JS_SERVICE_ID,
      template_id: import.meta.env.VITE_EMAIL_JS_TEMPLATE_ID,
      user_id: import.meta.env.VITE_EMAIL_JS_PUBLIC_KEY,
      template_params: {
        from_name: "E&L Delicatessen",
        to_name: currentUser.first_name,
        to_email: data.reset_email,
        reset_link: `${baseUrl}/login/password-reset?userCode=${currentUser.usercode}`,
      },
    };

    await resetPassword(payload);

    setIsDisabled(true);
    setCountdown(20)

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setShowSuccess(false)
          setIsDisabled(false);
          setShowError(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

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

  const toggleModal = () => {
    setShowModal((prev) => {
      if (prev) {
        reset();
        setShowError(false);
      }
      return !prev;
    });
  };

  const closeResetPassword = () => {
    setShowPasswordReset(false);
  };

  return (
    <>
      {showPasswordReset && (
        <Modal closeModal={closeResetPassword} desktopCross noPadding>
          <PasswordReset userCode={userCode} closeModal={closeResetPassword} />
        </Modal>
      )}
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
                  {showPassword ? (
                    <FaEyeSlash size={20} />
                  ) : (
                    <FaEye size={20} />
                  )}
                </button>
              </div>
              <div className="text-right">
                <span
                  className="text-sm font-bold cursor-pointer hover:text-primary"
                  onClick={toggleModal}
                >
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
          <img
            src={banner}
            alt="Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/60 to-primary/95 p-5 lg:flex flex-col justify-between text-white font-heading">
            <h1 className="text-5xl flex items-center gap-2">
              E&L DELICATESSEN
            </h1>
            <h3 className="text-2xl">
              Ensuring quality ingredients, seamless inventory, and strong
              supplier partnerships with integrity and innovation.
            </h3>
          </div>
        </div>
      </div>
      {showModal && (
        <Modal closeModal={toggleModal} desktopCross noPadding>
          {isFetching ? (
            <Spinner />
          ) : (
            <div>
              <h2 className="font-primary text-center text-2xl">
                Password Reset
              </h2>
              <p className="font-primary text-center text-base mb-5">
                Please enter your email address below to receive a password
                reset link.
              </p>
              <form
                onSubmit={submit(onSubmit)}
                className="flex flex-col gap-5 items-center w-full"
              >
                <div className="w-full">
                  <Input
                    label={""}
                    id={"email"}
                    register={register}
                    registrationKey="reset_email"
                    error={errors.reset_email?.message}
                    attributes={{ placeholder: "Email" }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!isValid || isDisabled}
                  className={`font-medium transition
          ${
            !isValid || isDisabled || reseting
              ? "text-gray-500 cursor-not-allowed"
              : "text-primary"
          }
        `}
                >
                  {isDisabled
                    ? `Try again in ${countdown} seconds`
                    : reseting
                    ? "Sending..."
                    : "Send Link"}
                </button>
                {showError && !showSuccess && <Error error={"Failed to send email."} />}
                {showSuccess && !showError && <p className="text-green-500">Link sent successfully. If you haven't received it, please try again.</p>}
              </form>
            </div>
          )}
        </Modal>
      )}
    </>
  );
};

export default Login;
