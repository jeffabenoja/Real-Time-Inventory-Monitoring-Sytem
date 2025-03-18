import PageTitle from "../components/common/utils/PageTitle"
import { createColumnHelper } from "@tanstack/react-table"
import usePageTitle from "../hooks/usePageTitle"
import { useState } from "react"
import { IoEyeOutline } from "react-icons/io5"
import { DetailsType, SalesOrderType } from "../type/salesType"
import useSalesOrder from "../hooks/sales/useSalesOrder"
import { FaExclamationTriangle } from "react-icons/fa"
import Spinner from "../components/common/utils/Spinner"
import Table from "../components/common/table/Table"
import CustomModal from "../components/common/utils/CustomModal"
import SalesOrderComponent from "../components/common/SalesOrderComponent"
import ViewSalesOrder from "../components/modal/ViewSalesOrder"
import { CiEdit } from "react-icons/ci"
import UpdateSalesOrder from "../components/modal/UpdateSalesOrder"
import { showToast } from "../utils/Toast"
import { IoPrintOutline } from "react-icons/io5"
import { useNavigate } from "react-router-dom"
import Tooltip from "../components/common/Tooltip"
import SalesApprovalTable from "../components/common/SalesApprovalTable"

const fields = [
  { key: "salesorderNo", label: "Order Number", classes: "uppercase" },
  { key: "orderDate", label: "Order Date" },
  { key: "customer.name", label: "Customer Name", classes: "capitalize" },
]

const Columns = ({
  fields,
  onView,
  onUpdate,
  onPrint,
}: {
  fields: { key: string; label: string; classes?: string }[]
  onView: (item: SalesOrderType) => void
  onUpdate: (item: SalesOrderType) => void
  onPrint: (item: SalesOrderType) => void
}) => {
  const columnHelper = createColumnHelper<any>()

  return [
    // Dynamically generate columns based on fields
    ...fields.map((field) =>
      columnHelper.accessor(field.key, {
        cell: (info) => (
          <span className={`${field.classes}`}>{info.getValue()}</span>
        ),
        header: () => <span className='truncate'>{field.label}</span>,
      })
    ),

    columnHelper.accessor("details", {
      id: "totalItems",
      cell: (info) => {
        const detailsLength = info.row.original.details.length

        return <span>{detailsLength}</span>
      },
      header: () => <span className='truncate'>Number of Item</span>,
    }),
    columnHelper.accessor("details", {
      id: "totalAmount",
      cell: (info) => {
        const details: DetailsType[] = info.getValue()

        const totalAmount = details
          .map((detail) => {
            const amount = detail.amount

            return amount % 1 === 0 ? `${amount}.00` : amount.toFixed(2)
          })
          .reduce((acc, amount) => acc + parseFloat(amount), 0)

        return <span>{totalAmount.toFixed(2)}</span>
      },
      header: () => <span className='truncate'>Total Amount</span>,
    }),

    columnHelper.accessor("status", {
      id: "status",
      cell: (info) => <span className='capitalize'>{info.getValue()}</span>,
      header: () => <span className='truncate'>Status</span>,
    }),

    // Add the actions column
    columnHelper.accessor("actions", {
      id: "actions",
      cell: (info) => (
        <div className='flex gap-2 items-center justify-center w-[150px] lg:w-full'>
          {/* Add Button */}
          <Tooltip text='View Order'>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onView(info.row.original)
              }}
              className='lg:py-2 lg:px-4 p-2 bg-gray-200 hover:bg-gray-300 hover:text-primary rounded-md shadow-md'
            >
              <IoEyeOutline size={20} />
            </button>
          </Tooltip>
          <Tooltip text='Update Order'>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onUpdate(info.row.original)
              }}
              className='lg:py-2 lg:px-4 p-2 bg-gray-200 hover:bg-gray-300 hover:text-blue-700 rounded-md shadow-md'
            >
              <CiEdit size={20} />
            </button>
          </Tooltip>
          <Tooltip text='Print Order'>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onPrint(info.row.original)
              }}
              className='lg:py-2 lg:px-4 p-2 bg-gray-200 hover:bg-gray-300 hover:text-blue-700 rounded-md shadow-md'
            >
              <IoPrintOutline size={20} />
            </button>
          </Tooltip>
        </div>
      ),
      header: () => <span className='text-center truncate'>Actions</span>,
    }),
  ]
}

