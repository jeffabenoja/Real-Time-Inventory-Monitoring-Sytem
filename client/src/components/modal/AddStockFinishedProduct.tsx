import React, { useState } from "react"
import { showToast } from "../../utils/Toast"
import { useAddStock } from "../../hooks/stock/useAddStock"
import { ItemType } from "../../type/itemType"
import { AssembleStock } from "../../type/stockType"
import { useSelector } from "react-redux"
import { User } from "../../type/userType"
import ConfirmationModal from "./ConfirmationModal"
import EscapeKeyListener from "../../utils/EscapeKeyListener"
import { generateRandomBatchNumber } from "../../utils/generateRandomBatchNumber"

interface AddStockProps {
  product: ItemType | null
  toggleModal: () => void
}

interface UserAuthenticationType {
  auth: {
    user: User
  }
}

const AddStocksFinishedProduct: React.FC<AddStockProps> = ({
  product,
  toggleModal,
}) => {
  const defaultItem: ItemType = {
    id: "",
    code: "",
    description: "",
    category: "",
    brand: "",
    unit: "",
    reorderPoint: 0,
    price: 0,
    cost: 0,
  }
  const [stock, setStock] = useState<AssembleStock>({
    transactionDate: `${new Date().toISOString().split("T")[0]}`,
    remarks: "",
    finishProduct: product || defaultItem,
    expiryDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 7)
      return date.toISOString().split("T")[0]
    })(),
    quantity: 0,
    batchNo: "",
  })

  const { user } = useSelector((state: UserAuthenticationType) => state.auth)

  const { addStockFinishGoods, isPendingFinishedGoods } = useAddStock()
  const [confirmSubmit, setConfirmSubmit] = useState<boolean>(false)
  const [confirmCancel, setConfirmCancel] = useState<boolean>(false)
  const [invalidFields, setInvalidFields] = useState<string[]>([])

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
      "expiryDate",
    ]

    const emptyFields = requiredFields.filter(
      (field) => !stock[field as keyof AssembleStock]
    )

    if (emptyFields.length > 0) {
      setInvalidFields(emptyFields)

      showToast.error("Please fill out all required fields.")

      return
    } else {
      // Regex pattern to match yyyy-mm-dd format
      const datePattern = /^\d{4}-\d{2}-\d{2}$/

      if (stock.transactionDate && !datePattern.test(stock.transactionDate)) {
        setInvalidFields((prev) => [...prev, "transactionDate"])
        showToast.error("Invalid date format")
        return
      }
    }

    if (stock.quantity < 0) {
      setInvalidFields((prev) => [...prev, "quantity"])
      showToast.error("Quantity value is not valid.")
      return
    }

    const { finishProduct, ...stockWithoutItem } = stock

    const finalProduct = finishProduct

    const batchNumber = generateRandomBatchNumber(product?.id || "")

    const assembleStock = {
      ...stockWithoutItem,
      batchNo: batchNumber,
      assembleQuantity: stock.quantity,
      finishProduct: {
        ...finalProduct,
      },
    }

    const usercode = user.usercode
    const token = user.password!

    addStockFinishGoods({ assembleStock, usercode, token })

    toggleModal()
  }

  return (
    <div className='flex flex-col gap-6'>
      <EscapeKeyListener onEscape={toggleModal} />
      <h3 className='border-b border-[#14aff1]  pb-1 font-bold uppercase'>
        {product?.code}
      </h3>
      <div className='flex flex-col gap-2'>
        <p className='text-sm font-bold'>Product Name</p>
        <span
          className={`py-2 px-4 border border-secondary-200 border-opacity-25 rounded-md outline-transparent bg-transparent placeholder:text-sm
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
        >
          {product?.description}
        </span>
      </div>
      <form
        className='flex flex-col gap-4 text-secondary-200'
        onSubmit={handleSubmit}
      >
        <div className='flex flex-col gap-2'>
          <label htmlFor='transactionDate' className='text-sm'>
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

        <div className='flex flex-col gap-2'>
          <label htmlFor='expiryDate' className='text-sm font-bold'>
            Expiration Date
          </label>
          <input
            id='expiryDate'
            type='date'
            name='expiryDate'
            onChange={handleChange}
            value={stock.expiryDate}
            autoComplete='off'
            className={`${
              invalidFields.includes("expiryDate") && "border-primary"
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
              {isPendingFinishedGoods ? (
                <div className='flex justify-center items-center w-full h-full'>
                  <div className='w-5 h-5 border-2 border-t-2 border-[#0A140A] border-t-white rounded-full animate-spin'></div>
                </div>
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

export default AddStocksFinishedProduct
