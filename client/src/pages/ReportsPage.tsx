import React, { useState } from "react"
import PageTitle from "../components/common/utils/PageTitle"
import { flattenObject } from "../utils/flattenObject"
import Papa from "papaparse"
import { getItemList } from "../api/services/item"
import { getUserList } from "../api/services/admin"
import usePageTitle from "../hooks/usePageTitle"
import { getStockListByDateRange, getAssembleList } from "../api/services/stock"
import { getCustomerList } from "../api/services/customer"
import { getInventoryList } from "../api/services/inventory"
import { getUserGroupList } from "../api/services/admin"
import { getSalesOrderListByDateRange } from "../api/services/sales"
import { FaChevronUp, FaChevronDown } from "react-icons/fa"
import { showToast } from "../utils/Toast"
import Table from "../components/common/table/Table"
import { createColumnHelper } from "@tanstack/react-table"

const DyanmicColumns = (data: any) => {
  const columnHelper = createColumnHelper<any>()
  const columns = Object.keys(data[0] || {}).map((key) =>
    columnHelper.accessor(key, {
      cell: (info) => <span>{info.getValue()}</span>,
      header: () => <span className='truncate'>{key}</span>,
    })
  )
  return columns
}

const ReportsPage = () => {
  usePageTitle("Reports")

  const [selectedReport, setSelectedReport] = useState<string>("")
  const [isRangeChecked, setIsRangeChecked] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isPreview, setIsPreview] = useState<any>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [startDate, setStartDate] = useState<string>(
    `${new Date().toISOString().split("T")[0]}`
  )
  const [endDate, setEndDate] = useState<string>(
    `${new Date().toISOString().split("T")[0]}`
  )

  const options = {
    itemList: "ITEM LIST",
    userList: "USER LIST",
    stockList: "STOCK-IN LIST",
    assembleList: "ASSEMBLE LIST",
    customerList: "CUSTOMER LIST",
    inventoryList: "INVENTORY LIST",
    userGroupList: "USER GROUP LIST",
    salesOrderList: "SALES ORDER LIST",
  }

  const handleRangeToggle = () => {
    setIsRangeChecked((prev) => !prev)
  }

  const handleSelect = (option: string) => {
    setSelectedReport(option)
    setIsRangeChecked(false)
    setIsOpen(false)
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
    assembleList: getAssembleList,
    customerList: getCustomerList,
    inventoryList: getInventoryList,
    userGroupList: getUserGroupList,
  }

  const handleGenerateReport = async () => {
    const reportFunction = reports[selectedReport as keyof typeof reports]

    if (!reportFunction && selectedReport === "Select a report") {
      showToast.error("Please select a report type")
      return
    }

    setIsLoading(true)

    try {
      if (selectedReport === "stockList") {
        if (!isRangeChecked) {
          showToast.error("Please select a date range")
          setIsLoading(false)
          return
        }

        const response = await getStockListByDateRange({
          from: startDate,
          to: endDate,
        })

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
      } else if (selectedReport === "salesOrderList") {
        if (!isRangeChecked) {
          showToast.error("Please select a date range")
          setIsLoading(false)
          return
        }

        const response = await getSalesOrderListByDateRange({
          from: startDate,
          to: endDate,
        })

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
      } else {
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
      }
    } catch (error) {
      showToast.error("Error generating reports")
    }

    setIsLoading(false)
  }

  const handlePreviewExcel = async () => {
    const reportFunction = reports[selectedReport as keyof typeof reports]

    if (!reportFunction && selectedReport === "Select a report") {
      showToast.error("Please select a report type")
      return
    }

    setIsLoading(true)

    try {
      if (selectedReport === "stockList") {
        if (!isRangeChecked) {
          showToast.error("Please select a date range")
          setIsLoading(false)
          return
        }

        const response = await getStockListByDateRange({
          from: startDate,
          to: endDate,
        })

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

        setIsPreview(adjustedFlattenData)
      } else if (selectedReport === "salesOrderList") {
        if (!isRangeChecked) {
          showToast.error("Please select a date range")
          setIsLoading(false)
          return
        }

        const response = await getSalesOrderListByDateRange({
          from: startDate,
          to: endDate,
        })

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

        setIsPreview(adjustedFlattenData)
      } else {
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

        setIsPreview(adjustedFlattenData)
      }
    } catch (error) {
      showToast.error("Error generating reports")
    }

    setIsLoading(false)
  }

  const columns = DyanmicColumns(isPreview)

  return (
    <>
      <PageTitle>Reports Page</PageTitle>

      <div className='w-full flex flex-col gap-2.5'>
        <div className='p-4 rounded-2xl shadow-md w-full flex flex-col gap-2.5'>
          <div className='flex flex-col gap-2.5'>
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
                  <span>
                    {options[selectedReport as keyof typeof options] ||
                      "Select a report"}
                  </span>
                  {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                </div>

                {isOpen && (
                  <div
                    className={`${
                      isRangeChecked ? "max-h-[210px]" : "max-h-[160px]"
                    } z-10 absolute w-full bg-white border border-gray-300 rounded-md overflow-y-auto mt-1 scrollbar`}
                    style={{ zIndex: 10 }}
                  >
                    {Object.keys(options).map((key) => (
                      <div
                        key={key}
                        onClick={() => handleSelect(key)}
                        className='p-2 cursor-pointer hover:bg-gray-200'
                      >
                        {options[key as keyof typeof options]}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {(selectedReport === "stockList" ||
              selectedReport === "salesOrderList") && (
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
                        checked={isRangeChecked}
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
            )}

            <div className='flex gap-2.5 items-center justify-end'>
              <button
                onClick={handlePreviewExcel}
                type='button'
                className='bg-primary rounded-md px-6 py-2.5 text-white font-bold'
              >
                {isLoading ? (
                  <div className='w-5 h-5 border-2 border-t-2 border-[#14aff1] border-t-white rounded-full animate-spin'></div>
                ) : (
                  <span>Preview</span>
                )}
              </button>

              <button
                onClick={handleGenerateReport}
                type='button'
                className='bg-primary rounded-md px-6 py-2.5 text-white font-bold'
              >
                {isLoading ? (
                  <div className='w-5 h-5 border-2 border-t-2 border-[#14aff1] border-t-white rounded-full animate-spin'></div>
                ) : (
                  <span>Download</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {isPreview.length > 0 && (
          <div className='flex flex-col h-[600px] gap-2.5 mt-4'>
            <h2 className='text-xl font-semibold '>
              Preview of{" "}
              <span className='uppercase text-[#14aff1]'>
                {options[selectedReport as keyof typeof options]}
              </span>
            </h2>

            <Table
              data={isPreview || []}
              columns={columns}
              search={true}
              withImport={false}
              withExport={true}
              add={false}
              view={false}
              approval={false}
            />
          </div>
        )}
      </div>
    </>
  )
}

export default ReportsPage
