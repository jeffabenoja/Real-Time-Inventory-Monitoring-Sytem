import React, { useState } from "react"
import { showToast } from "../../utils/Toast"
import { StockInType, UpdateStockType } from "../../type/stockType"

interface UpdateStockProps {
  product: StockInType | null
  toggleModal: () => void
  isLoading: boolean
  onSubmit: (item: UpdateStockType) => void
}

const UpdateStockRawMats: React.FC<UpdateStockProps> = ({
  product,
  toggleModal,
  onSubmit,
  isLoading,
}) => {
  const [updateStock, setUpdateStock] = useState<UpdateStockType>({
    remarks: product?.remarks || "",
    quantity: product?.quantity || 0,
    batchNo: product?.batchNo || "",
    status: product?.status || "",
  })

  const [invalidFields, setInvalidFields] = useState<string[]>([])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setUpdateStock((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }))

    setInvalidFields((prev) => prev.filter((field) => field !== name))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const requiredFields: string[] = ["remarks", "quantity", "batchNo"]

    const emptyFields = requiredFields.filter(
      (field) => !updateStock[field as keyof typeof updateStock]
    )

    if (emptyFields.length > 0) {
      setInvalidFields(emptyFields)
      showToast.error("Please fill out all required fields.")
      return
    }

    if (product?.transactionNo) {
      const stockToUpdate = {
        ...updateStock,
        transactionNo: product.transactionNo,
      }

      onSubmit(stockToUpdate)
    }

    toggleModal()
  }

  return (
    <div className='flex flex-col gap-6'>
      <h3 className='heading-l text-primary font-bold text-2xl'>
        {product?.item?.code}
      </h3>
      <form
        className='flex flex-col gap-4 text-secondary-200'
        onSubmit={handleSubmit}
      >
        <div className='flex flex-col gap-2 '>
          <label htmlFor='status' className='text-sm '>
            Status
          </label>
          <div className='flex-1'>
            <select
              id='status'
              name='status'
              value={updateStock.status}
              disabled={
                updateStock.status === "COMPLETED" ||
                updateStock.status === "completed"
                  ? true
                  : false
              }
              onChange={handleChange}
              className={`${
                invalidFields.includes("status") && "border-red-900"
              } w-full p-2 rounded-md border cursor-pointer outline-transparent bg-transparent text-xs
        focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
            >
              <option value='DRAFT'>DRAFT</option>
              <option value='COMPLETED'>COMPLETED</option>
              <option value='CANCEL'>CANCEL</option>
            </select>
          </div>
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
              value={updateStock.quantity}
              onChange={handleChange}
              className={`${
                invalidFields.includes("quantity") && "border-primary"
              } w-[120px] md:w-[150px] py-1 pl-4 pr-1 border border-secondary-200 border-opacity-25 rounded-md outline-transparent bg-transparent focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <label htmlFor='batchNumber' className='text-sm'>
              Batch Number
            </label>
            <input
              id='batchNumber'
              type='text'
              name='batchNo'
              value={updateStock.batchNo}
              onChange={handleChange}
              autoComplete='off'
              className={`${
                invalidFields.includes("batchNo") && "border-primary"
              } w-[120px] md:w-[150px] py-2 px-4 border border-secondary-200 border-opacity-25 rounded-md outline-transparent bg-transparent placeholder:text-sm focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
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
            value={updateStock.remarks}
            autoComplete='off'
            onChange={handleChange}
            className={`${
              invalidFields.includes("remarks") && "border-primary"
            } py-2 px-4 border border-secondary-200 border-opacity-25 rounded-md outline-transparent bg-transparent placeholder:text-sm focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
          />
        </div>

        <div className='flex justify-between items-center'>
          <p className='text-xs'>
            Created Date:{" "}
            <span>
              {product?.createdDateTime
                ? new Date(product.createdDateTime).toLocaleDateString("en-US")
                : "N/A"}
            </span>
          </p>

          <p className='text-xs'>
            Created By: <span>{product?.createdBy}</span>
          </p>
        </div>

        <div className='flex items-center justify-end mt-4 gap-5'>
          <button
            type='button'
            onClick={toggleModal}
            className='bg-red-700 rounded-md py-2.5 w-[150px] text-white font-bold text-xs text-center'
          >
            Cancel
          </button>

          <button
            type='submit'
            className={`rounded-md border-0 outline-transparent py-2.5
           font-medium cursor-pointer text-white bg-blue-700 w-[150px]`}
          >
            {isLoading ? (
              <div className='w-5 h-5 border-2 border-t-2 border-[#0A140A] border-t-white rounded-full animate-spin'></div>
            ) : (
              <p className='text-white font-bold text-xs'>Update</p>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default UpdateStockRawMats
