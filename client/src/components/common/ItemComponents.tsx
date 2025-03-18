import PageTitle from "./utils/PageTitle"
import { ItemType } from "../../type/itemType"
import { useState, useRef } from "react"
import Table from "./table/Table"
import CustomModal from "./utils/CustomModal"
import { IoIosClose } from "react-icons/io"
import { createColumnHelper } from "@tanstack/react-table"
import { Link, useNavigate } from "react-router-dom"
import { showToast } from "../../utils/Toast"
import { useItemComponents } from "../../hooks/items/useItemComponents"
import ConfirmationModal from "../modal/ConfirmationModal"
import { RootState } from "../../store"
import { useSelector } from "react-redux"

const fields = [
  { key: "item.code", label: "Product Code", classes: "uppercase" },
  { key: "item.description", label: "Product Name", classes: "capitalize" },
  { key: "item.category", label: "Category", classes: "capitalize" },
  { key: "item.brand", label: "Brand", classes: "uppercase" },
  { key: "item.unit", label: "Unit", classes: "lowercase" },
  { key: "item.reorderPoint", label: "Restocking Point", classes: "uppercase" },
  { key: "item.status", label: "Status", classes: "uppercase" },
]

const fieldsDisplay = [
  { key: "item.code", label: "Product Code", classes: "uppercase" },
  { key: "item.description", label: "Product Name", classes: "capitalize" },
  { key: "item.brand", label: "Brand", classes: "uppercase" },
  { key: "item.unit", label: "Unit", classes: "lowercase" },
  { key: "item.status", label: "Status", classes: "uppercase" },
]

