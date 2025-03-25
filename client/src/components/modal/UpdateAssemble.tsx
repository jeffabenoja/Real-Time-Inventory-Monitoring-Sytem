import { AssembleTransaction, AssembleUpdateStock } from "../../type/stockType"
import { ItemType } from "../../type/itemType"
import { useState } from "react"
import { showToast } from "../../utils/Toast"
import { useUpdateAssemble } from "../../hooks/stock/useUpdateAssemble"
import ConfirmationModal from "./ConfirmationModal"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../store"
import { rawMatsStockIn } from "../../store/slices/inventory"

interface UpdateAssembleProps {
  row: AssembleTransaction | null
  close: () => void
}
const UpdateAssemble: React.FC<UpdateAssembleProps> = ({ row, close }) => {
  const dispatch = useDispatch<AppDispatch>()
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
    status: undefined,
  }
  const [assembleUpdate, setAssembleUpdate] = useState<AssembleUpdateStock>({
    transactionNo: row?.transactionNo || "",
    remarks: row?.remarks || "",
    finishProduct: row?.finishProduct || defaultItem,
    assembleQuantity: row?.assembleQuantity || 0,
    batchNo: row?.batchNo || "",
    status: row?.status || "",
  })

  const { updateAssembleStock, isPending } = useUpdateAssemble()
  const [confirmSubmit, setConfirmSubmit] = useState<boolean>(false)
  const [confirmCancel, setConfirmCancel] = useState<boolean>(false)
  const [invalidFields, setInvalidFields] = useState<string[]>([])
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const requiredFields: string[] = ["remarks", "assembleQuantity", "batchNo"]

    const emptyFields = requiredFields.filter(
      (field) => !assembleUpdate[field as keyof AssembleUpdateStock]
    )

    if (emptyFields.length > 0) {
      setInvalidFields(emptyFields)

      showToast.error("Please fill out all required fields.")
      return
    }

    try {
      updateAssembleStock(assembleUpdate)

      dispatch(
        rawMatsStockIn({
          itemId: assembleUpdate.finishProduct.id,
          quantity: assembleUpdate.assembleQuantity,
        })
      )
    } catch (error) {
      console.log("error updating stock", error)
    }

    close()
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    setAssembleUpdate((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  return (
    <div className='max-w-full mx-auto overflow-auto scrollbar'>
      <div className='flex justify-between items-center'>
        <h1 className='mb-2 font-bold'>Order Number: {row?.transactionNo}</h1>
        <p className='text-xs'>
          Created Date:{" "}
          {row?.createdDateTime
            ? new Date(row.createdDateTime).toLocaleDateString("en-US")
            : "N/A"}
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className='pt-4 px-2 border-t border-[#14aff1] flex flex-col gap-5'>
          <div className='flex flex-col md:flex-row gap-5 justify-between'>
            <div className='flex items-center justify-between gap-2 '>
              <label htmlFor='transactionDate' className='text-sm '>
                Transaction Date:
              </label>
              <div className='md:flex-1'>
                <input
                  id='transactionDate'
                  type='text'
                  name='transactionDate'
                  value={
                    row?.transactionDate
                      ? new Date(row.transactionDate).toLocaleDateString(
                          "en-US"
                        )
                      : "N/A"
                  }
                  readOnly
                  autoComplete='off'
                  className={`w-full p-2 rounded-md border outline-transparent bg-transparent text-xs
                      focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
                />
              </div>
            </div>

            <div className='flex items-center justify-between gap-2 flex-1 '>
              <label htmlFor='remarks' className='text-sm '>
                Remarks:
              </label>
              <div className='md:flex-1'>
                <input
                  id='remarks'
                  type='text'
                  name='remarks'
                  onChange={handleChange}
                  value={assembleUpdate?.remarks}
                  className={`${
                    invalidFields.includes("remarks") && "border-red-900"
                  } w-full p-2 rounded-md border outline-transparent bg-transparent text-xs
                      focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
                />
              </div>
            </div>
          </div>
          <p className='font-medium'>Product Details</p>
          <div className='flex flex-col md:flex-row gap-5 items-center justify-between'>
            <div className='flex items-center gap-2 relative'>
              <label htmlFor='productCode' className='text-sm w-[120px]'>
                Code:
              </label>
              <input
                id='productCode'
                type='text'
                name='productCode'
                value={row?.finishProduct.code}
                readOnly
                autoComplete='off'
                className={`w-full p-2 rounded-md border outline-transparent bg-transparent text-xs
                        focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
              />
            </div>
            <div className='flex items-center gap-2 '>
              <label htmlFor='productName' className='text-sm w-[120px]'>
                Name:
              </label>
              <input
                id='productName'
                type='text'
                name='productName'
                value={row?.finishProduct.description}
                readOnly
                autoComplete='off'
                className={`w-full p-2 rounded-md border outline-transparent bg-transparent text-xs
                        focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
              />
            </div>
            <div className='flex items-center gap-2 '>
              <label htmlFor='Category' className='text-sm w-[120px]'>
                Category:
              </label>
              <input
                id='Category'
                type='text'
                name='Category'
                value={row?.finishProduct.category}
                readOnly
                autoComplete='off'
                className={`w-full p-2 rounded-md border outline-transparent bg-transparent text-xs
                        focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
              />
            </div>
          </div>

          <div className='flex flex-col md:flex-row gap-5 items-center justify-between'>
            <div className='flex items-center gap-2 '>
              <label htmlFor='brand' className='text-sm w-[120px] '>
                Brand:
              </label>
              <input
                id='brand'
                type='text'
                name='brand'
                value={row?.finishProduct.brand}
                readOnly
                autoComplete='off'
                className={`w-full p-2 rounded-md border outline-transparent bg-transparent text-xs
                        focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
              />
            </div>
            <div className='flex items-center gap-2 relative'>
              <label htmlFor='unit' className='text-sm w-[120px]'>
                Units:
              </label>
              <input
                id='unit'
                type='text'
                name='unit'
                value={row?.finishProduct.unit}
                readOnly
                autoComplete='off'
                className={`w-full p-2 rounded-md border outline-transparent bg-transparent text-xs
                        focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
              />
            </div>
            <div className='flex items-center gap-2 '>
              <label htmlFor='reorderPoint' className='text-sm w-[120px]'>
                Stock Level:
              </label>
              <input
                id='reorderPoint'
                type='text'
                name='reorderPoint'
                value={row?.finishProduct.reorderPoint}
                readOnly
                autoComplete='off'
                className={`w-full p-2 rounded-md border outline-transparent bg-transparent text-xs
                        focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
              />
            </div>
          </div>
          <div className='flex flex-col md:flex-row gap-5 items-center justify-between'>
            <div className='flex items-center gap-2 '>
              <label htmlFor='price' className='text-sm w-[120px] '>
                Price:
              </label>
              <input
                id='price'
                type='text'
                name='price'
                value={row?.finishProduct.price}
                readOnly
                autoComplete='off'
                className={`w-full p-2 rounded-md border outline-transparent bg-transparent text-xs
                        focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
              />
            </div>
            <div className='flex items-center gap-2 relative'>
              <label htmlFor='cost' className='text-sm w-[120px]'>
                Cost:
              </label>
              <input
                id='cost'
                type='text'
                name='cost'
                value={row?.finishProduct.cost}
                readOnly
                autoComplete='off'
                className={`w-full p-2 rounded-md border outline-transparent bg-transparent text-xs
                        focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
              />
            </div>
            <div className='flex items-center gap-2 '>
              <label htmlFor='statusProduct' className='text-sm w-[120px]'>
                Status:
              </label>
              <input
                id='statusProduct'
                type='text'
                name='status'
                value={row?.finishProduct.status}
                readOnly
                autoComplete='off'
                className={`w-full p-2 rounded-md border outline-transparent bg-transparent text-xs
                        focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
              />
            </div>
          </div>

          <p className='font-medium'>Transaction Details</p>

          <div className='flex flex-col md:flex-row gap-5 items-center justify-between'>
            <div className='flex items-center gap-2 '>
              <label htmlFor='assembleQuantity' className='text-sm w-[120px] '>
                Quantity:
              </label>
              <input
                id='assembleQuantity'
                type='number'
                name='assembleQuantity'
                onChange={handleChange}
                value={assembleUpdate?.assembleQuantity}
                className={`${
                  invalidFields.includes("assembleQuantity") && "border-red-900"
                } w-full p-2 rounded-md border outline-transparent bg-transparent text-xs
                        focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
              />
            </div>
            <div className='flex items-center gap-2'>
              <label htmlFor='batchNo' className='text-sm w-[120px]'>
                Batch:
              </label>
              <input
                id='batchNo'
                type='text'
                name='batchNo'
                onChange={handleChange}
                value={assembleUpdate?.batchNo}
                autoComplete='off'
                className={`${
                  invalidFields.includes("batchNo") && "border-red-900"
                } w-full p-2 rounded-md border outline-transparent bg-transparent text-xs
                      focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
              />
            </div>
            <div className='flex items-center gap-2 w-full '>
              <label htmlFor='status' className='text-sm w-[120px]'>
                Status:
              </label>
              <select
                id='status'
                name='status'
                value={assembleUpdate?.status}
                disabled={
                  assembleUpdate?.status === "COMPLETED" ||
                  assembleUpdate?.status === "completed"
                    ? true
                    : false
                }
                onChange={handleChange}
                className={`${
                  invalidFields.includes("batchNo") && "border-red-900"
                } w-full p-2 rounded-md border outline-transparent bg-transparent text-xs
                        focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
              >
                <option value='DRAFT'>DRAFT</option>
                <option value='COMPLETED'>COMPLETED</option>
                <option value='CANCEL'>CANCEL</option>
              </select>
            </div>
          </div>
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
              onClick={close}
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
              {isPending ? (
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

export default UpdateAssemble
