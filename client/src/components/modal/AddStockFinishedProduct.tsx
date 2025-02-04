import React, { useState } from "react"
import { showToast } from "../../utils/Toast"
import { useAddStock } from "../../hooks/stock/useAddStock"
import { ItemType } from "../../type/itemType"

interface AddStockProps {
  product: ItemType | null
  toggleModal: () => void
}

interface UpdateStockType {
  transactionDate: string
  remarks: string
  item: ItemType
  quantity: number
  batchNo: string
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
    status: "INACTIVE",
  }
  const [stock, setStock] = useState<UpdateStockType>({
    transactionDate: "",
    remarks: "",
    item: product || defaultItem,
    quantity: 0,
    batchNo: "",
  })

  const { addStockFinishGoods, isPendingFinishedGoods } = useAddStock()

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
      (field) => !stock[field as keyof UpdateStockType]
    )

    if (emptyFields.length > 0) {
      setInvalidFields(emptyFields)

      showToast.error("Please fill out all required fields.")

      return
    } else {
      // Regex pattern to match yyyy-mm-dd format
      const datePattern = /^\d{4}-\d{2}-\d{2}$/

      if (!datePattern.test(stock.transactionDate)) {
        setInvalidFields((prev) => [...prev, "transactionDate"])
        showToast.error("Invalid date format")
        return
      }
    }

    const finishProduct = stock.item

    const updatedStock = {
      ...stock,
      assemble_quantity: stock.quantity,
      finishProduct: {
        ...finishProduct,
      },
    }

    addStockFinishGoods(updatedStock)

    toggleModal()
  }

  return (
    <div className='flex flex-col gap-6'>
      <h3 className='heading-l text-primary font-bold text-2xl'>
        Add Stock for {product?.code}
      </h3>
      <div className='flex flex-col gap-2'>
        <label htmlFor='productName' className='text-sm font-bold'>
          Product Name
        </label>
        <input
          id='productName'
          type='text'
          name='productName'
          value={product?.description}
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
            type='text'
            name='transactionDate'
            value={stock.transactionDate}
            onChange={handleChange}
            placeholder='yyyy-mm-dd'
            autoComplete='off'
            className={`${
              invalidFields.includes("transactionDate") && "border-primary"
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
          {isPendingFinishedGoods ? (
            <div className='w-5 h-5 border-2 border-t-2 border-[#0A140A] border-t-white rounded-full animate-spin'></div>
          ) : (
            <p>Add New Stock</p>
          )}
        </button>
      </form>
    </div>
  )
}

export default AddStocksFinishedProduct
