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

const fields = [
  { key: "code", label: "Product Code", classes: "uppercase" },
  { key: "description", label: "Product Name", classes: "capitalize" },
  { key: "category", label: "Category", classes: "capitalize" },
  { key: "brand", label: "Brand", classes: "uppercase" },
  { key: "unit", label: "Unit", classes: "lowercase" },
  { key: "reorderPoint", label: "Stock Level" },
  { key: "price", label: "Price" },
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
      header: () => <span className='truncate'>Quantity</span>,
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
  const [rawMaterials, setRawMaterials] = useState<ComponentsMaterials[]>([])
  const [invalidFields, setInvalidFields] = useState<string[]>([])
  const [productData, setProductData] = useState<ItemType>({
    code: "",
    description: "",
    category: "Finished Goods",
    brand: "N/A",
    unit: "",
    reorderPoint: 0,
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
      const updatedRawMaterials = [
        ...prevProduct,
        ...products.map((product) => ({
          rawMaterial: { ...product },
          quantity: "1",
        })),
      ]
      return updatedRawMaterials
    })

    handleModalToggle()
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      productData.unit.toLowerCase() !== "pcs"
    ) {
      setInvalidFields((prev) => [...prev, "unit"])
      showToast.error("Invalid unit type")
      return
    }

    const updateProductComponent = {
      finishProduct: {
        ...productData,
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
    <div className='flex flex-col max-w-full mx-auto h-dynamic-sm lg:h-dynamic-lg px-4 lg:px-8 py-4'>
      <PageTitle>Create Finished Product with Components</PageTitle>

      <form className='flex flex-col' onSubmit={handleOnSubmit}>
        <div className='overflow-x-auto bg-white shadow-md rounded-lg scrollbar'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50 sticky top-0'>
              <tr>
                <th className='px-6 py-3 text-center text-xs font-medium text-black uppercase tracking-wider  bg-gray-50'>
                  Code
                </th>

                <th className='px-6 py-3 text-center text-xs font-medium text-black uppercase tracking-wider  bg-gray-50'>
                  Product Name
                </th>

                <th className='px-6 py-3 text-center text-xs font-medium text-black uppercase tracking-wider  bg-gray-50'>
                  Category
                </th>

                <th className='px-6 py-3 text-center text-xs font-medium text-black uppercase tracking-wider  bg-gray-50'>
                  Brand
                </th>

                <th className='px-6 py-3 text-center text-xs font-medium text-black uppercase tracking-wider  bg-gray-50'>
                  Unit
                </th>

                <th className='px-6 py-3 text-center text-xs font-medium text-black uppercase tracking-wider  bg-gray-50'>
                  Reordering Point
                </th>

                <th className='px-6 py-3 text-center text-xs font-medium text-black uppercase tracking-wider  bg-gray-50'>
                  Selling Price
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              <tr>
                <td className='hover:bg-gray-50 p-2 whitespace-nowrap text-sm text-gray-900 cursor-pointer text-center'>
                  <input
                    id='productCode'
                    type='text'
                    name='code'
                    value={productData.code}
                    onChange={handleChange}
                    placeholder='e.g. ITEM101'
                    autoComplete='off'
                    className={`${
                      invalidFields.includes("code") && "border-primary"
                    } w-full text-center py-2 px-4 border uppercase border-gray-900 outline-transparent bg-transparent placeholder:text-sm
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
                  />
                </td>
                <td className='hover:bg-gray-50 py-2 whitespace-nowrap text-sm text-gray-900 cursor-pointer text-center'>
                  <input
                    id='description'
                    type='text'
                    name='description'
                    value={productData.description}
                    onChange={handleChange}
                    placeholder='e.g. Ube Halaya'
                    autoComplete='off'
                    className={`${
                      invalidFields.includes("description") && "border-primary"
                    } w-full text-center py-2 px-4 border uppercase border-gray-900 outline-transparent bg-transparent placeholder:text-sm
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
                  />
                </td>
                <td className='hover:bg-gray-50 p-2 whitespace-nowrap text-sm text-gray-900 cursor-pointer text-center'>
                  <input
                    id='category'
                    type='text'
                    name='category'
                    value={productData.category}
                    readOnly
                    className={`${
                      invalidFields.includes("category") && "border-primary"
                    } w-full text-center py-2 px-4 border uppercase border-gray-900 outline-transparent bg-transparent placeholder:text-sm
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
                  />
                </td>
                <td className='hover:bg-gray-50 p-2 whitespace-nowrap text-sm text-gray-900 cursor-pointer text-center'>
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
                    } w-full text-center py-2 px-4 border uppercase border-gray-900 outline-transparent bg-transparent placeholder:text-sm
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
                  />
                </td>
                <td className='hover:bg-gray-50 p-2 whitespace-nowrap text-sm text-gray-900 cursor-pointer text-center'>
                  <input
                    id='unit'
                    type='text'
                    name='unit'
                    value={productData.unit}
                    onChange={handleChange}
                    placeholder='e.g kg | pcs'
                    autoComplete='off'
                    className={`${
                      invalidFields.includes("unit") && "border-primary"
                    } w-full text-center py-2 px-4 border uppercase border-gray-900 outline-transparent bg-transparent placeholder:text-sm
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
                  />
                </td>
                <td className='hover:bg-gray-50 p-2 whitespace-nowrap text-sm text-gray-900 cursor-pointer text-center'>
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
                    } w-full text-center py-2 px-4 border  border-gray-900 outline-transparent bg-transparent placeholder:text-sm
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
                  />
                </td>
                <td className='hover:bg-gray-50 p-2 whitespace-nowrap text-sm text-gray-900 cursor-pointer text-center'>
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
                    } w-full text-center py-2 px-4 border  border-gray-900 outline-transparent bg-transparent placeholder:text-sm
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
                  />
                </td>
              </tr>
            </tbody>
          </table>
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
            <Link
              to={"/dashboard/products"}
              className='bg-red-700 rounded-md py-2.5 w-[150px] text-white font-bold text-xs text-center'
            >
              Cancel
            </Link>

            <button
              type='submit'
              className='bg-blue-700 rounded-md py-2.5 w-[150px]'
            >
              {isPending ? (
                <div className='w-5 h-5 border-2 border-t-2 border-[#0A140A] border-t-white rounded-full animate-spin'></div>
              ) : (
                <p className='text-white font-bold text-xs'>Submit</p>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ItemComponents
