import { useItemWithComponents } from "../../hooks/items/useItemWithComponent"
import { useState, useRef, useEffect } from "react"
import Table from "../common/table/Table"
import CustomModal from "../common/utils/CustomModal"
import { IoIosClose } from "react-icons/io"
import { createColumnHelper } from "@tanstack/react-table"
import { showToast } from "../../utils/Toast"
import ConfirmationModal from "../modal/ConfirmationModal"
import { RootState } from "../../store"
import { useSelector } from "react-redux"
import { FaExclamationTriangle } from "react-icons/fa"
import Spinner from "../common/utils/Spinner"

const fields = [
  { key: "item.code", label: "Product Code", classes: "uppercase" },
  { key: "item.description", label: "Product Name", classes: "capitalize" },
  { key: "item.category", label: "Category", classes: "capitalize" },
  { key: "item.brand", label: "Brand", classes: "uppercase" },
  { key: "item.unit", label: "Unit", classes: "lowercase" },
  { key: "item.reorderPoint", label: "Stock Level" },
  { key: "item.status", label: "Status", classes: "uppercase" },
]

const fieldsRawMats = [
  { key: "code", label: "Product Code", classes: "uppercase" },
  {
    key: "description",
    label: "Product Name",
    classes: "capitalize",
  },
  { key: "category", label: "Category", classes: "capitalize" },
  { key: "brand", label: "Brand", classes: "uppercase" },
  { key: "unit", label: "Unit", classes: "lowercase" },
  { key: "status", label: "Status", classes: "uppercase" },
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

        const currentStock = Math.round(inQuantity - outQuantity || 0)

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
  fieldsRawMats,
  onRemove,
  onQuantityChange,
}: {
  fieldsRawMats: { key: string; label: string; classes?: string }[]
  onRemove: (productId: string) => void
  onQuantityChange: (productId: string, quantity: string) => void
}) => {
  const columnHelper = createColumnHelper<any>()

  const quantityRefs = useRef<{ [key: string]: string }>({})

  return [
    ...fieldsRawMats.map((fields) =>
      columnHelper.accessor(`rawMaterial.${fields.key}`, {
        cell: (info) => (
          <span className={`${fields.classes}`}>{info.getValue()}</span>
        ),
        header: () => <span className='truncate'>{fields.label}</span>,
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
          quantityRefs.current[row.original.rawMaterial.code] = value
        }

        const handleBlur = () => {
          const value = quantityRefs.current[row.original.rawMaterial.code]
          console.log(value)
          if (!value) {
            onQuantityChange(
              row.original.rawMaterial.code,
              row.original.quantity
            )
          } else {
            onQuantityChange(row.original.rawMaterial.code, value)
          }
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
            className={`  w-[100px] py-1 pl-4 pr-1 border border-gray-900 border-opacity-25 focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary rounded-md outline-transparent bg-transparent `}
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

interface ViewItemWithComponentsProps {
  id: string
  close: () => void
}

const ViewItemWithComponents: React.FC<ViewItemWithComponentsProps> = ({
  id,
  close,
}) => {
  const inventoryData = useSelector(
    (state: RootState) => state.inventory.inventory
  )

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
  const [confirmSubmit, setConfirmSubmit] = useState<boolean>(false)
  const [confirmCancel, setConfirmCancel] = useState<boolean>(false)
  const [rawMaterials, setRawMaterials] = useState<any[]>([])

  const {
    data: productData,
    isLoading,
    isError,
    updateItem,
    isPending,
  } = useItemWithComponents(id)

  const validProductData =
    productData && "finishProduct" in productData ? productData : null
  const validcomponents =
    productData && "components" in productData ? productData.components : null

  useEffect(() => {
    if (validcomponents) {
      setRawMaterials(validcomponents)
    }
  }, [validcomponents])

  const finishProduct = validProductData?.finishProduct

  const columns = Columns({
    fields,
  })

  const rawMaterialsColumns = ItemColumns({
    fieldsRawMats,
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

  const totalPrice = rawMaterials
    .reduce((acc, material) => {
      const price = material?.rawMaterial?.price ?? 0
      const quantity = Number(material?.quantity) || 0
      return acc + price * quantity
    }, 0)
    .toFixed(2)

  const totalCost = rawMaterials
    .reduce((acc, material) => {
      const cost = material?.rawMaterial?.cost ?? 0
      const quantity = Number(material?.quantity) || 0
      return acc + cost * quantity
    }, 0)
    .toFixed(2)

  const handleSubmit = (products: any[]) => {
    if (products) {
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
              rawMaterial: { ...product.item },
              quantity: "1",
            })),
        ]

        return updatedProductItems
      })
    }

    handleModalToggle()
  }

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const invalidRawMaterials = rawMaterials.map((material) => ({
      quantity: material.quantity,
    }))

    if (rawMaterials.length === 0) {
      showToast.error("Please Select Materials")
      return
    }

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

    const updateProductComponent = {
      components: rawMaterials.map((material) => ({
        rawMaterial: {
          code: material.rawMaterial.code,
        },
        quantity: material.quantity,
      })),
    }

    updateItem({ id, updateProductComponent })
    close()
  }

  const data = inventoryData.filter((item) =>
    ["Raw Mats", "raw mats"].includes(item.item.category.toLowerCase())
  )

  if (isError) {
    return (
      <section className='text-center flex flex-col justify-center items-center h-96'>
        <FaExclamationTriangle className='text-red-900 text-6xl mb-4' />
        <h1 className='text-2xl font-bold mb-4'>
          Error fetching data! Please try again later.
        </h1>
        <button
          type='button'
          onClick={close}
          className='bg-red-700 rounded-md py-2.5 w-[150px] text-white font-bold text-xs text-center'
        >
          Go Back
        </button>
      </section>
    )
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div className='flex flex-col h-full'>
      <div className='flex items-center justify-end cursor-pointer'>
        <IoIosClose size={30} onClick={close} />
      </div>
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
                  value={finishProduct?.code || ""}
                  readOnly
                  autoComplete='off'
                  className={` w-full p-2 rounded-md border outline-transparent bg-transparent text-xs
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
                  value={finishProduct?.description || ""}
                  autoComplete='off'
                  readOnly
                  className={`w-full p-2 rounded-md border outline-transparent bg-transparent text-xs
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
                  value={finishProduct?.category || ""}
                  readOnly
                  className={`w-full p-2 rounded-md border outline-transparent bg-transparent text-xs
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
                />
              </div>
            </div>
            <div className='flex items-center gap-2 xl:flex-1'>
              <label htmlFor='unit' className='text-sm  w-[125px] md:w-[30px] '>
                Unit:
              </label>
              <div className='flex-1'>
                <input
                  id='unit'
                  name='unit'
                  value={finishProduct?.unit || ""}
                  readOnly
                  className={`w-full p-2 rounded-md border outline-transparent bg-transparent text-xs
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
                />
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
                  value={finishProduct?.brand || ""}
                  readOnly
                  placeholder='e.g. ITEM101'
                  autoComplete='off'
                  className={` w-full p-2 rounded-md border outline-transparent bg-transparent text-xs
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
                  value={finishProduct?.reorderPoint || ""}
                  readOnly
                  className={` w-full p-2 rounded-md border outline-transparent bg-transparent text-xs
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

        {isOpenModal && (
          <CustomModal
            classes='h-[410px] md:p-8 w-[343px] md:w-[900px]'
            toggleModal={handleModalToggle}
          >
            <div className='flex flex-col h-full'>
              <h1 className='mb-2'>Select Item Materials</h1>
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
            </div>
          </CustomModal>
        )}

        {rawMaterials && (
          <div className='h-[225px] overflow-y-auto scrollbar mt-2 '>
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

        <div className='flex items-center justify-end mt-2 gap-5'>
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
                <div className='flex item-center justify-center w-5 h-5 border-2 border-t-2 border-[#0A140A] border-t-white rounded-full animate-spin'></div>
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

export default ViewItemWithComponents
