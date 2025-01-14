import React, { useState } from "react"

interface AddItemsProps {
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

const AddItems: React.FC<AddItemsProps> = ({ toggleModal }) => {
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("Product Data:", product)
    // Add logic to save the product
    toggleModal() // Close modal after submission
  }

  return (
    <div className='flex flex-col gap-6'>
      <h3 className='heading-l text-primary font-bold text-2xl'>Add Product</h3>
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
            className='py-2 px-4 border border-secondary-200 border-opacity-25 rounded-md outline-transparent bg-transparent
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary'
            required
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
            onChange={handleChange}
            className='py-2 px-4 border border-secondary-200 border-opacity-25 rounded-md outline-transparent bg-transparent
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary'
          />
        </div>

        <div className='flex flex-wrap gap-4'>
          <div className='flex flex-col w-full md:w-1/2'>
            <label htmlFor='category' className='text-sm'>
              Category
            </label>
            <input
              type='text'
              id='category'
              name='category'
              value={product.category}
              onChange={handleChange}
              className='input-field'
            />
          </div>
          <div className='flex flex-col w-full md:w-1/2'>
            <label htmlFor='brand' className='text-sm'>
              Brand
            </label>
            <input
              type='text'
              id='brand'
              name='brand'
              value={product.brand}
              onChange={handleChange}
              className='input-field'
            />
          </div>
        </div>
        <div className='flex flex-wrap gap-4'>
          <div className='flex flex-col w-full md:w-1/3'>
            <label htmlFor='unit' className='text-sm'>
              Unit
            </label>
            <input
              type='text'
              id='unit'
              name='unit'
              value={product.unit}
              onChange={handleChange}
              className='input-field'
            />
          </div>
          <div className='flex flex-col w-full md:w-1/3'>
            <label htmlFor='reorderPoint' className='text-sm'>
              Reorder Point
            </label>
            <input
              type='number'
              id='reorderPoint'
              name='reorderPoint'
              value={product.reorderPoint}
              onChange={handleChange}
              className='input-field'
            />
          </div>
          <div className='flex flex-col w-full md:w-1/3'>
            <label htmlFor='price' className='text-sm'>
              Price
            </label>
            <input
              type='number'
              step='0.01'
              id='price'
              name='price'
              value={product.price}
              onChange={handleChange}
              className='input-field'
            />
          </div>
          <div className='flex flex-col w-full md:w-1/3'>
            <label htmlFor='cost' className='text-sm'>
              Cost
            </label>
            <input
              type='number'
              step='0.01'
              id='cost'
              name='cost'
              value={product.cost}
              onChange={handleChange}
              className='input-field'
            />
          </div>
        </div>
        <div className='flex justify-end gap-4'>
          <button type='button' onClick={toggleModal} className='btn-secondary'>
            Cancel
          </button>
          <button type='submit' className='btn-primary'>
            Save Product
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddItems
