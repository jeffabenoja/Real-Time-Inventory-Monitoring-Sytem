import React, { useState, useEffect } from "react"
import { showToast } from "../../utils/Toast"
import { ItemType } from "../../type/itemType"
import ConfirmationModal from "./ConfirmationModal"
import EscapeKeyListener from "../../utils/EscapeKeyListener"

interface AddItemsProps {
  title?: string
  isProduct?: boolean
  isStocklist?: boolean
  isOnSubmit: (item: ItemType) => void
  isLoading: boolean
  toggleModal: () => void
  productData?: ItemType | null
}

const AddItems: React.FC<AddItemsProps> = ({
  title,
  isProduct,
  isStocklist,
  isOnSubmit,
  isLoading,
  toggleModal,
  productData,
}) => {
  const [product, setProduct] = useState<ItemType>({
    code: "",
    description: "",
    category: "",
    brand: "",
    unit: "pcs",
    reorderPoint: 0,
    price: 0,
    cost: 0,
    status: "ACTIVE",
  })

  useEffect(() => {
    if (productData) {
      setProduct({
        code: productData.code || "",
        description: productData.description || "",
        category: productData.category || "",
        brand: productData.brand || "",
        unit: productData.unit || "",
        reorderPoint: productData.reorderPoint || 0,
        price: productData.price ?? 0,
        cost: productData.cost ?? 0,
        status: productData.status,
      })
    }
  }, [productData])

  const [invalidFields, setInvalidFields] = useState<string[]>([])
  const [confirmSubmit, setConfirmSubmit] = useState<boolean>(false)
  const [confirmCancel, setConfirmCancel] = useState<boolean>(false)

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }))

    setInvalidFields((prev) => prev.filter((field) => field !== name))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const requiredFields: string[] = [
      "code",
      "description",
      "unit",
      "reorderPoint",
    ]

    if (isStocklist) {
      requiredFields.push("price")
      requiredFields.push("cost")
    } else {
      requiredFields.push("price")
    }

    if (productData) {
      requiredFields.push("status")
    }

    const category = isProduct ? "Finished Goods" : "Raw Mats"

    const emptyFields = requiredFields.filter(
      (field) => !product[field as keyof ItemType]
    )

    if (emptyFields.length > 0) {
      setInvalidFields(emptyFields)
      showToast.error("Please fill out all required fields.")
      return
    }

    if (
      product.unit.toLowerCase() !== "kg" &&
      product.unit.toLowerCase() !== "pcs" &&
      product.unit.toLowerCase() !== "pack" &&
      product.unit.toLowerCase() !== "liters"
    ) {
      setInvalidFields((prev) => [...prev, "unit"])
      showToast.error("Invalid unit type")
      return
    }

    if (
      product.status?.toLowerCase() !== "active" &&
      product.status?.toLowerCase() !== "inactive"
    ) {
      setInvalidFields((prev) => [...prev, "unit"])
      showToast.error("Invalid status type")
    }

    const normalizeStatus = product.status?.toUpperCase() as
      | "ACTIVE"
      | "INACTIVE"

    const updatedProduct: ItemType = {
      ...product,
      category,
      brand: product.brand || "N/A",
      status: normalizeStatus,
    }

    if (productData) {
      const isSameProduct = Object.keys(updatedProduct).every(
        (key) =>
          updatedProduct[key as keyof ItemType] ===
          productData[key as keyof ItemType]
      )

      if (isSameProduct) {
        showToast.success("Already up to date.")
        return
      }
    }

    const productPrice = product.price || 0
    const productCost = product.cost || 0
    const reorderPoint = product.reorderPoint || 0
    const averageCost = productData?.averageCost || 0

    if (productPrice <= productCost) {
      showToast.error("Selling price must be greater than cost.")
      return
    }

    if (isProduct) {
      if (reorderPoint <= 0) {
        showToast.error("Reorder point must be greater than 0.")
        return
      }

      if (productPrice <= averageCost) {
        showToast.error("Selling price must be greater than average cost.")
        return
      }
    }

    isOnSubmit(updatedProduct)

    toggleModal()
  }

  return (
    <div className='flex flex-col gap-6'>
      <EscapeKeyListener onEscape={toggleModal} />
      <h3 className=' border-b border-[#14aff1] pb-1 font-bold'>
        {!productData
          ? title
          : `Update ${productData.code} - ${productData.description}`}
      </h3>
      <form
        className='flex flex-col gap-4 text-secondary-200'
        onSubmit={handleSubmit}
      >
        <div className={`${productData ? "hidden" : "flex flex-col gap-2"}`}>
          <label htmlFor='productCode' className='text-sm'>
            Product Code
          </label>
          <input
            id='productCode'
            type='text'
            name='code'
            value={product.code}
            onChange={handleChange}
            placeholder='e.g. ITEM101'
            autoComplete='off'
            readOnly={!!productData}
            className={`${
              invalidFields.includes("code") && "border-primary"
            } py-2 px-4 border uppercase border-opacity-25 rounded-md outline-transparent bg-transparent placeholder:text-sm
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
          />
        </div>

        <div className='flex flex-col gap-2'>
          <label htmlFor='description' className='text-sm'>
            Product Name
          </label>
          <textarea
            id='description'
            rows={1}
            placeholder='e.g. Ube Halaya'
            name='description'
            value={product.description}
            autoComplete='off'
            onChange={handleChange}
            className={`${
              invalidFields.includes("description") && "border-primary"
            } py-2 px-4 border capitalize border-opacity-25 rounded-md outline-transparent bg-transparent placeholder:text-sm
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
          />
        </div>

        <div className='w-full flex justify-between'>
          <div className='flex flex-col gap-2'>
            <label htmlFor='category' className='text-sm'>
              Category
            </label>
            <input
              type='text'
              id='category'
              name='category'
              autoComplete='off'
              value={isProduct ? "Finished Goods" : "Raw Mats"}
              readOnly
              className={`${
                invalidFields.includes("category") && "border-primary"
              } w-[120px] md:w-[180px]  py-1 px-4 border border-opacity-25 rounded-md outline-transparent bg-transparent
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <label htmlFor='brand' className='text-sm'>
              Brand
            </label>
            <input
              type='text'
              id='brand'
              autoComplete='off'
              name='brand'
              value={product.brand}
              onChange={handleChange}
              className='w-[120px] md:w-[150px] py-1 px-4 border border-opacity-25 rounded-md outline-transparent bg-transparent
              focus:border-primary capitalize focus:outline-none active:border-primary active:outline-none hover:border-primary'
            />
          </div>
        </div>

        <div className='w-full flex justify-between'>
          <div className='flex flex-col gap-2'>
            <label htmlFor='unit' className='text-sm '>
              Unit
            </label>
            <div className='flex-1'>
              <select
                id='unit'
                name='unit'
                value={product.unit}
                onChange={handleChange}
                className={`${
                  invalidFields.includes("unit") && "border-primary"
                } w-[120px] py-1 lowercase px-4 border  border-opacity-25 rounded-md outline-transparent bg-transparent
                  focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
              >
                <option value='kg' className='hover:bg-primary'>
                  kg
                </option>
                <option value='pcs' className='hover:bg-primary'>
                  pcs
                </option>
                <option value='pack' className='hover:bg-primary'>
                  pack
                </option>
                <option value='liters' className='hover:bg-primary'>
                  liters
                </option>
              </select>
            </div>
          </div>

          <div className='flex flex-col gap-2'>
            <label htmlFor='reorderPoint' className='text-sm'>
              Reorder Point
            </label>
            <input
              type='number'
              step='0.01'
              min='1'
              id='reorderPoint'
              autoComplete='off'
              name='reorderPoint'
              value={product.reorderPoint}
              onChange={handleChange}
              className={`${
                invalidFields.includes("reorderPoint") && "border-primary"
              } w-[120px] md:w-[150px] py-1 pl-4 pr-1 border border-opacity-25 rounded-md outline-transparent bg-transparent
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
            />
          </div>
        </div>

        {isStocklist ? (
          <div className='w-full flex justify-between'>
            <div className='flex flex-col gap-2'>
              <label htmlFor='price' className='text-sm'>
                Selling Price
              </label>
              <input
                type='number'
                step='0.01'
                min='0.01'
                id='price'
                name='price'
                autoComplete='off'
                value={product.price}
                onChange={handleChange}
                className={`${
                  invalidFields.includes("price") && "border-primary"
                } ${
                  (product?.price ?? 0) <= (product?.cost ?? 0)
                    ? "border-red-700 focus:border-red-700 focus:outline-none active:border-red-700 active:outline-none hover:border-red-700"
                    : "border-primary border-opacity-25"
                } w-[120px] md:w-[180px] py-1 pl-4 pr-1 border  rounded-md outline-transparent bg-transparent
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
              />
            </div>

            <div className='flex flex-col gap-2'>
              <label htmlFor='cost' className='text-sm'>
                Expenses Cost
              </label>
              <input
                type='number'
                step='0.01'
                min='0.01'
                id='cost'
                autoComplete='off'
                name='cost'
                value={product.cost}
                onChange={handleChange}
                className={`${
                  invalidFields.includes("cost") && "border-primary"
                } w-[120px] md:w-[150px] py-1 pl-4 pr-1 border border-opacity-25 rounded-md outline-transparent bg-transparent
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
              />
            </div>
          </div>
        ) : (
          <div className='w-full flex justify-between'>
            <div className='flex flex-col gap-2'>
              <label htmlFor='price' className='text-sm'>
                Selling Price
              </label>
              <input
                type='number'
                step='0.01'
                min='0.01'
                id='price'
                name='price'
                autoComplete='off'
                value={product.price}
                onChange={handleChange}
                className={`
                  ${invalidFields.includes("price") && "border-primary"} 
                  ${
                    (productData?.averageCost ?? 0) > (product?.price ?? 0)
                      ? "border-red-700 focus:border-red-700 focus:outline-none active:border-red-700 active:outline-none hover:border-red-700"
                      : "border-primary border-opacity-25 focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary"
                  } 
                  w-[120px] md:w-[180px] py-1 pl-4 pr-1 border rounded-md outline-transparent bg-transparent
                `}
              />
            </div>

            <div className='flex flex-col gap-2'>
              <label htmlFor='cost' className='text-sm'>
                Average Cost
              </label>
              <input
                type='number'
                step='0.01'
                min='0.01'
                id='cost'
                autoComplete='off'
                name='cost'
                value={
                  productData?.averageCost
                    ? productData.averageCost.toFixed(2)
                    : "0.00"
                }
                readOnly={true}
                className={`$ w-[120px] md:w-[150px] py-1 pl-4 pr-1 border border-opacity-25 rounded-md outline-transparent bg-transparent
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
              />
            </div>
          </div>
        )}

        {productData && (
          <div className='flex flex-col gap-2'>
            <label htmlFor='status' className='text-sm'>
              Status
            </label>
            <select
              id='status'
              name='status'
              value={product.status}
              onChange={handleChange}
              className={`w-full capitalize p-2 rounded-md border cursor-pointer outline-transparent bg-transparent text-xs
        focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
            >
              <option value='ACTIVE'>ACTIVE</option>
              <option value='INACTIVE'>INACTIVE</option>
            </select>
          </div>
        )}

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
            <p className='text-white font-bold text-xs'>
              {!productData ? "Submit" : "Update"}
            </p>
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

export default AddItems
