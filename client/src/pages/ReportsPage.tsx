import React, { useState } from "react"
import PageTitle from "../components/common/utils/PageTitle"
import { flattenObject } from "../utils/flattenObject"
import Papa from "papaparse"
import { getItemList } from "../api/services/item"
import { getUserList } from "../api/services/admin"
import usePageTitle from "../hooks/usePageTitle"
import { getStockList, getAssembleList } from "../api/services/stock"
import { getCustomerList } from "../api/services/customer"
import { getInventoryList } from "../api/services/inventory"
import { getUserGroupList } from "../api/services/admin"
import { getSalesOrderList } from "../api/services/sales"
import { FaChevronUp, FaChevronDown } from "react-icons/fa"
import { showToast } from "../utils/Toast"

const ReportsPage = () => {
  usePageTitle("Reports")

  const [selectedReport, setSelectedReport] = useState<string>("")
  const [isRangeChecked, setIsRangeChecked] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [startDate, setStartDate] = useState<string>(
    `${new Date().toISOString().split("T")[0]}`
  )
  const [endDate, setEndDate] = useState<string>(
    `${new Date().toISOString().split("T")[0]}`
  )

  const options = [
    "ITEM LIST",
    "USER LIST",
    "ASSEMBLE LIST",
    "CUSTOMER LIST",
    "STOCK-IN LIST",
    "INVENTORY LIST",
    "USER GROUP LIST",
    "SALES ORDER LIST",
  ]

  const handleSelect = (option: string) => {
    setSelectedReport(option)
    setIsOpen(false)
  }

  const handleRangeToggle = () => {
    setIsRangeChecked((prev) => !prev)
  }

  const handleStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStartDate(event.target.value)
  }

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value)
  }

  const reports = {
    itemList: getItemList,
    userList: getUserList,
    stockList: getStockList,
    assembleList: getAssembleList,
    customerList: getCustomerList,
    inventoryList: getInventoryList,
    userGroupList: getUserGroupList,
    salesOrderList: getSalesOrderList,
  }

  const handleGenerateReport = async () => {
    const reportFunction = reports[selectedReport as keyof typeof reports]

    if (!reportFunction) {
      return
    }

    setIsLoading(true)

    try {
      const response = await reportFunction()

      const flattenData = response.map((item: any) => flattenObject(item))

      const allDynamicKeys: any[] = [
        ...new Set(
          flattenData.flatMap((item: any) =>
            Object.keys(item).filter((key: string) =>
              key.startsWith("details_")
            )
          )
        ),
      ]

      const adjustedFlattenData = flattenData.map((item: any) => {
        allDynamicKeys.forEach((key: string) => {
          if (!(key in item)) {
            item[key] = null
          }
        })
        return item
      })

      const csv = Papa.unparse(adjustedFlattenData, {
        header: true,
      })

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "report.csv"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      showToast.error("Error generating reports")
    }
    setIsLoading(false)
  }

  return (
    <>
      <PageTitle>Reports Page</PageTitle>

      <div className='flex justify-center w-full mt-20'>
        <div className='p-4 rounded-2xl shadow-md w-full md:w-2/4 flex flex-col gap-2.5'>
          <h1 className='text-2xl mb-2 font-bold'>Generate Reports</h1>
          <hr style={{ borderColor: "#14aff1" }} />
          <div className='flex flex-col gap-3'>
            <p className='text-base px-2'>Type of Reports</p>
            <div className='relative'>
              <div
                onClick={() => setIsOpen(!isOpen)}
                className='w-full p-2 rounded-md border cursor-pointer outline-transparent bg-transparent text-xs
          focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary flex items-center justify-between'
              >
                <span>{selectedReport || "Select a report"}</span>
                {isOpen ? <FaChevronUp /> : <FaChevronDown />}
              </div>

              {isOpen && (
                <div
                  className={`${
                    isRangeChecked ? "max-h-[120px]" : "max-h-[80px]"
                  } absolute w-full bg-white border border-gray-300 rounded-md overflow-y-auto mt-1 scrollbar`}
                  style={{ zIndex: 10 }}
                >
                  {options.map((option) => (
                    <div
                      key={option}
                      onClick={() => handleSelect(option)}
                      className='p-2 cursor-pointer hover:bg-gray-200'
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className='flex flex-col gap-3'>
            <div className='flex items-center justify-between gap-2'>
              <p className='text-base px-2'>Date Range</p>
              <div className='flex items-center gap-6'>
                <label
                  htmlFor='default-toggle'
                  className='inline-flex relative items-center cursor-pointer'
                >
                  <input
                    type='checkbox'
                    id='default-toggle'
                    className='sr-only peer'
                    onChange={handleRangeToggle}
                  />
                  <div className="w-[40px] h-[20px] bg-gray-200 peer-focus:outline-none dark:peer-focus:ring-primary-400 rounded-full peer peer-checked:after:translate-x-[18px] peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-[14px] after:h-[14px] after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>

            {isRangeChecked && (
              <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 md:gap-5'>
                <div className='flex flex-col gap-2 flex-1'>
                  <label htmlFor='startDate' className='text-sm px-2'>
                    Start Date
                  </label>
                  <input
                    id='startDate'
                    type='date'
                    name='startDate'
                    onChange={handleStartDateChange}
                    value={startDate}
                    autoComplete='off'
                    max={new Date().toISOString().split("T")[0]}
                    className='w-full py-2 px-4 border border-secondary-200 border-opacity-25 rounded-md outline-transparent bg-transparent placeholder:text-sm
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary'
                  />
                </div>
                <div className='flex flex-col gap-2 flex-1'>
                  <label htmlFor='endDate' className='text-sm px-2'>
                    End Date
                  </label>
                  <input
                    id='endDate'
                    type='date'
                    name='endDate'
                    onChange={handleEndDateChange}
                    value={endDate}
                    autoComplete='off'
                    max={new Date().toISOString().split("T")[0]}
                    className='w-full py-2 px-4 border border-secondary-200 border-opacity-25 rounded-md outline-transparent bg-transparent placeholder:text-sm
              focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary'
                  />
                </div>
              </div>
            )}
          </div>
          <div className='flex items-center justify-end'>
            <button
              onClick={handleGenerateReport}
              type='button'
              className='bg-primary rounded-md px-6 py-2.5 text-white font-bold'
            >
              {isLoading ? (
                <div className='w-5 h-5 border-2 border-t-2 border-[#14aff1] border-t-white rounded-full animate-spin'></div>
              ) : (
                <span>Generate</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ReportsPage
