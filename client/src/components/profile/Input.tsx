import { UseFormRegister } from "react-hook-form";
import Error from "../common/utils/Error";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Input({
  register,
  id,
  label,
  attributes,
  customWidth,
  isDisabled,
  error,
  showFunctionality,
}: {
  register: UseFormRegister<any>;
  id: string;
  label: string;
  attributes?: Partial<JSX.IntrinsicElements["input"]>;
  customWidth?: string;
  isDisabled?: boolean;
  error?: string;
  showFunctionality?: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-lg">
        {label}
      </label>
      <div className={`relative ${customWidth ? customWidth : "md:w-5/6"}`}>
        <input
          className={`w-full text-base p-1 border-b border-b-gray-500  ${
            isDisabled
              ? "disabled:cursor-not-allowed disabled:bg-gray-50" // A visible disabled background
              : "focus:border-b-sky-500 focus-visible:outline-none"
          }`}
          {...register(id)}
          {...attributes}
          disabled={isDisabled}
          id={id}
          type={showFunctionality ? (showPassword ? "text" : "password") : attributes?.type}
        />
        {showFunctionality && (
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
