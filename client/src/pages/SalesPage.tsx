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

const fields = [
  { key: "salesorderNo", label: "Order Number", classes: "uppercase" },
  { key: "orderDate", label: "Order Date" },
  { key: "customer.name", label: "Customer Name", classes: "capitalize" },
]

const Columns = ({
  fields,
  onView,
  onUpdate,
}: {
  fields: { key: string; label: string; classes?: string }[]
  onView: (item: SalesOrderType) => void
  onUpdate: (item: SalesOrderType) => void
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
          <button
            onClick={(e) => {
              e.stopPropagation()
              onView(info.row.original)
            }}
            className='lg:py-2 lg:px-4 p-2 bg-gray-200 hover:bg-gray-300 hover:text-primary rounded-md shadow-md'
          >
            <IoEyeOutline size={20} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onUpdate(info.row.original)
            }}
            className='lg:py-2 lg:px-4 p-2 bg-gray-200 hover:bg-gray-300 hover:text-blue-700 rounded-md shadow-md'
          >
            <CiEdit size={20} />
          </button>
        </div>
      ),
      header: () => <span className='text-center truncate'>Actions</span>,
    }),
  ]
}

const SalesPage = () => {
  usePageTitle("Sales")
  const { data, isLoading, isError } = useSalesOrder()
  const [openModal, setOpenModal] = useState<boolean>()
  const [openSalesOrderModal, setOpenSalesOrderModal] = useState<boolean>()
  const [openViewSalesOrder, setOpenViewOrderModal] = useState<boolean>()
  const [salesOrderDetails, setSalesOrderDetails] = useState<SalesOrderType>()

  const handleSalesOrderModalToggle = () => {
    setOpenSalesOrderModal((prev) => !prev)
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

  const columns = Columns({
    fields,
    onView: handleViewSalesOrder,
    onUpdate: handleUpdate,
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

  return (
    <>
      <PageTitle>Sales Page</PageTitle>
      {isLoading ? (
        <Spinner />
      ) : (
        <Table
          data={data || []}
          columns={columns}
          sorting={[
            {
              id: "salesorderNo",
              desc: true,
            },
          ]}
          search={true}
          withImport={false}
          withExport={true}
          add={true}
          view={false}
          handleAdd={handleSalesOrderModalToggle}
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
    </>
  )
}

export default SalesPage