const Columns = ({
  fields,
}: {
  fields: { key: string; label: string; classes?: string }[]
}) => {
  const columnHelper = createColumnHelper<any>()

  return [
    columnHelper.accessor("select", {
      id: "select",
      header: () => <span className='truncate'>Select</span>,
      cell: ({ row }) => (
        <input
          type='checkbox'
          checked={row.getIsSelected()}
          onChange={() => row.toggleSelected()}
          className='w-4 h-4 cursor-pointer'
        />
      ),
    }),
    ...fields.map((field) =>
      columnHelper.accessor(field.key, {
        cell: (info) => (
          <span className={`${field.classes}`}>{info.getValue()}</span>
        ),
        header: () => <span className='truncate'>{field.label}</span>,
      })
    ),
    columnHelper.accessor("currentStock", {
      id: "currentStock",
      cell: ({ row }) => {
        const { inQuantity, outQuantity } = row.original

        const currentStock = inQuantity - outQuantity || 0

        const formattedCurrentStock = currentStock.toFixed(2)

        return <span>{formattedCurrentStock}</span>
      },
      header: () => <span className='truncate'>Current Stock</span>,
    }),
    columnHelper.accessor("item.price", {
      id: "productPrice",
      cell: (info) => {
        const price = info.getValue()
        const formattedPrice =
          price % 1 === 0 ? `${price}.00` : price.toFixed(2)

        return <span>{formattedPrice}</span>
      },
      header: () => <span className='truncate'>Price</span>,
    }),
    columnHelper.accessor("item.cost", {
      id: "productAmount",
      cell: (info) => {
        const cost = info.getValue()
        const formattedPrice = cost % 1 === 0 ? `${cost}.00` : cost.toFixed(2)

        return <span>{formattedPrice}</span>
      },
      header: () => <span className='truncate'>Cost</span>,
    }),
  ]
}
const ItemColumns = ({
  fieldsDisplay,
  onRemove,
  onQuantityChange,
}: {
  fieldsDisplay: { key: string; label: string; classes?: string }[]
  onRemove: (productId: string) => void
  onQuantityChange: (productId: string, quantity: string) => void
}) => {
  const columnHelper = createColumnHelper<any>()

  // Track quantity as a ref to avoid re-rendering on each keystroke
  const quantityRefs = useRef<{ [key: string]: string }>({})

  return [
    ...fieldsDisplay.map((field) =>
      columnHelper.accessor(`rawMaterial.${field.key}`, {
        cell: (info) => (
          <span className={`${field.classes}`}>{info.getValue()}</span>
        ),
        header: () => <span className='truncate'>{field.label}</span>,
      })
    ),
    columnHelper.accessor(`currentStock`, {
      cell: (info) => <span>{info.getValue().toFixed(2)}</span>,
      header: () => <span className='truncate'>Current Stock</span>,
    }),
    columnHelper.accessor("quantity", {
      id: "qty",
      header: () => <span className='truncate'>Used Quantity</span>,
      cell: ({ row }) => {
        const [quantity, setQuantity] = useState(row.original.quantity || 1)
        const currentStock = row.original.currentStock || 0
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
          quantityRefs.current[row.original.rawMaterial.item.code] = value
        }

        const handleBlur = () => {
          const value = quantityRefs.current[row.original.rawMaterial.item.code]
          if (!value) {
            onQuantityChange(
              row.original.rawMaterial.item.code,
              row.original.rawMaterial.quantity
            )
          } else {
            onQuantityChange(row.original.rawMaterial.item.code, value)
          }
        }

        const borderClass = isQuantityValid
          ? "border-gray-900 border-opacity-25 focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary"
          : "border-red-900 focus:border-red-900 focus:outline-none active:border-red-900 active:outline-none hover:border-red-900"

        return (
          <input
            type='text'
            id='qty'
            autoComplete='off'
            name='qty'
            defaultValue={row.original.quantity}
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
    columnHelper.accessor("remove", {
      id: "remove",
      header: () => <span className='truncate'>Remove</span>,
      cell: ({ row }) => (
        <div className='flex gap-2 items-center justify-center'>
          <button
            className='px-4 py-2 hover:text-primary'
            onClick={() => onRemove(row.original.rawMaterial.item.code)}
          >
            <IoIosClose size={20} />
          </button>
        </div>
      ),
    }),
  ]
}

const ItemComponents = () => {
  const inventoryData = useSelector(
    (state: RootState) => state.inventory.inventory
  )
  const { createItem, isPending } = useItemComponents()
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
  const [confirmSubmit, setConfirmSubmit] = useState<boolean>(false)
  const [confirmCancel, setConfirmCancel] = useState<boolean>(false)
  const [rawMaterials, setRawMaterials] = useState<any[]>([])
  const [invalidFields, setInvalidFields] = useState<string[]>([])
  const [productData, setProductData] = useState<ItemType>({
    code: "",
    description: "",
    category: "Finished Goods",
    brand: "N/A",
    unit: "pcs",
    reorderPoint: 1,
    price: 0,
    cost: 0,
  })
  const navigate = useNavigate()

  const columns = Columns({
    fields,
  })

  const rawMaterialsColumns = ItemColumns({
    fieldsDisplay,
    onRemove: (productId) => {
      setRawMaterials((prevProduct) =>
        prevProduct.filter((p) => p.rawMaterial.item.code !== productId)
      )
    },
    onQuantityChange: (productCode, quantity) => {
      setRawMaterials((prevProduct) =>
        prevProduct.map((item) =>
          item.rawMaterial.item.code === productCode
            ? { ...item, quantity: quantity }
            : item
        )
      )
    },
  })

  const handleModalToggle = () => {
    setIsOpenModal((prev) => !prev)
  }

  const totalPrice = rawMaterials
    .reduce((acc, material) => {
      const price = material?.rawMaterial?.item.price ?? 0
      const quantity = Number(material?.quantity) || 0
      return acc + price * quantity
    }, 0)
    .toFixed(2)

  const totalCost = rawMaterials
    .reduce((acc, material) => {
      const cost = material?.rawMaterial?.item.cost ?? 0
      const quantity = Number(material?.quantity) || 0
      return acc + cost * quantity
    }, 0)
    .toFixed(2)

  const handleSubmit = (products: any[]) => {
    setRawMaterials((prevProduct) => {
      const updatedProductItems = [
        ...prevProduct,
        ...products
          .filter((product) => {
            const isExisting = prevProduct.some(
              (existingProduct) =>
                existingProduct.rawMaterial.code === product.item.code
            )
            if (isExisting) {
              showToast.error("Item is already selected!")
            }
            return !isExisting
          })
          .map((product) => ({
            rawMaterial: { ...product },
            currentStock: product.inQuantity - product.outQuantity,
            quantity: "1",
          })),
      ]
      return updatedProductItems
    })

    handleModalToggle()
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setProductData((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }))

    setInvalidFields((prev) => prev.filter((field) => field !== name))
  }

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const requiredFields: string[] = [
      "code",
      "description",
      "unit",
      "reorderPoint",
    ]

    const emptyFields = requiredFields.filter(
      (field) => !productData[field as keyof ItemType]
    )

    if (emptyFields.length > 0) {
      setInvalidFields(emptyFields)
      showToast.error("Please fill out all required fields.")
      return
    }

    if (
      productData.unit.toLowerCase() !== "kg" &&
      productData.unit.toLowerCase() !== "pcs" &&
      productData.unit.toLowerCase() !== "pack" &&
      productData.unit.toLowerCase() !== "liters"
    ) {
      setInvalidFields((prev) => [...prev, "unit"])
      showToast.error("Invalid unit type")
      return
    }

    const invalidRawMaterials = rawMaterials.map((material) => ({
      quantity: material.quantity,
    }))

    if (rawMaterials.length === 0) {
      showToast.error("Please Select Materials")
      return
    }

    // Check if any quantity is empty or 0
    const invalidQuantity = invalidRawMaterials.some(
      (material) =>
        material.quantity === "" ||
        material.quantity === null ||
        material.quantity === "0"
    )

    if (invalidQuantity) {
      showToast.error("Invalid Quantity")
      return
    }

    const { cost, price, ...rest } = productData

    const updateProductComponent = {
      finishProduct: {
        ...rest,
        price: parseFloat(totalPrice),
        cost: parseFloat(totalCost),
      },
      components: rawMaterials.map((material) => ({
        rawMaterial: {
          ...material.rawMaterial.item,
        },
        quantity: material.quantity,
      })),
    }
    createItem(updateProductComponent)
    navigate("/dashboard/products")
  }

  const data = inventoryData.filter((item) =>
    ["Raw Mats", "raw mats"].includes(item.item.category.toLowerCase())
  )

  return (
    <>
      <div className='hidden md:block'>
        <PageTitle>Create Finished Product</PageTitle>
      </div>
      <h1 className='md:hidden'>Create Finished Product</h1>

      <form className='flex flex-col' onSubmit={handleOnSubmit}>
        <div className='pt-4 px-2 border-t border-[#14aff1] flex flex-col gap-5'>
          <div className='flex flex-col md:flex-row gap-5 md:items-center '>
            <div className='flex items-center gap-2 relative'>
              <label htmlFor='productCode' className='text-sm w-[125px]'>
                Product Code:
              </label>
              <div className='flex-1'>
                <input
                  id='productCode'
                  type='text'
                  name='code'
                  value={productData.code}
                  onChange={handleChange}
                  autoComplete='off'
                  className={`${
                    invalidFields.includes("code") && "border-primary"
                  }  w-full p-2 rounded-md border outline-transparent bg-transparent text-xs
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
                />
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <label
                htmlFor='description'
                className='text-sm w-[125px] md:w-[95px] xl:w-[125px]'
              >
                Product Name:
              </label>
              <div className='flex-1'>
                <input
                  id='description'
                  type='text'
                  name='description'
                  value={productData.description}
                  onChange={handleChange}
                  autoComplete='off'
                  className={`${
                    invalidFields.includes("description") && "border-primary"
                  } w-full p-2 rounded-md border outline-transparent bg-transparent text-xs
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
                />
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <label
                htmlFor='category'
                className='text-sm w-[125px] md:w-[60px] xl:w-[125px]'
              >
                Category:
              </label>
              <div className='flex-1'>
                <input
                  id='category'
                  type='text'
                  name='category'
                  value={productData.category}
                  readOnly
                  className={`${
                    invalidFields.includes("category") && "border-primary"
                  } w-full p-2 rounded-md border outline-transparent bg-transparent text-xs
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
                />
              </div>
            </div>
            <div className='flex items-center gap-2 xl:flex-1'>
              <label htmlFor='unit' className='text-sm  w-[125px] md:w-[30px] '>
                Unit:
              </label>
              <div className='flex-1'>
                <select
                  id='unit'
                  name='unit'
                  value={productData.unit}
                  onChange={handleChange}
                  className={`${
                    invalidFields.includes("unit") && "border-red-900"
                  } w-full p-2 rounded-md border outline-transparent bg-transparent text-xs
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
                >
                  <option value='kg'>KG</option>
                  <option value='pcs'>PCS</option>
                  <option value='pack'>PACK</option>
                  <option value='liters'>LITERS</option>
                </select>
              </div>
            </div>
          </div>

          <div className='flex flex-col md:flex-row gap-5 md:items-center '>
            <div className='flex items-center gap-2 relative'>
              <label htmlFor='brand' className='text-sm w-[125px]'>
                Brand:
              </label>
              <div className='flex-1'>
                <input
                  id='brand'
                  type='text'
                  name='brand'
                  value={productData.brand}
                  onChange={handleChange}
                  placeholder='e.g. ITEM101'
                  autoComplete='off'
                  className={`${
                    invalidFields.includes("brand") && "border-primary"
                  } w-full p-2 rounded-md border outline-transparent bg-transparent text-xs
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
                />
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <label htmlFor='reorderPoint' className='text-sm w-[125px]'>
                Reorder Point:
              </label>
              <div className='flex-1'>
                <input
                  type='number'
                  step='0.01'
                  min='1'
                  id='reorderPoint'
                  autoComplete='off'
                  name='reorderPoint'
                  value={productData.reorderPoint}
                  onChange={handleChange}
                  className={`${
                    invalidFields.includes("reorderPoint") && "border-primary"
                  }  w-full p-2 rounded-md border outline-transparent bg-transparent text-xs
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
                />
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <label
                htmlFor='price'
                className='text-sm w-[125px] md:w-[60px] xl:w-[125px]'
              >
                Total Price:
              </label>
              <div className='flex-1'>
                <input
                  type='number'
                  step='0.01'
                  min='0.01'
                  id='price'
                  name='price'
                  autoComplete='off'
                  value={totalPrice}
                  readOnly
                  disabled={true}
                  className={`w-full p-2 rounded-md border outline-transparent bg-transparent text-xs
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
                />
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <label
                htmlFor='cost'
                className='text-sm w-[125px] md:w-[60px] xl:w-[125px]'
              >
                Total Cost:
              </label>
              <div className='flex-1'>
                <input
                  type='number'
                  step='0.01'
                  min='0.01'
                  id='cost'
                  name='cost'
                  autoComplete='off'
                  value={totalCost}
                  readOnly
                  disabled={true}
                  className={`w-full p-2 rounded-md border outline-transparent bg-transparent text-xs
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
                />
              </div>
            </div>
          </div>
        </div>

        <div className='mt-4'>
          <div className='flex justify-between items-center'>
            {isOpenModal && (
              <CustomModal
                classes='h-[480px] md:p-8 w-[343px] md:w-[1200px]'
                toggleModal={handleModalToggle}
              >
                {/* Material Items Table */}
                <>
                  <PageTitle>Material List</PageTitle>
                  <hr style={{ borderColor: "#14aff1" }} />
                  <Table
                    data={data || []}
                    columns={columns}
                    search={true}
                    withImport={false}
                    withExport={false}
                    withSubmit={true}
                    withCancel={true}
                    add={false}
                    view={false}
                    handleSubmit={handleSubmit}
                    toggleModal={handleModalToggle}
                  />
                </>
              </CustomModal>
            )}
          </div>

          {rawMaterials && (
            <div className='h-[410px] flex flex-col '>
              {/* Display Material Items */}
              <Table
                data={rawMaterials}
                columns={rawMaterialsColumns}
                search={true}
                withImport={false}
                withExport={false}
                withSubmit={false}
                withCancel={false}
                materials={true}
                add={false}
                view={false}
                toggleModal={handleModalToggle}
              />
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
              <p className='text-white font-bold text-xs'>Submit</p>
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

              <Link to={"/dashboard/products"}>
                <button
                  type='button'
                  className={`rounded-md border-0 outline-transparent py-2.5
           font-medium cursor-pointer text-white bg-blue-700 w-[100px]`}
                >
                  <p className='text-white font-bold text-xs'>Confirm</p>
                </button>
              </Link>
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
                  <div className='flex item-center justify-center w-5 h-5 border-2 border-t-2 border-[#0A140A] border-t-white rounded-full animate-spin'></div>
                ) : (
                  <p className='text-white font-bold text-xs'>Confirm</p>
                )}
              </button>
            </ConfirmationModal>
          )}
        </div>
      </form>
    </>
  )
}

export default ItemComponents
