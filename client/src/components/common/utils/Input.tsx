import { UseFormRegister } from "react-hook-form"
import Error from "./Error"

interface Props {
  label: string
  registrationKey?: string
  id: string
  register: UseFormRegister<any>
  error?: string
  attributes?: {}
  touched?: boolean
}

export default function Input({
  label,
  id,
  register,
  attributes,
  registrationKey,
  error,
}: Props) {
  const classes = `text-base p-1 border border-gray-500 focus:border-sky-500 focus-visible:outline-none rounded`
  return (
    <div className='flex flex-col gap-1'>
      {label && (
        <label htmlFor={id} className='text-sm'>
          {label}
        </label>
      )}
      <input
        className={classes}
        {...register(registrationKey ? registrationKey : id)}
        id={id}
        {...attributes}
      ></input>
      <Error error={error} />
    </div>
  )
}
