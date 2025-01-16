import React, { useState } from "react"
import { showToast } from "../../utils/Toast"

interface AddItemsProps {
  title?: String
  isProduct?: boolean
  isStocklist?: boolean
  toggleModal: () => void
}

interface ProductProps {
  code: string
  description: string
  category: string
  brand: string
  unit: string
  reorderPoint: string
  price: string
  cost: string
}

const AddItems: React.FC<AddItemsProps> = ({
  title,
  isProduct,
  isStocklist,
  toggleModal,
}) => {
  const [product, setProduct] = useState<ProductProps>({
    code: "",
    description: "",
    category: "",
    brand: "",
    unit: "",
    reorderPoint: "",
    price: "",
    cost: "",
  })

  const [invalidFields, setInvalidFields] = useState<string[]>([])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

    const requiredFields = [
      "code",
      "description",
      "category",
      "unit",
      "reorderPoint",
      "price",
      "cost",
    ]

    const emptyFields = requiredFields.filter(
      (field) => !product[field as keyof ProductProps]
    )

    if (emptyFields.length > 0) {
      setInvalidFields(emptyFields)
      showToast.error("Fill all the required Fields")
      return
    }

    if (product.brand === "") {
      product.brand = "N/A"
    }

    // Add logic to save the product
    console.log("Product Data:", product)
    toggleModal() // Close modal after submission
  }

  return (
    <div className='flex flex-col gap-6'>
      <h3 className='heading-l text-primary font-bold text-2xl'>{title}</h3>
      <form
        className='flex flex-col gap-4 text-secondary-200'
        onSubmit={handleSubmit}
      >
        <div className='flex flex-col gap-2'>
          <label htmlFor='productCode' className='text-sm font-bold'>
            Product Code
          </label>
          <input
            id='productCode'
            type='text'
            name='code'
            value={product.code}
            onChange={handleChange}
            placeholder='e.g Ube Halaya'
            autoComplete='off'
            className={`${
              invalidFields.includes("code") && "border-primary"
            } py-2 px-4 border border-secondary-200 border-opacity-25 rounded-md outline-transparent bg-transparent placeholder:text-sm
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
          />
        </div>

        <div className='flex flex-col gap-2'>
          <label htmlFor='description' className='body-l'>
            Description
          </label>
          <textarea
            id='description'
            rows={2}
            placeholder="e.g. It's always good to take a break. Try our Ube Halaya to help you relax."
            name='description'
            value={product.description}
            autoComplete='off'
            onChange={handleChange}
            className={`${
              invalidFields.includes("description") && "border-primary"
            } py-2 px-4 border border-secondary-200 border-opacity-25 rounded-md outline-transparent bg-transparent placeholder:text-sm
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
              value={product.category}
              onChange={handleChange}
              className={`${
                invalidFields.includes("category") && "border-primary"
              } w-[120px] md:w-[200px] py-1 px-4 border border-secondary-200 border-opacity-25 rounded-md outline-transparent bg-transparent
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
              className='w-[120px] md:w-[150px] py-1 px-4 border border-secondary-200 border-opacity-25 rounded-md outline-transparent bg-transparent
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary'
            />
          </div>
        </div>

        <div className='w-full flex justify-between'>
          <div className='flex flex-col gap-2'>
            <label htmlFor='unit' className='text-sm'>
              Unit
            </label>
            <input
              type='text'
              id='unit'
              name='unit'
              autoComplete='off'
              value={product.unit}
              onChange={handleChange}
              className={`${
                invalidFields.includes("unit") && "border-primary"
              } w-[120px] py-1 px-4 border border-secondary-200 border-opacity-25 rounded-md outline-transparent bg-transparent
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <label htmlFor='reorderPoint' className='text-sm'>
              Reorder Point
            </label>
            <input
              type='number'
              step='1'
              min='1'
              id='reorderPoint'
              autoComplete='off'
              name='reorderPoint'
              value={product.reorderPoint}
              onChange={handleChange}
              className={`${
                invalidFields.includes("reorderPoint") && "border-primary"
              } w-[120px] md:w-[150px] py-1 pl-4 pr-1 border border-secondary-200 border-opacity-25 rounded-md outline-transparent bg-transparent
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
            />
          </div>
        </div>

        <div className='w-full flex justify-between'>
          {isProduct && (
            <div className='flex flex-col gap-2'>
              <label htmlFor='price' className='text-sm'>
                Selling Price
              </label>
              <input
                type='number'
                step='0.01'
                id='price'
                name='price'
                autoComplete='off'
                value={product.price}
                onChange={handleChange}
                className={`${
                  invalidFields.includes("price") && "border-primary"
                } w-[120px] md:w-[180px] py-1 pl-4 pr-1 border border-secondary-200 border-opacity-25 rounded-md outline-transparent bg-transparent
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
              />
            </div>
          )}

          {isStocklist && (
            <div className='flex flex-col gap-2'>
              <label htmlFor='cost' className='text-sm'>
                Expenses Cost
              </label>
              <input
                type='number'
                step='0.01'
                id='cost'
                autoComplete='off'
                name='cost'
                value={product.cost}
                onChange={handleChange}
                className={`${
                  invalidFields.includes("cost") && "border-primary"
                } w-[120px] md:w-[180px] py-1 pl-4 pr-1 border border-secondary-200 border-opacity-25 rounded-md outline-transparent bg-transparent
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
              />
            </div>
          )}
        </div>

        <button
          className='w-full rounded-full border-0 outline-transparent p-2
           font-medium my-5 cursor-pointer text-white bg-primary'
          type='submit'
        >
          <p>Add New Product</p>
        </button>
      </form>
    </div>
  )
}

export default AddItems
