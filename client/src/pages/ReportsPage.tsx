import React, { useState, useEffect } from "react"
import PageTitle from "../components/common/utils/PageTitle"
import { flattenObject } from "../utils/flattenObject"
import Papa from "papaparse"
import { getItemList } from "../api/services/item"
import { getUserList } from "../api/services/admin"
import { getStockList } from "../api/services/stock"

const ReportsPage = () => {
  useEffect(() => {
    document.title = "Reports | E&L Delicatessen"
  }, [])

  const [selectedReport, setSelectedReport] = useState<string>("")
  const [isRangeChecked, setIsRangeChecked] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [startDate, setStartDate] = useState<string>(
    `${new Date().toISOString().split("T")[0]}`
  )
  const [endDate, setEndDate] = useState<string>(
    `${new Date().toISOString().split("T")[0]}`
  )

  const handleReportChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedReport(event.target.value)
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
  }

  const handleGenerateReport = async () => {
    const reportFunction = reports[selectedReport as keyof typeof reports]

    if (!reportFunction) {
      console.log("Invalid report type selected")
      return
    }

    setIsLoading(true)

    try {
      const response = await reportFunction()

      const flattenData = response.map((item: any) => flattenObject(item))

      const csv = Papa.unparse(flattenData, {
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
      console.log(error)
    }
    setIsLoading(false)
  }

  return (
    <>
      <PageTitle>Reports Page</PageTitle>

      <div className='flex items-center justify-center w-full h-full'>
        <div className='p-4 rounded-2xl shadow-md w-full md:w-2/4 flex flex-col gap-2.5'>
          <h1 className='text-2xl mb-2 font-bold'>Generate Reports</h1>
          <hr style={{ borderColor: "#14aff1" }} />
          <div className='flex flex-col gap-3'>
            <p className='text-base px-2'>Type of Reports</p>
            <select
              id='reports'
              name='reports'
              value={selectedReport}
              onChange={handleReportChange}
              className='w-full p-2 rounded-md border cursor-pointer outline-transparent bg-transparent text-xs
                focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary'
            >
              <option value='itemList'>ITEM LIST</option>
              <option value='userList'>USER LIST</option>
              <option value='stockList'>STOCK LIST</option>
              <option value='assembleList'>ASSEMBLE LIST</option>
              <option value='customerList'>CUSTOMER LIST</option>
              <option value='inventoryList'>INVENTORY LIST</option>
              <option value='userGroupList'>USER GROUP LIST</option>
              <option value='salesOrderList'>SALES ORDER LIST</option>
            </select>
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
