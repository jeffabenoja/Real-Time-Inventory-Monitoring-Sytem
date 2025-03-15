import Table from "./table/Table"
import { useRef } from "react"
import { createColumnHelper } from "@tanstack/react-table"
import { IoIosClose } from "react-icons/io"
import { DetailsProduct } from "./SalesOrderComponent"
import { useState } from "react"

const productFields = [
  { key: "item.code", label: "Product Code", classes: "uppercase" },
  { key: "item.description", label: "Product Name", classes: "capitalize" },
  { key: "item.category", label: "Category", classes: "capitalize" },
  { key: "item.brand", label: "Brand", classes: "uppercase" },
  { key: "item.unit", label: "Unit", classes: "lowercase" },
  { key: "currentStock", label: "Current Stock" },
]

const ProductItem = ({
  fields,
  onRemove,
  onQuantityChange,
  onPriceChange,
}: {
  fields: { key: string; label: string; classes?: string }[]
  onRemove: (productId: string) => void
  onQuantityChange: (productId: string, quantity: string) => void
  onPriceChange: (productId: string, price: string) => void
}) => {
  const columnHelper = createColumnHelper<any>()

  const quantityRefs = useRef<{ [key: string]: string }>({})
  const priceRefs = useRef<{ [key: string]: string }>({})

  return [
    ...fields.map((field) =>
      columnHelper.accessor(field.key, {
        cell: (info) => (
          <span className={`${field.classes}`}>{info.getValue()}</span>
        ),
        header: () => <span className='truncate'>{field.label}</span>,
      })
    ),

    columnHelper.accessor("quantity", {
      id: "qty",
      header: () => <span className='truncate'>Quantity</span>,
      cell: ({ row }) => {
        const productCode = row.original.item.code
        const currentStock = row.original.currentStock || 0
        const [quantity, setQuantity] = useState(
          row.original.orderQuantity || 1
        )
        const [isQuantityValid, setIsQuantityValid] = useState(true)
        const [currentValue, setCurrentValue] = useState(quantity)
        const handleQuantityChange = (
          e: React.ChangeEvent<HTMLInputElement>
        ) => {
          const value = e.target.value
          setQuantity(value)
          if (value > currentStock) {
            setIsQuantityValid(false)
            setCurrentValue(value)
          } else {
            setIsQuantityValid(true)
          }
          priceRefs.current[productCode] = value
        }

        const handleBlur = () => {
          const value =
            priceRefs.current[productCode] || row.original.orderQuantity
          onQuantityChange(productCode, value)
        }

        const borderClass = isQuantityValid
          ? "border-gray-900 border-opacity-25 focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary"
          : "border-red-900 focus:border-red-900 focus:outline-none active:border-red-900 active:outline-none hover:border-red-900"

        return (
          <input
            type='number'
            id='qty'
            autoComplete='off'
            min={1}
            name='qty'
            value={quantity}
            onChange={handleQuantityChange}
            onBlur={handleBlur}
            className={` ${
              currentValue > currentStock
                ? "border-red-900 focus:border-red-900 focus:outline-none active:border-red-900 active:outline-none hover:border-red-900"
                : ""
            } w-[100px] py-1 pl-4 pr-1 border ${borderClass} rounded-md outline-transparent bg-transparent `}
          />
        )
      },
    }),

    columnHelper.accessor("Price", {
      id: "prc",
      header: () => <span className='truncate'>Price</span>,
      cell: ({ row }) => {
        const productCode = row.original.item.code
        const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value
          quantityRefs.current[productCode] = value
        }

        const handleBlur = () => {
          const value =
            quantityRefs.current[productCode] || row.original.itemPrice
          onPriceChange(productCode, value)
        }

        return (
          <input
            type='number'
            id='price'
            autoComplete='off'
            min={1}
            name='price'
            defaultValue={row.original.itemPrice}
            onChange={handlePriceChange}
            onBlur={handleBlur}
            className='w-[100px] py-1 pl-4 pr-1 border border-gray-900 border-opacity-25 rounded-md outline-transparent bg-transparent focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary'
          />
        )
      },
    }),

    columnHelper.accessor("remove", {
      id: "remove",
      header: () => <span className='truncate'>Remove</span>,
      cell: ({ row }) => (
        <div className='flex gap-2 items-center justify-center'>
          <button
            className='px-4 py-2 hover:text-primary'
            onClick={() => onRemove(row.original.item.code)}
          >
            <IoIosClose size={20} />
          </button>
        </div>
      ),
    }),
  ]
}

interface ItemSalesOrderProps {
  productItems: DetailsProduct[]
  toggleModal: () => void
  setProductItems: React.Dispatch<React.SetStateAction<DetailsProduct[]>>
}

const DisplaySalesOrderItems: React.FC<ItemSalesOrderProps> = ({
  productItems,
  toggleModal,
  setProductItems,
}) => {
  const productItemColumn = ProductItem({
    fields: productFields,
    onRemove: (productCode: string) => {
      setProductItems((prevProduct) =>
        prevProduct.filter((p) => p.item.code !== productCode)
      )
    },

    onQuantityChange: (productCode, quantity) => {
      setProductItems((prevProduct) =>
        prevProduct.map((product) =>
          product.item.code === productCode
            ? { ...product, orderQuantity: quantity }
            : product
        )
      )
    },

    onPriceChange: (productCode, price) => {
      setProductItems((prevProduct) =>
        prevProduct.map((product) =>
          product.item.code === productCode
            ? { ...product, itemPrice: price }
            : product
        )
      )
    },
  })
  return (
    <>
      <Table
        data={productItems}
        columns={productItemColumn}
        search={true}
        withImport={false}
        withExport={false}
        withSubmit={false}
        withCancel={false}
        materials={true}
        add={false}
        view={false}
        toggleModal={toggleModal}
      />
    </>
  )
}

export default DisplaySalesOrderItems
