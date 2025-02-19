import { UseFormRegister } from "react-hook-form";
import Error from "./Error";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

interface Props {
  label: string;
  registrationKey?: string;
  id: string;
  register: UseFormRegister<any>;
  error?: string;
  attributes?: Partial<JSX.IntrinsicElements["input"]>;
  touched?: boolean;
}

export default function Input({
  label,
  id,
  register,
  attributes,
  registrationKey,
  error,
}: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = attributes?.type === "password";
  const classes = `text-base p-1 border border-gray-500 focus:border-sky-500 focus-visible:outline-none rounded w-full`;
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm">
          {label}
        </label>
      )}
      <div className="relative">

      <input
        className={classes}
        {...register(registrationKey ? registrationKey : id)}
        id={id}
        {...attributes}
        type={isPasswordType ? (showPassword ? "text" : "password") : attributes?.type}
      ></input>
      {isPasswordType && (
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary focus:outline-none"
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              )}
      </div>
      <Error error={error} />
    </div>
  );
}
