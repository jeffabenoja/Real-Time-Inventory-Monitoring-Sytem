import PageTitle from "./utils/PageTitle"
import { useItemMaterials } from "../../hooks/items/useItemMaterials"
import { ItemType, ComponentsMaterials } from "../../type/itemType"
import { useState, useRef } from "react"
import Table from "./table/Table"
import CustomModal from "./utils/CustomModal"
import { IoIosClose } from "react-icons/io"
import { createColumnHelper } from "@tanstack/react-table"
import { Link, useNavigate } from "react-router-dom"
import { showToast } from "../../utils/Toast"
import { useItemComponents } from "../../hooks/items/useItemComponents"
import ConfirmationModal from "../modal/ConfirmationModal"

const fields = [
  { key: "code", label: "Product Code", classes: "uppercase" },
  { key: "description", label: "Product Name", classes: "capitalize" },
  { key: "category", label: "Category", classes: "capitalize" },
  { key: "brand", label: "Brand", classes: "uppercase" },
  { key: "unit", label: "Unit", classes: "lowercase" },
  { key: "reorderPoint", label: "Stock Level" },
  { key: "cost", label: "Cost" },
  { key: "status", label: "Status", classes: "lowercase" },
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
  ]
}
const ItemColumns = ({
  fields,
  onRemove,
  onQuantityChange,
}: {
  fields: { key: string; label: string; classes?: string }[]
  onRemove: (productId: string) => void
  onQuantityChange: (productId: string, quantity: string) => void
}) => {
  const columnHelper = createColumnHelper<any>()

  // Track quantity as a ref to avoid re-rendering on each keystroke
  const quantityRefs = useRef<{ [key: string]: string }>({})

  return [
    ...fields.map((field) =>
      columnHelper.accessor(`rawMaterial.${field.key}`, {
        cell: (info) => (
          <span className={`${field.classes}`}>{info.getValue()}</span>
        ),
        header: () => <span className='truncate'>{field.label}</span>,
      })
    ),
    columnHelper.accessor("quantity", {
      id: "qty",
      header: () => <span className='truncate'>Used Quantity</span>,
      cell: ({ row }) => {
        const handleQuantityChange = (
          e: React.ChangeEvent<HTMLInputElement>
        ) => {
          const value = e.target.value
          quantityRefs.current[row.original.rawMaterial.code] = value // Store the value in ref
        }

        const handleBlur = () => {
          const value =
            quantityRefs.current[row.original.rawMaterial.code] || ""
          onQuantityChange(row.original.rawMaterial.code, value)
        }

        return (
          <input
            type='text'
            id='qty'
            autoComplete='off'
            name='qty'
            defaultValue={row.original.quantity}
            onChange={handleQuantityChange}
            onBlur={handleBlur}
            className={`w-[100px] py-1 pl-4 pr-1 border border-gray-900 border-opacity-25 rounded-md outline-transparent bg-transparent focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
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
            onClick={() => onRemove(row.original.rawMaterial.code)}
          >
            <IoIosClose size={20} />
          </button>
        </div>
      ),
    }),
  ]
}

const ItemComponents = () => {
  const { data } = useItemMaterials()
  const { createItem, isPending } = useItemComponents()
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
  const [confirmSubmit, setConfirmSubmit] = useState<boolean>(false)
  const [confirmCancel, setConfirmCancel] = useState<boolean>(false)
  const [rawMaterials, setRawMaterials] = useState<ComponentsMaterials[]>([])
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
    fields,
    onRemove: (productId) => {
      setRawMaterials((prevProduct) =>
        prevProduct.filter((p) => p.rawMaterial.code !== productId)
      )
    },
    onQuantityChange: (productCode, quantity) => {
      setRawMaterials((prevProduct) =>
        prevProduct.map((item) =>
          item.rawMaterial.code === productCode
            ? { ...item, quantity: quantity }
            : item
        )
      )
    },
  })

  const handleModalToggle = () => {
    setIsOpenModal((prev) => !prev)
  }

  const handleSubmit = (products: ItemType[]) => {
    setRawMaterials((prevProduct) => {
      const updatedProductItems = [
        ...prevProduct,
        ...products
          .filter((product) => {
            const isExisting = prevProduct.some(
              (existingProduct) =>
                existingProduct.rawMaterial.code === product.code
            )
            return !isExisting
          })
          .map((product) => ({
            rawMaterial: { ...product },
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
      "price",
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

    if (productData.price === 0) {
      showToast.error("Price cannot be 0")
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

    const totalCost = rawMaterials.reduce((acc, material) => {
      const cost = material?.rawMaterial?.cost ?? 0
      const quantity = Number(material?.quantity) || 0
      return acc + cost * quantity
    }, 0)

    const { cost, ...rest } = productData

    const updateProductComponent = {
      finishProduct: {
        ...rest,
        cost: totalCost,
      },
      components: rawMaterials.map((material) => ({
        rawMaterial: {
          ...material.rawMaterial,
        },
        quantity: material.quantity,
      })),
    }
    createItem(updateProductComponent)
    navigate("/dashboard/products")
  }

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
                Price:
              </label>
              <div className='flex-1'>
                <input
                  type='number'
                  step='0.01'
                  min='0.01'
                  id='price'
                  name='price'
                  autoComplete='off'
                  value={productData.price}
                  onChange={handleChange}
                  className={`${
                    invalidFields.includes("price") && "border-primary"
                  } w-full p-2 rounded-md border outline-transparent bg-transparent text-xs
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
            <div className='h-[410px] overflow-y-auto scrollbar '>
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
                type='submit'
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
        </div>
      </form>
    </>
  )
}

export default ItemComponents
