import { useState } from "react"
import CustomModal from "./utils/CustomModal"
import { useQuery } from "@tanstack/react-query"
import { InventoryPerCategory } from "../../type/StockType"
import { getInventoryByCategory } from "../../api/services/inventory"
import { FaExclamationTriangle } from "react-icons/fa"
import Spinner from "./utils/Spinner"
import { ItemType } from "../../type/itemType"
import SalesOrderCustomer from "../modal/SalesOrderCustomer"
import { TbZoomScan } from "react-icons/tb"
import useCustomerHook from "../../hooks/customer/useCustomerHook"
import { CustomerType } from "../../type/salesType"
import { showToast } from "../../utils/Toast"
import ItemSalesOrder from "./ItemSalesOrder"
import DisplaySalesOrderItems from "./DisplaySalesOrderItems"

export interface DetailsProduct {
  item: ItemType
  orderQuantity: string
  itemPrice: string
}

interface SalesOrderProps {
  close: () => void
}

const SalesOrderComponent: React.FC<SalesOrderProps> = ({ close }) => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>()
  const [openCustomerModal, setOpenCustomerModal] = useState<boolean>()
  const [productItems, setProductItems] = useState<DetailsProduct[]>([])
  const [customerDetails, setCustomerDetails] = useState<CustomerType>({
    id: "",
    name: "",
    address: "",
    contactPerson: "",
    contactNumber: "",
    status: "",
  })
  const [description, setDescription] = useState<string>("")
  const [orderDate, setOrderDate] = useState<string>("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === "remarks") {
      setDescription(value)
    } else if (name === "orderDate") {
      setOrderDate(value)
    }
  }

  const {
    data: inventoryData = [],
    isLoading,
    isError,
  } = useQuery<InventoryPerCategory[]>({
    queryKey: ["Stock", "Raw Mats", "Finished Goods"],
    queryFn: () => getInventoryByCategory("Finished Goods"),
  })

  const { data: customerData = [], isLoading: customerLoading } =
    useCustomerHook()

  const handleToggleModal = () => {
    setIsOpenModal((prev) => !prev)
  }

  const handleCustomerToggle = () => {
    setOpenCustomerModal((prev) => !prev)
  }

  const handleSubmit = (invetoryProductPerItem: InventoryPerCategory[]) => {
    setProductItems((prevProduct) => {
      const updatedProductItems = [
        ...prevProduct,
        ...invetoryProductPerItem
          .filter((product) => {
            const isExisting = prevProduct.some(
              (existingProduct) =>
                existingProduct.item.code === product.item.code
            )
            return !isExisting
          })
          .map((product) => ({
            item: { ...product.item },
            orderQuantity: "1",
            itemPrice: "1",
          })),
      ]
      return updatedProductItems
    })

    handleToggleModal()
  }

  const handleSubmitCustomer = (customerDetails: CustomerType[]) => {
    if (customerDetails.length === 1) {
      setCustomerDetails(customerDetails[0])
    } else {
      showToast.error("Multiple customer not allowed")
    }

    handleCustomerToggle()
  }

  if (isError) {
    return (
      <section className='text-center flex flex-col justify-center items-center h-96'>
        <FaExclamationTriangle className='text-red-900 text-6xl mb-4' />
        <h1 className='text-6xl font-bold mb-4'>Something went wrong</h1>
        <p className='text-xl mb-5 text-primary'>
          Please contact your administrator
        </p>
      </section>
    )
  }

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const salesOrder = {
      orderDate: orderDate,
      remarks: description,
      customer: {
        id: customerDetails.id,
      },
      details: productItems.map((item) => ({
        item: item.item,
        orderQuantity: item.orderQuantity,
        itemPrice: item.itemPrice,
      })),
    }

    console.log(salesOrder)
  }

  return (
    <div className='max-w-full mx-auto'>
      <h1 className='mb-2'>Create Sales Order</h1>
      <form onSubmit={handleOnSubmit}>
        <div className='pt-4 px-2 border-t border-[#14aff1] flex flex-col gap-5'>
          <div className='flex gap-5 items-center justify-between'>
            <div className='flex items-center gap-2 w-[300px] relative'>
              <label htmlFor='customer' className='text-sm'>
                Customer:
              </label>
              <input
                id='customer'
                type='text'
                name='customer'
                value={customerDetails.address}
                readOnly
                autoComplete='off'
                className={`w-full p-2 rounded-md border outline-transparent bg-transparent text-xs
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
              />
              <TbZoomScan
                size={20}
                className='absolute top-2 right-2 text-gray-500 cursor-pointer'
                onClick={handleCustomerToggle}
              />
            </div>
            <div className='flex items-center gap-2 '>
              <label htmlFor='contactPerson' className='text-sm '>
                Contact Person:
              </label>
              <input
                id='contactPerson'
                type='text'
                name='contactPerson'
                value={customerDetails.contactPerson}
                readOnly
                autoComplete='off'
                className={`p-2 rounded-md border outline-transparent bg-transparent text-xs
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
              />
            </div>
            <div className='flex items-center gap-2 '>
              <label htmlFor='contactNumber' className='text-sm'>
                Contact Number:
              </label>
              <input
                id='contactNumber'
                type='text'
                name='contactNumber'
                value={customerDetails.contactNumber}
                readOnly
                autoComplete='off'
                className={`p-2 rounded-md border outline-transparent bg-transparent text-xs
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
              />
            </div>
          </div>
          <div className='flex items-center gap-2 '>
            <label htmlFor='contactAddress' className='text-sm '>
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
                className={` w-full p-2 rounded-md border outline-transparent bg-transparent text-xs
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
              />
            </div>
          </div>
          <div className='flex gap-5 items-center justify-between'>
            <div className='flex items-center gap-2 '>
              <label htmlFor='orderDate' className='text-sm '>
                Order Date:
              </label>
              <div className='flex-1'>
                <input
                  id='orderDate'
                  type='text'
                  name='orderDate'
                  value={orderDate}
                  onChange={handleChange}
                  autoComplete='off'
                  className={` w-full p-2 rounded-md border outline-transparent bg-transparent text-xs
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
                />
              </div>
            </div>
            <div className='flex items-center gap-2 flex-1 '>
              <label htmlFor='remarks' className='text-sm '>
                Description:
              </label>
              <div className='flex-1'>
                <input
                  id='remarks'
                  type='text'
                  name='remarks'
                  value={description}
                  onChange={handleChange}
                  autoComplete='off'
                  className={` w-full p-2 rounded-md border outline-transparent bg-transparent text-xs
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
                />
              </div>
            </div>
          </div>

          <div>
            <div className='flex justify-between items-center'>
              {isOpenModal && (
                <CustomModal
                  classes='h-[420px] md:p-8 w-[343px] md:w-[860px]'
                  toggleModal={handleToggleModal}
                >
                  {isLoading ? (
                    <Spinner />
                  ) : (
                    <>
                      <ItemSalesOrder
                        inventoryData={inventoryData}
                        onSubmit={handleSubmit}
                        toggleModal={handleToggleModal}
                      />
                    </>
                  )}
                </CustomModal>
              )}
            </div>
            {productItems && (
              <DisplaySalesOrderItems
                productItems={productItems}
                toggleModal={handleToggleModal}
                setProductItems={setProductItems}
              />
            )}

            {openCustomerModal && (
              <CustomModal
                classes='h-[420px] md:p-8 w-[343px] md:w-[680px]'
                toggleModal={handleCustomerToggle}
              >
                {customerLoading ? (
                  <Spinner />
                ) : (
                  <>
                    <SalesOrderCustomer
                      customerData={customerData}
                      onSubmit={handleSubmitCustomer}
                      toggleModal={handleCustomerToggle}
                    />
                  </>
                )}
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
                {/* {isPending ? (
                  <div className='w-5 h-5 border-2 border-t-2 border-[#0A140A] border-t-white rounded-full animate-spin'></div>
                ) : (
                  <p className='text-white font-bold text-xs'>Submit</p>
                )} */}
                <p className='text-white font-bold text-xs'>Submit</p>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default SalesOrderComponent
