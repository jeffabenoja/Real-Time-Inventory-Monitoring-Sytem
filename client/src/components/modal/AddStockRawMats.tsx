import React, { useState } from "react"
import { showToast } from "../../utils/Toast"
import { StockInType } from "../../type/stockType"
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

const AddStocksRawMats: React.FC<AddStockProps> = ({
  productName,
  productCode,
  toggleModal,
}) => {
  const [stock, setStock] = useState<StockInType>({
    transactionDate: `${new Date().toISOString().split("T")[0]}`,
    remarks: "",
    item: {
      code: productCode || "",
    },
    quantity: 0,
    batchNo: "",
  })

  const { user } = useSelector((state: UserAuthenticationType) => state.auth)

  const { addStock, isPending } = useAddStock()

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

    const usercode = user.usercode
    const token = user.password!

    addStock({ stock, usercode, token })

    toggleModal()
  }

  return (
    <div className='flex flex-col gap-6'>
      <h3 className='border-b border-[#14aff1] pb-1 font-bold uppercase'>
        {productCode}
      </h3>
      <div className='flex flex-col gap-2'>
        <label htmlFor='productName' className='text-sm font-bold'>
          Product Name
        </label>
        <input
          id='productName'
          type='text'
          name='productName'
          value={productName}
          readOnly
          autoComplete='off'
          className={`py-2 px-4 border border-secondary-200 border-opacity-25 rounded-md outline-transparent bg-transparent placeholder:text-sm
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
        />
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

        <button
          className='w-full rounded-full border-0 outline-transparent p-2
           font-medium mt-5 cursor-pointer text-white bg-primary'
          type='submit'
        >
          {isPending ? (
            <div className='w-5 h-5 border-2 border-t-2 border-[#0A140A] border-t-white rounded-full animate-spin'></div>
          ) : (
            <p>Add New Stock</p>
          )}
        </button>
      </form>
    </div>
  )
}

export default AddStocksRawMats
