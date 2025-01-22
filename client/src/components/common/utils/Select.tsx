import { UseFormRegister } from "react-hook-form"
import Error from "./Error"

interface Option {
  value: string,
  label: string
}

interface Props {
  label: string
  registrationKey?: string
  id: string
  register: UseFormRegister<any>
  error?: string
  attributes?: {}
  touched?: boolean,
  isLoading: boolean,
  options: Option[]
}

export default function Select({label, register, registrationKey, id, attributes, error, isLoading, options}: Props){
  const classes = `text-base px-1 py-1.5 border bg-white border-gray-500 focus:border-sky-500 focus-visible:outline-none rounded`;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm">
          {label}
        </label>
      )}
      <select
        className={classes}
        {...register(registrationKey ? registrationKey : id)}
        id={id}
        {...attributes}
        disabled={isLoading}
      >
        {isLoading ? (
          <option>Loading...</option>
        ) : (
          <>
            <option value="" disabled>
              Select {label}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </>
        )}
      </select>
      <Error error={error} />
    </div>
  )
}