import { useState } from "react"
import { NewCustomerType } from "../../type/salesType"
import { showToast } from "../../utils/Toast"
import useCustomerHook from "../../hooks/customer/useCustomerHook"

interface NewCustomerProps {
  close: () => void
}

const CreateNewCustomer: React.FC<NewCustomerProps> = ({ close }) => {
  const { createCustomer, isPending } = useCustomerHook()
  const [invalidFields, setInvalidFields] = useState<string[]>([])
  const [customer, setCustomer] = useState<NewCustomerType>({
    name: "",
    contactPerson: "",
    contactNumber: "",
    address: "",
    status: "ACTIVE",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setCustomer((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }))
  }

  const handleSubmit = () => {
    const requiredFields: string[] = [
      "name",
      "contactPerson",
      "contactNumber",
      "address",
    ]

    const emptyFields = requiredFields.filter(
      (field) => !customer[field as keyof typeof customer]
    )

    if (emptyFields.length > 0) {
      setInvalidFields(emptyFields)
      showToast.error("Please fill out all required fields.")
      return
    }

    createCustomer(customer)
    close()
  }

  return (
    <div className='max-w-full mx-autor '>
      <h1 className='mb-2'>Create New Customer</h1>
      <div className='pt-4 px-2 border-t border-[#14aff1] flex flex-col gap-5'>
        <div className='flex gap-2 flex-col'>
          <label htmlFor='name' className='text-sm'>
            Customer Name
          </label>
          <input
            id='name'
            type='text'
            name='name'
            value={customer.name}
            onChange={handleChange}
            autoComplete='off'
            className={`${
              invalidFields.includes("name") && "border-primary"
            } py-2 px-4 border border-opacity-25 rounded-md outline-transparent bg-transparent placeholder:text-sm
            focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
          />
        </div>
        <div className='flex gap-2 flex-col'>
          <label htmlFor='contactPerson' className='text-sm'>
            Contact Person
          </label>
          <input
            id='contactPerson'
            type='text'
            name='contactPerson'
            value={customer.contactPerson}
            onChange={handleChange}
            autoComplete='off'
            className={`${
              invalidFields.includes("contactPerson") && "border-primary"
            } py-2 px-4 border border-opacity-25 rounded-md outline-transparent bg-transparent placeholder:text-sm
            focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
          />
        </div>
        <div className='flex gap-2 flex-col'>
          <label htmlFor='contactNumber' className='text-sm'>
            Contact Number
          </label>
          <input
            id='contactNumber'
            type='text'
            name='contactNumber'
            value={customer.contactNumber}
            onChange={handleChange}
            autoComplete='off'
            className={`${
              invalidFields.includes("contactNumber") && "border-primary"
            } py-2 px-4 border border-opacity-25 rounded-md outline-transparent bg-transparent placeholder:text-sm
            focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
          />
        </div>
        <div className='flex gap-2 flex-col'>
          <label htmlFor='address' className='text-sm'>
            Contact Address
          </label>
          <input
            id='address'
            type='text'
            name='address'
            value={customer.address}
            onChange={handleChange}
            autoComplete='off'
            className={`${
              invalidFields.includes("address") && "border-primary"
            } py-2 px-4 border border-opacity-25 rounded-md outline-transparent bg-transparent placeholder:text-sm
            focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
          />
        </div>
        <div className='flex gap-2 flex-col'>
          <p className='text-sm '>Status:</p>

          <span
            className='w-full p-2 rounded-md border cursor-pointer outline-transparent bg-transparent text-xs
      focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
         '
          >
            {customer.status}
          </span>
        </div>
        <div className='flex items-center justify-end mt-4 gap-5'>
          <button
            type='button'
            onClick={close}
            className='bg-red-700 rounded-md py-2.5 w-[150px] text-white font-bold text-xs text-center'
          >
            Cancel
          </button>

          <button
            type='button'
            onClick={handleSubmit}
            className='bg-blue-700 rounded-md py-2.5 w-[150px]'
          >
            {isPending ? (
              <div className='flex justify-center items-center w-full h-full'>
                <div className='w-5 h-5 border-2 border-t-2 border-[#0A140A] border-t-white rounded-full animate-spin'></div>
              </div>
            ) : (
              <p className='text-white font-bold text-xs'>Submit</p>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateNewCustomer
