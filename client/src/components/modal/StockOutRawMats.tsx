import React, { useState } from "react"
import { showToast } from "../../utils/Toast"
import { StockInType } from "../../type/stockType"
import ConfirmationModal from "./ConfirmationModal"
import EscapeKeyListener from "../../utils/EscapeKeyListener"
import { useAddStock } from "../../hooks/stock/useAddStock"
import { useSelector } from "react-redux"
import { User } from "../../type/userType"

interface AddStockProps {
  productCode?: string
  productName?: string
  toggleModal: () => void
}
interface UserAuthenticationType {
  auth: {
    user: User
  }
}

const StockOutRawMats: React.FC<AddStockProps> = ({
  productName,
  productCode,
  toggleModal,
}) => {
  const { user } = useSelector((state: UserAuthenticationType) => state.auth)
  const [stock, setStock] = useState<StockInType>({
    transactionDate: `${new Date().toISOString().split("T")[0]}`,
    remarks: "",
    item: {
      code: productCode || "",
    },
    quantity: 0,
    batchNo: "",
  })

  const [confirmSubmit, setConfirmSubmit] = useState<boolean>(false)
  const [confirmCancel, setConfirmCancel] = useState<boolean>(false)

  const [invalidFields, setInvalidFields] = useState<string[]>([])

  const { stockOut, stockOutPending } = useAddStock()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setStock((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }))

    setInvalidFields((prev) => prev.filter((field) => field !== name))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const requiredFields: string[] = [
      "transactionDate",
      "remarks",
      "quantity",
      "batchNo",
    ]

    const emptyFields = requiredFields.filter(
      (field) => !stock[field as keyof StockInType]
    )

    if (emptyFields.length > 0) {
      setInvalidFields(emptyFields)

      showToast.error("Please fill out all required fields.")

      return
    }

    if (stock.quantity < 0) {
      setInvalidFields((prev) => [...prev, "quantity"])
      showToast.error("Quantity value is not valid.")
      return
    }

    const usercode = user.usercode
    const token = user.password!

    stockOut({ stock, usercode, token })
    toggleModal()
  }

  return (
    <div className='flex flex-col gap-6'>
      <EscapeKeyListener onEscape={toggleModal} />
      <h3 className='border-b border-[#14aff1] pb-1'>
        Remove Stock for {productCode} - {productName}
      </h3>
      <div className='flex flex-col gap-2'>
        <p className='text-sm font-bold'>Product Name</p>
        <span
          className={`py-2 px-4 border border-secondary-200 border-opacity-25 rounded-md outline-transparent bg-transparent placeholder:text-sm
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
        >
          {productName}
        </span>
      </div>
      <form
        className='flex flex-col gap-4 text-secondary-200'
        onSubmit={handleSubmit}
      >
        <div className='flex flex-col gap-2'>
          <label htmlFor='transactionDate' className='text-sm font-bold'>
            Transaction Date
          </label>
          <input
            id='transactionDate'
            type='date'
            name='transactionDate'
            onChange={handleChange}
            value={stock.transactionDate}
            autoComplete='off'
            max={new Date().toISOString().split("T")[0]}
            className={`${
              invalidFields.includes("transactionDate") && "border-primary"
            } cursor-pointer py-2 px-4 border border-secondary-200 border-opacity-25 rounded-md outline-transparent bg-transparent placeholder:text-sm
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
          />
        </div>

        <div className='flex justify-between items-center gap-2'>
          <div className='flex flex-col gap-2'>
            <label htmlFor='quantity' className='text-sm'>
              Quantity
            </label>
            <input
              type='number'
              step='1'
              id='quantity'
              autoComplete='off'
              name='quantity'
              value={stock.quantity}
              onChange={handleChange}
              className={`${
                invalidFields.includes("quantity") && "border-primary"
              } w-[120px] md:w-[150px] py-1 pl-4 pr-1 border border-secondary-200 border-opacity-25 rounded-md outline-transparent bg-transparent
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
            />
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor='batchNumber' className='text-sm font-bold'>
              Batch Number
            </label>
            <input
              id='batchNumber'
              type='text'
              name='batchNo'
              value={stock.batchNo}
              onChange={handleChange}
              autoComplete='off'
              className={`${
                invalidFields.includes("batchNo") && "border-primary"
              } w-[120px] md:w-[150px] py-2 px-4 border border-secondary-200 border-opacity-25 rounded-md outline-transparent bg-transparent placeholder:text-sm
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
            />
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          <label htmlFor='remarks' className='body-l'>
            Remarks
          </label>
          <textarea
            id='remarks'
            rows={1}
            placeholder='Add remarks'
            name='remarks'
            value={stock.remarks}
            autoComplete='off'
            onChange={handleChange}
            className={`${
              invalidFields.includes("remarks") && "border-primary"
            } py-2 px-4 border border-secondary-200 border-opacity-25 rounded-md outline-transparent bg-transparent placeholder:text-sm
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
          />
        </div>

        <div className='flex items-center justify-end mt-4 gap-5'>
          <button
            type='button'
            onClick={() => setConfirmCancel(true)}
            className='bg-red-700 rounded-md py-2.5 w-[150px] text-white font-bold text-xs text-center'
          >
            Cancel
          </button>

          <button
            type='button'
            onClick={() => setConfirmSubmit(true)}
            className={`rounded-md border-0 outline-transparent py-2.5
           font-medium cursor-pointer text-white bg-blue-700 w-[150px]`}
          >
            <p className='text-white font-bold text-xs'>Submit</p>
          </button>
        </div>

        {confirmCancel && (
          <ConfirmationModal>
            <button
              type='button'
              onClick={() => setConfirmCancel(false)}
              className='bg-red-700 rounded-md py-2.5 w-[100px] text-white font-bold text-xs text-center'
            >
              Cancel
            </button>

            <button
              type='button'
              onClick={toggleModal}
              className={`rounded-md border-0 outline-transparent py-2.5
           font-medium cursor-pointer text-white bg-blue-700 w-[100px]`}
            >
              <p className='text-white font-bold text-xs'>Confirm</p>
            </button>
          </ConfirmationModal>
        )}

        {confirmSubmit && (
          <ConfirmationModal>
            <button
              type='button'
              onClick={() => setConfirmSubmit(false)}
              className='bg-red-700 rounded-md py-2.5 w-[100px] text-white font-bold text-xs text-center'
            >
              Cancel
            </button>

            <button
              type='button'
              onClick={() => document.querySelector("form")?.requestSubmit()}
              className={`rounded-md border-0 outline-transparent py-2.5
           font-medium cursor-pointer text-white bg-blue-700 w-[100px]`}
            >
              {stockOutPending ? (
                <div className='w-5 h-5 border-2 border-t-2 border-[#0A140A] border-t-white rounded-full animate-spin'></div>
              ) : (
                <p className='text-white font-bold text-xs'>Confirm</p>
              )}
            </button>
          </ConfirmationModal>
        )}
      </form>
    </div>
  )
}

export default StockOutRawMats
