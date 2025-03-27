import React, { useState } from "react"
import { showToast } from "../../utils/Toast"
import { StockInType, UpdateStockType } from "../../type/stockType"
import ConfirmationModal from "./ConfirmationModal"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../store"
import { rawMatsStockOut } from "../../store/slices/inventory"

interface UpdateStockProps {
  product: StockInType | any | null
  toggleModal: () => void
  isLoading: boolean
  onSubmit: (item: UpdateStockType) => void
}

const UpdateStockOut: React.FC<UpdateStockProps> = ({
  product,
  toggleModal,
  onSubmit,
  isLoading,
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const [updateStock, setUpdateStock] = useState<UpdateStockType>({
    remarks: product?.remarks || "",
    quantity: product?.quantity || 0,
    batchNo: product?.batchNo || "",
    status: product?.status || "",
  })
  const [confirmSubmit, setConfirmSubmit] = useState<boolean>(false)
  const [confirmCancel, setConfirmCancel] = useState<boolean>(false)

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
        id: product.item.id,
      }

      try {
        onSubmit(stockToUpdate)

        dispatch(
          rawMatsStockOut({
            itemId: product.item.id,
            quantity: stockToUpdate.quantity,
          })
        )
      } catch (error) {
        console.log("error updating stock", error)
      }
    }

    toggleModal()
  }

  return (
    <div className='flex flex-col gap-6'>
      <h3 className='heading-l text-primary font-bold '>
        Update Status for {product?.item?.code} - {product?.item?.description}
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
            <p className='text-white font-bold text-xs'>Update</p>
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
              {isLoading ? (
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

export default UpdateStockOut
