import { SalesOrderCreateType, SalesOrderType } from "../../type/salesType"
import Table from "../common/table/Table"
import { createColumnHelper } from "@tanstack/react-table"
import { useRef, useState, useEffect } from "react"
import { DetailsType, CustomerType } from "../../type/salesType"
import { IoIosClose } from "react-icons/io"
import { TbZoomScan } from "react-icons/tb"
import CustomModal from "../common/utils/CustomModal"
import SalesOrderCustomer from "./SalesOrderCustomer"
import { showToast } from "../../utils/Toast"
import useUpdateSalesOrder from "../../hooks/sales/useUpdateSalesOrder"

const itemFields = [
  { key: "item.code", label: "Product Code", classes: "uppercase" },
  { key: "item.description", label: "Product Name", classes: "capitalize" },
  { key: "item.category", label: "Category", classes: "capitalize" },
  { key: "item.brand", label: "Brand", classes: "uppercase" },
  { key: "item.unit", label: "Unit", classes: "lowercase" },
]

const Columns = ({
  itemFields,
  onRemove,
  onQuantityChange,
  onPriceChange,
}: {
  itemFields: { key: string; label: string; classes?: string }[]
  onRemove: (productId: string) => void
  onQuantityChange: (productId: string, quantity: string) => void
  onPriceChange: (productId: string, price: string) => void
}) => {
  const columnHelper = createColumnHelper<any>()
  const quantityRefs = useRef<{ [key: string]: string }>({})
  const priceRefs = useRef<{ [key: string]: string }>({})
  return [
    ...itemFields.map((field) =>
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
        const handleQuantityChange = (
          e: React.ChangeEvent<HTMLInputElement>
        ) => {
          const value = e.target.value
          priceRefs.current[productCode] = value
        }

        const handleBlur = () => {
          const value =
            priceRefs.current[productCode] || row.original.orderQuantity
          onQuantityChange(productCode, value)
        }

        return (
          <input
            type='number'
            id='qty'
            autoComplete='off'
            min={1}
            name='qty'
            defaultValue={row.original.orderQuantity}
            onChange={handleQuantityChange}
            onBlur={handleBlur}
            className='w-[100px] py-1 pl-4 pr-1 border border-gray-900 border-opacity-25 rounded-md outline-transparent bg-transparent focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary'
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

interface UpdateSalesOrderProps {
  row: SalesOrderType | null
  close: () => void
}

const UpdateSalesOrder: React.FC<UpdateSalesOrderProps> = ({ row, close }) => {
  const [productItems, setProductItems] = useState<DetailsType[]>([])
  const [openCustomerModal, setOpenCustomerModal] = useState<boolean>()
  const [customerDetails, setCustomerDetails] = useState<CustomerType>({
    id: row?.customer.id || "",
    name: row?.customer.name || "",
    address: row?.customer.address || "",
    contactPerson: row?.customer.contactPerson || "",
    contactNumber: row?.customer.contactNumber || "",
    status: row?.customer.status || "",
  })
  const { updateSalesOrder, isUpdatePending } = useUpdateSalesOrder()

  const [orderDate, setOrderDate] = useState(row?.orderDate)
  const [remarks, setRemarks] = useState(row?.remarks || "")
  const [status, setStatus] = useState(row?.status)

  useEffect(() => {
    if (Array.isArray(row?.details)) {
      setProductItems(row.details)
    } else {
      setProductItems([])
    }
  }, [row])

  const columns = Columns({
    itemFields,
    onRemove: (productCode: string) => {
      setProductItems((prevProduct) =>
        prevProduct.filter((p) => p.item.code !== productCode)
      )
    },

    onQuantityChange: (productCode, quantity) => {
      const parsedQuantity = parseFloat(quantity)

      setProductItems((prevProduct) =>
        prevProduct.map((product) =>
          product.item.code === productCode
            ? { ...product, orderQuantity: parsedQuantity }
            : product
        )
      )
    },

    onPriceChange: (productCode, price) => {
      const parsedPrice = parseFloat(price)

      setProductItems((prevProduct) =>
        prevProduct.map((product) =>
          product.item.code === productCode
            ? { ...product, itemPrice: parsedPrice }
            : product
        )
      )
    },
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    if (name === "remarks") {
      setRemarks(value)
    } else if (name === "orderDate") {
      setOrderDate(value)
    } else if (name === "status") {
      setStatus(value)
    }
  }

  const handleCustomerToggle = () => {
    setOpenCustomerModal((prev) => !prev)
  }

  const handleSubmitCustomer = (customerDetails: CustomerType[]) => {
    if (customerDetails.length === 1) {
      setCustomerDetails(customerDetails[0])
    } else {
      showToast.error("Multiple customer not allowed")
    }

    handleCustomerToggle()
  }

  const [invalidFields, setInvalidFields] = useState<string[]>([])
  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const requiredFields: string[] = ["orderDate", "remarks", "status"]

    // 2. Check for any empty required fields
    const emptyFields = requiredFields.filter((field) => {
      if (field === "orderDate") {
        return !orderDate
      }
      if (field === "remarks") {
        return !remarks?.trim()
      }
      return false
    })

    if (emptyFields.length > 0) {
      setInvalidFields(emptyFields)

      showToast.error("Please fill out all required fields.")

      return
    }

    const datePattern = /^\d{4}-\d{2}-\d{2}$/

    if (!orderDate || !datePattern.test(orderDate)) {
      setInvalidFields((prev) => [...prev, "orderDate"])
      showToast.error("Invalid date format. Please use yyyy-mm-dd.")
      return
    }

    const updatedOrder: SalesOrderCreateType = {
      salesorderNo: row?.salesorderNo || "",
      orderDate: orderDate,
      remarks: remarks,
      customer: {
        id: customerDetails.id.toString(),
      },
      status: status || "",
      details: productItems.map((item) => ({
        id: item.id.toString(),
        item: {
          code: item.item.code,
        },
        orderQuantity: item.orderQuantity.toString(),
        itemPrice: item.itemPrice.toString(),
      })),
    }

    if (row?.status === "COMPLETED" || row?.status === "completed") {
      showToast.error("Sales status is already completed!")
    } else {
      updateSalesOrder(updatedOrder)
      close()
    }
  }

  return (
    <div className='max-w-full mx-auto'>
      <div className='flex justify-between items-center'>
        <h1 className='mb-2 font-bold'>Order Number: {row?.salesorderNo}</h1>
        <p className='text-xs'>
          Created Date:{" "}
          {row?.createdDateTime
            ? new Date(row.createdDateTime).toLocaleDateString("en-US")
            : "N/A"}
        </p>
      </div>
      <form onSubmit={handleOnSubmit}>
        <div className='pt-4 px-2 border-t border-[#14aff1] flex flex-col gap-5'>
          <div className='flex flex-col md:flex-row gap-5 md:items-center md:justify-between'>
            <div className='flex items-center gap-2 md:w-[300px] relative'>
              <label htmlFor='customer' className='text-sm'>
                Customer:
              </label>
              <input
                id='customer'
                type='text'
                name='customer'
                value={customerDetails.name}
                readOnly
                autoComplete='off'
                className={`${
                  invalidFields.includes("customerDetails") && "border-red-900"
                } w-full p-2 rounded-md border outline-transparent bg-transparent text-xs
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
              />
              <TbZoomScan
                size={20}
                className='absolute top-2 right-2 text-gray-500 cursor-pointer'
                onClick={handleCustomerToggle}
              />
            </div>
            <div className='flex items-center gap-2 '>
              <label htmlFor='contactPerson' className='text-sm w-[125px]'>
                Contact Person:
              </label>
              <div className='flex-1'>
                <input
                  id='contactPerson'
                  type='text'
                  name='contactPerson'
                  value={customerDetails.contactPerson}
                  readOnly
                  autoComplete='off'
                  className={`w-full p-2 rounded-md border outline-transparent bg-transparent text-xs
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
                />
              </div>
            </div>
            <div className='flex items-center gap-2 '>
              <label htmlFor='contactNumber' className='text-sm w-[125px]'>
                Contact Number:
              </label>
              <div className='flex-1'>
                <input
                  id='contactNumber'
                  type='text'
                  name='contactNumber'
                  value={customerDetails.contactNumber}
                  readOnly
                  autoComplete='off'
                  className={`w-full p-2 rounded-md border outline-transparent bg-transparent text-xs
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
                />
              </div>
            </div>
          </div>
          <div className='flex items-center gap-2 '>
            <label htmlFor='contactAddress' className='text-sm w-[125px]'>
              Customer Address:
            </label>
            <div className='flex-1'>
              <input
                id='contactAddress'
                type='text'
                name='contactAddress'
                value={customerDetails.address}
                readOnly
                autoComplete='off'
                className={`w-full p-2 rounded-md border outline-transparent bg-transparent text-xs
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
              />
            </div>
          </div>
          <div className='flex flex-col md:flex-row gap-5 md:items-center md:justify-between'>
            <div className='flex items-center gap-2 '>
              <label
                htmlFor='orderDate'
                className='text-sm w-[125px] md:w-[80px]'
              >
                Order Date:
              </label>
              <div className='flex-1'>
                <input
                  id='orderDate'
                  type='date'
                  name='orderDate'
                  value={orderDate}
                  onChange={handleChange}
                  autoComplete='off'
                  className={`${
                    invalidFields.includes("orderDate") && "border-red-900"
                  } w-full p-2 rounded-md border outline-transparent bg-transparent text-xs
                      focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
                />
              </div>
            </div>

            <div className='flex items-center gap-2 flex-1 '>
              <label
                htmlFor='remarks'
                className='text-sm w-[125px] md:w-[80px]'
              >
                Remarks:
              </label>
              <div className='flex-1'>
                <input
                  id='remarks'
                  type='text'
                  name='remarks'
                  onChange={handleChange}
                  value={remarks}
                  className={`${
                    invalidFields.includes("orderDate") && "border-red-900"
                  } w-full p-2 rounded-md border outline-transparent bg-transparent text-xs
                      focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
                />
              </div>
            </div>

            <div className='flex items-center gap-2 '>
              <label htmlFor='status' className='text-sm w-[125px] md:w-[80px]'>
                Status:
              </label>
              <div className='flex-1'>
                <select
                  id='status'
                  name='status'
                  value={status}
                  onChange={handleChange}
                  disabled={
                    row?.status === "COMPLETED" || row?.status === "completed"
                      ? true
                      : false
                  }
                  className={`${
                    invalidFields.includes("status") && "border-red-900"
                  }  w-full p-2 rounded-md border cursor-pointer outline-transparent bg-transparent text-xs
        focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
                >
                  <option value='DRAFT'>DRAFT</option>
                  <option value='COMPLETED'>COMPLETED</option>
                  <option value='CANCEL'>CANCEL</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <Table
          data={productItems}
          columns={columns}
          search={true}
          withImport={false}
          withExport={false}
          withSubmit={false}
          withCancel={false}
          add={false}
          view={false}
        />

        {openCustomerModal && (
          <CustomModal
            classes='h-[420px] md:p-8 w-[343px] md:w-[680px]'
            toggleModal={handleCustomerToggle}
          >
            <SalesOrderCustomer
              onSubmit={handleSubmitCustomer}
              toggleModal={handleCustomerToggle}
            />
          </CustomModal>
        )}

        <div className='flex items-center justify-end mt-4 gap-5'>
          <button
            type='button'
            onClick={close}
            className='bg-red-700 rounded-md py-2.5 w-[150px] text-white font-bold text-xs text-center'
          >
            Cancel
          </button>

          <button
            type='submit'
            className='bg-blue-700 rounded-md py-2.5 w-[150px]'
          >
            {isUpdatePending ? (
              <div className='w-5 h-5 border-2 border-t-2 border-[#0A140A] border-t-white rounded-full animate-spin'></div>
            ) : (
              <p className='text-white font-bold text-xs'>Update</p>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default UpdateSalesOrder
