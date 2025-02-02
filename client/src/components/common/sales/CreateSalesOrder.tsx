import PageTitle from "../utils/PageTitle"
import { useState } from "react"

const CreateSalesOrder = () => {
  const [invalidFields, setInvalidFields] = useState<string[]>([])
  const [orderDate, setOrderDate] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrderDate(e.target.value)
    setInvalidFields([])
  }

  return (
    <div className='flex flex-col max-w-full mx-auto h-dynamic-sm lg:h-dynamic-lg px-4 lg:px-8 py-4'>
      <PageTitle>Create Customer Order</PageTitle>

      <div className='h-full p-2'>
        <form className='flex flex-col gap-2 w-full h-full'>
          <div className='flex flex-col gap-1 lg:w-[650px] '>
            <div className='flex items-center justify-between gap-2'>
              <label
                htmlFor='orderDate'
                className="p-2 whitespace-nowrap text-sm text-gray-900 flex-1 lg:text-end before:content-['*'] before:mr-1 before:text-red-900"
              >
                Order Date:
              </label>
              <input
                id='orderDate'
                type='text'
                name='orderDate'
                value={orderDate}
                onChange={handleInputChange}
                autoComplete='off'
                className={`${
                  invalidFields.includes("orderDate") && "border-red-500"
                } w-[50%] sm:w-[68%] lg:w-[80%] py-1 px-2 rounded-md border border-gray-900 outline-transparent bg-transparent placeholder:text-sm focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
              />
            </div>
            <div className='flex items-center justify-between gap-2'>
              <label
                htmlFor='customerName'
                className="p-2 whitespace-nowrap text-sm text-gray-900 flex-1 lg:text-end before:content-['*'] before:mr-1 before:text-red-900"
              >
                Customer Name:
              </label>
              <input
                id='customerName'
                type='text'
                name='customerName'
                value={orderDate}
                onChange={handleInputChange}
                autoComplete='off'
                className={`${
                  invalidFields.includes("orderDate") && "border-red-500"
                } w-[50%] sm:w-[68%] lg:w-[80%] py-1 px-2 rounded-md border  border-gray-900 outline-transparent bg-transparent placeholder:text-sm focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
              />
            </div>
            <div className='flex items-center justify-between gap-2'>
              <label
                htmlFor='salesOrder'
                className="p-2 whitespace-nowrap text-sm text-gray-900 flex-1 lg:text-end before:content-['*'] before:mr-1 before:text-red-900"
              >
                Sales Order:
              </label>
              <input
                id='salesOrder'
                type='text'
                name='salesOrder'
                value={orderDate}
                onChange={handleInputChange}
                autoComplete='off'
                className={`${
                  invalidFields.includes("orderDate") && "border-red-500"
                } w-[50%] sm:w-[68%] lg:w-[80%] py-1 px-2 rounded-md border  border-gray-900 outline-transparent bg-transparent placeholder:text-sm focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
              />
            </div>
            <div className='flex items-center justify-between gap-2'>
              <label
                htmlFor='purchaseOrder'
                className="p-2 whitespace-nowrap text-sm text-gray-900 flex-1 lg:text-end before:content-['*'] before:mr-1 before:text-red-900"
              >
                Purchase Order:
              </label>
              <input
                id='purchaseOrder'
                type='text'
                name='purchaseOrder'
                value={orderDate}
                onChange={handleInputChange}
                autoComplete='off'
                className={`${
                  invalidFields.includes("orderDate") && "border-red-500"
                } w-[50%] sm:w-[68%] lg:w-[80%] py-1 px-2 rounded-md border border-gray-900 outline-transparent bg-transparent placeholder:text-sm focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
              />
            </div>
          </div>

          <div className='flex flex-col lg:flex-row gap-2 lg:gap-44 xl:gap-72'>
            <div className='flex flex-col gap-1 lg:w-[420px] '>
              <h1 className='font-bold'>Bill To:</h1>

              <div className='flex items-center justify-between gap-2'>
                <label
                  htmlFor='customerName'
                  className="p-2 whitespace-nowrap text-sm text-gray-900 flex-1 lg:text-end before:content-['*'] before:mr-1 before:text-red-900"
                >
                  Customer Name:
                </label>
                <input
                  id='customerName'
                  type='text'
                  name='customerName'
                  value={orderDate}
                  onChange={handleInputChange}
                  autoComplete='off'
                  className={`${
                    invalidFields.includes("orderDate") && "border-red-500"
                  }  w-[50%] sm:w-[68%] py-1 px-2 rounded-md border  border-gray-900 outline-transparent bg-transparent placeholder:text-sm focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
                />
              </div>
              <div className='flex items-center justify-between gap-2'>
                <label
                  htmlFor='address1'
                  className="p-2 whitespace-nowrap text-sm text-gray-900 flex-1 lg:text-end before:content-['*'] before:mr-1 before:text-red-900"
                >
                  Address 1:
                </label>
                <input
                  id='address1'
                  type='text'
                  name='address1'
                  value={orderDate}
                  onChange={handleInputChange}
                  autoComplete='off'
                  className={`${
                    invalidFields.includes("address1") && "border-red-500"
                  }  w-[50%] sm:w-[68%] py-1 px-2 rounded-md border  border-gray-900 outline-transparent bg-transparent placeholder:text-sm focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
                />
              </div>
              <div className='flex items-center justify-between gap-2'>
                <label
                  htmlFor='address2'
                  className="p-2 whitespace-nowrap text-sm text-gray-900 flex-1 lg:text-end before:content-['*'] before:mr-1 before:text-red-900"
                >
                  Address 2:
                </label>
                <input
                  id='address2'
                  type='text'
                  name='address2'
                  value={orderDate}
                  onChange={handleInputChange}
                  autoComplete='off'
                  className={`${
                    invalidFields.includes("address2") && "border-red-500"
                  }  w-[50%] sm:w-[68%] py-1 px-2 rounded-md border border-gray-900 outline-transparent bg-transparent placeholder:text-sm focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
                />
              </div>
              <div className='flex items-center justify-between gap-2'>
                <label
                  htmlFor='city'
                  className="p-2 whitespace-nowrap text-sm text-gray-900 flex-1 lg:text-end before:content-['*'] before:mr-1 before:text-red-900"
                >
                  City:
                </label>
                <input
                  id='city'
                  type='text'
                  name='city'
                  value={orderDate}
                  onChange={handleInputChange}
                  autoComplete='off'
                  className={`${
                    invalidFields.includes("city") && "border-red-500"
                  }  w-[50%] sm:w-[68%] py-1 px-2 rounded-md border border-gray-900 outline-transparent bg-transparent placeholder:text-sm focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
                />
              </div>

              <div className='flex items-center justify-between gap-2'>
                <label
                  htmlFor='stateRegion'
                  className="flex-1 p-2 whitespace-nowrap text-sm text-gray-900 md:w-[126.4px] lg:text-end before:content-['*'] before:mr-1 before:text-red-900"
                >
                  State / Region:
                </label>
                <div className='flex justify-between gap-2 items-center w-[50%] sm:w-[68%]'>
                  <div className='flex-1'>
                    <input
                      id='stateRegion'
                      type='text'
                      name='stateRegion'
                      value={orderDate}
                      onChange={handleInputChange}
                      autoComplete='off'
                      className={`${
                        invalidFields.includes("stateRegion") &&
                        "border-red-500"
                      } self-start w-full  py-1 px-2 rounded-md border border-gray-900 outline-transparent bg-transparent placeholder:text-sm focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
                    />
                  </div>
                  <div className='hidden sm:flex items-center justify-between gap-2 flex-1'>
                    <label
                      htmlFor='postal'
                      className="p-2 whitespace-nowrap text-sm text-gray-900 flex-1 lg:text-end before:content-['*'] before:mr-1 before:text-red-900"
                    >
                      Postal Code:
                    </label>
                    <input
                      id='postal'
                      type='text'
                      name='postal'
                      value={orderDate}
                      onChange={handleInputChange}
                      autoComplete='off'
                      className={`${
                        invalidFields.includes("postal") && "border-red-500"
                      } lg:w-[80px] py-1 px-2 rounded-md border border-gray-900 outline-transparent bg-transparent placeholder:text-sm focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
                    />
                  </div>
                </div>
              </div>
              <div className='sm:hidden flex items-center justify-between gap-2'>
                <label
                  htmlFor='postal'
                  className="p-2 whitespace-nowrap text-sm text-gray-900 flex-1 md:text-end before:content-['*'] before:mr-1 before:text-red-900"
                >
                  Postal Code:
                </label>
                <input
                  id='postal'
                  type='text'
                  name='postal'
                  value={orderDate}
                  onChange={handleInputChange}
                  autoComplete='off'
                  className={`${
                    invalidFields.includes("postal") && "border-red-500"
                  }  w-[50%] sm:w-[68%] py-1 px-2 rounded-md border border-gray-900 outline-transparent bg-transparent placeholder:text-sm focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
                />
              </div>
            </div>

            <div className='flex flex-col gap-1 lg:w-[420px] '>
              <h1 className='font-bold'>Bill To:</h1>

              <div className='flex items-center justify-between gap-2'>
                <label
                  htmlFor='customerName'
                  className="p-2 whitespace-nowrap text-sm text-gray-900 flex-1 lg:text-end before:content-['*'] before:mr-1 before:text-red-900"
                >
                  Customer Name:
                </label>
                <input
                  id='customerName'
                  type='text'
                  name='customerName'
                  value={orderDate}
                  onChange={handleInputChange}
                  autoComplete='off'
                  className={`${
                    invalidFields.includes("orderDate") && "border-red-500"
                  }  w-[50%] sm:w-[68%] py-1 px-2 rounded-md border  border-gray-900 outline-transparent bg-transparent placeholder:text-sm focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
                />
              </div>
              <div className='flex items-center justify-between gap-2'>
                <label
                  htmlFor='address1'
                  className="p-2 whitespace-nowrap text-sm text-gray-900 flex-1 lg:text-end before:content-['*'] before:mr-1 before:text-red-900"
                >
                  Address 1:
                </label>
                <input
                  id='address1'
                  type='text'
                  name='address1'
                  value={orderDate}
                  onChange={handleInputChange}
                  autoComplete='off'
                  className={`${
                    invalidFields.includes("address1") && "border-red-500"
                  }  w-[50%] sm:w-[68%] py-1 px-2 rounded-md border  border-gray-900 outline-transparent bg-transparent placeholder:text-sm focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
                />
              </div>
              <div className='flex items-center justify-between gap-2'>
                <label
                  htmlFor='address2'
                  className="p-2 whitespace-nowrap text-sm text-gray-900 flex-1 lg:text-end before:content-['*'] before:mr-1 before:text-red-900"
                >
                  Address 2:
                </label>
                <input
                  id='address2'
                  type='text'
                  name='address2'
                  value={orderDate}
                  onChange={handleInputChange}
                  autoComplete='off'
                  className={`${
                    invalidFields.includes("address2") && "border-red-500"
                  }  w-[50%] sm:w-[68%] py-1 px-2 rounded-md border border-gray-900 outline-transparent bg-transparent placeholder:text-sm focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
                />
              </div>
              <div className='flex items-center justify-between gap-2'>
                <label
                  htmlFor='city'
                  className="p-2 whitespace-nowrap text-sm text-gray-900 flex-1 lg:text-end before:content-['*'] before:mr-1 before:text-red-900"
                >
                  City:
                </label>
                <input
                  id='city'
                  type='text'
                  name='city'
                  value={orderDate}
                  onChange={handleInputChange}
                  autoComplete='off'
                  className={`${
                    invalidFields.includes("city") && "border-red-500"
                  }  w-[50%] sm:w-[68%] py-1 px-2 rounded-md border border-gray-900 outline-transparent bg-transparent placeholder:text-sm focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
                />
              </div>

              <div className='flex items-center justify-between gap-2'>
                <label
                  htmlFor='stateRegion'
                  className="flex-1 p-2 whitespace-nowrap text-sm text-gray-900 md:w-[126.4px] lg:text-end before:content-['*'] before:mr-1 before:text-red-900"
                >
                  State / Region:
                </label>
                <div className='flex justify-between gap-2 items-center w-[50%] sm:w-[68%]'>
                  <div className='flex-1'>
                    <input
                      id='stateRegion'
                      type='text'
                      name='stateRegion'
                      value={orderDate}
                      onChange={handleInputChange}
                      autoComplete='off'
                      className={`${
                        invalidFields.includes("stateRegion") &&
                        "border-red-500"
                      } self-start w-full  py-1 px-2 rounded-md border border-gray-900 outline-transparent bg-transparent placeholder:text-sm focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
                    />
                  </div>
                  <div className='hidden sm:flex items-center justify-between gap-2 flex-1'>
                    <label
                      htmlFor='postal'
                      className="p-2 whitespace-nowrap text-sm text-gray-900 flex-1 lg:text-end before:content-['*'] before:mr-1 before:text-red-900"
                    >
                      Postal Code:
                    </label>
                    <input
                      id='postal'
                      type='text'
                      name='postal'
                      value={orderDate}
                      onChange={handleInputChange}
                      autoComplete='off'
                      className={`${
                        invalidFields.includes("postal") && "border-red-500"
                      } lg:w-[80px] py-1 px-2 rounded-md border border-gray-900 outline-transparent bg-transparent placeholder:text-sm focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
                    />
                  </div>
                </div>
              </div>
              <div className='sm:hidden flex items-center justify-between gap-2'>
                <label
                  htmlFor='postal'
                  className="p-2 whitespace-nowrap text-sm text-gray-900 flex-1 md:text-end before:content-['*'] before:mr-1 before:text-red-900"
                >
                  Postal Code:
                </label>
                <input
                  id='postal'
                  type='text'
                  name='postal'
                  value={orderDate}
                  onChange={handleInputChange}
                  autoComplete='off'
                  className={`${
                    invalidFields.includes("postal") && "border-red-500"
                  }  w-[50%] sm:w-[68%] py-1 px-2 rounded-md border border-gray-900 outline-transparent bg-transparent placeholder:text-sm focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateSalesOrder
