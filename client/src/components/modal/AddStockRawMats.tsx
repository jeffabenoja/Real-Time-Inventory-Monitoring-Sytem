import React, { useState } from "react"
import { showToast } from "../../utils/Toast"
import { StockType } from "../../type/StockType"
import { useAddStock } from "../../hooks/stock/useAddStock"

interface AddStockProps {
  productCode?: string
  toggleModal: () => void
}

const AddStocksRawMats: React.FC<AddStockProps> = ({
  productCode,
  toggleModal,
}) => {
  const [stock, setStock] = useState<StockType>({
    transactionDate: "",
    remarks: "",
    item: {
      code: productCode || "",
    },
    quantity: 0,
  })

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

    // Regex pattern to match yyyy-mm-dd format
    const datePattern = /^\d{4}-\d{2}-\d{2}$/

    if (!datePattern.test(stock.transactionDate)) {
      setInvalidFields((prev) => [...prev, "transactionDate"])
      showToast.error("Invalid date format")
      return
    }

    console.log("Added Stock", {
      ...stock,
    })

    addStock(stock)

    toggleModal()
  }

  return (
    <div className='flex flex-col gap-6'>
      <h3 className='heading-l text-primary font-bold text-2xl'>
        {productCode}
      </h3>
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
            type='text'
            name='transactionDate'
            value={stock.transactionDate}
            onChange={handleChange}
            placeholder='yyyy-mm-dd'
            autoComplete='off'
            className={`${
              invalidFields.includes("code") && "border-primary"
            } py-2 px-4 border border-secondary-200 border-opacity-25 rounded-md outline-transparent bg-transparent placeholder:text-sm
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
              invalidFields.includes("description") && "border-primary"
            } py-2 px-4 border border-secondary-200 border-opacity-25 rounded-md outline-transparent bg-transparent placeholder:text-sm
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
          />
        </div>

        <div className='flex flex-col gap-2'>
          <label htmlFor='quantity' className='text-sm'>
            Quantity
          </label>
          <input
            type='number'
            step='1'
            min='1'
            id='quantity'
            autoComplete='off'
            name='quantity'
            value={stock.quantity}
            onChange={handleChange}
            className={`${
              invalidFields.includes("reorderPoint") && "border-primary"
            } w-[120px] md:w-[150px] py-1 pl-4 pr-1 border border-secondary-200 border-opacity-25 rounded-md outline-transparent bg-transparent
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
          />
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