const SalesPage = () => {
  usePageTitle("Sales")
  const navigate = useNavigate()

  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const previousYear = currentYear - 1

  const [startDate, setStartDate] = useState<string>(`${previousYear}-01-01`)
  const [endDate, setEndDate] = useState<string>(`${currentYear}-12-31`)

  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: `${currentYear}-01-01`,
    to: `${currentYear}-12-31`,
  })
  const { data, isLoading, isError } = useSalesOrder({
    from: dateRange.from,
    to: dateRange.to,
  })

  const salesData = data?.filter((pending) => pending.status === "COMPLETED")
  const [openModal, setOpenModal] = useState<boolean>()
  const [isRangeChecked, setIsRangeChecked] = useState<boolean>(false)
  const [openSalesOrderModal, setOpenSalesOrderModal] = useState<boolean>()
  const [openViewSalesOrder, setOpenViewOrderModal] = useState<boolean>()
  const [openFilterModal, setOpenFilterModal] = useState<boolean>()
  const [salesOrderDetails, setSalesOrderDetails] = useState<SalesOrderType>()
  const [approval, setApproval] = useState<boolean>(false)

  const handleStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStartDate(event.target.value)
  }

  const handleCloseDateRangeModal = () => {
    handlefilterModalToggle()
    handleRangeToggle()
  }

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value)
  }
  const handleSalesOrderModalToggle = () => {
    setOpenSalesOrderModal((prev) => !prev)
  }

  const handleRangeToggle = () => {
    setIsRangeChecked((prev) => !prev)
  }

  const handlefilterModalToggle = () => {
    setOpenFilterModal((prev) => !prev)
  }

  const handleGenerateDateRange = () => {
    if (!isRangeChecked) {
      showToast.error("Please select a date range")
    } else {
      setDateRange({ from: startDate, to: endDate })
      handleCloseDateRangeModal()
    }
  }

  const handleOpenModalToggle = () => {
    setOpenModal((prev) => !prev)
  }

  const handleViewSalesOrderToggle = () => {
    setOpenViewOrderModal((prev) => !prev)
  }

  const handleUpdate = (row: SalesOrderType) => {
    handleOpenModalToggle()
    setSalesOrderDetails(row)
  }

  const handleViewSalesOrder = (row: SalesOrderType) => {
    handleViewSalesOrderToggle()
    setSalesOrderDetails(row)
  }

  const handleApprovalToggle = () => {
    setApproval((prev) => !prev)
  }

  const handlePrintSalesOrder = (row: SalesOrderType) => {
    navigate(`/dashboard/sales-order/pdf/${row.salesorderNo}`)
  }

  const columns = Columns({
    fields,
    onView: handleViewSalesOrder,
    onUpdate: handleUpdate,
    onPrint: handlePrintSalesOrder,
  })
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

  console.log(salesData)

  return (
    <>
      <PageTitle>Sales Page</PageTitle>
      {isLoading ? (
        <Spinner />
      ) : (
        <Table
          data={salesData || []}
          columns={columns}
          sorting={[
            {
              id: "salesorderNo",
              desc: true,
            },
          ]}
          search={true}
          filter={true}
          withImport={false}
          withExport={true}
          add={true}
          approval={true}
          view={false}
          handleFilter={handlefilterModalToggle}
          handleAdd={handleSalesOrderModalToggle}
          handleApproval={handleApprovalToggle}
        />
      )}

      {openSalesOrderModal && (
        <CustomModal classes='md:h-[480px] md:p-8 w-full h-full md:w-[1080px]'>
          <SalesOrderComponent close={handleSalesOrderModalToggle} />
        </CustomModal>
      )}

      {openModal && salesOrderDetails && (
        <CustomModal classes='md:h-[480px] md:p-8 w-full h-full md:w-[1020px]'>
          <UpdateSalesOrder
            row={salesOrderDetails}
            close={handleOpenModalToggle}
          />
        </CustomModal>
      )}

      {openViewSalesOrder && salesOrderDetails && (
        <CustomModal
          toggleModal={handleViewSalesOrderToggle}
          classes='md:h-[480px] md:p-8 w-full h-full md:w-[1020px]'
        >
          <ViewSalesOrder
            row={salesOrderDetails}
            close={handleViewSalesOrderToggle}
          />
        </CustomModal>
      )}

      {approval && (
        <CustomModal classes='md:h-[480px] md:p-8 w-full h-full md:w-[970px]'>
          <SalesApprovalTable data={data || []} close={handleApprovalToggle} />
        </CustomModal>
      )}

      {openFilterModal && (
        <CustomModal>
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
            <div className='flex items-center justify-end gap-2.5'>
              <button
                onClick={handleCloseDateRangeModal}
                type='button'
                className='bg-red-700 rounded-md px-6 py-2.5 text-white font-bold'
              >
                <span>Cancel</span>
              </button>

              <button
                onClick={handleGenerateDateRange}
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
        </CustomModal>
      )}
    </>
  )
}

export default SalesPage
