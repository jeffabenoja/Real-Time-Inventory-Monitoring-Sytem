import PageTitle from "../components/common/utils/PageTitle"
import { createColumnHelper } from "@tanstack/react-table"
import { useState } from "react"
import { MdOutlineRemoveRedEye } from "react-icons/md"
import { DetailsType, SalesOrderType } from "../type/salesType"
import useSalesOrder from "../hooks/sales/useSalesOrder"
import { FaExclamationTriangle } from "react-icons/fa"
import Spinner from "../components/common/utils/Spinner"
import Table from "../components/common/table/Table"
import CustomModal from "../components/common/utils/CustomModal"
import SalesOrderComponent from "../components/common/SalesOrderComponent"

const fields = [
  { key: "salesorderNo", label: "Order Number", classes: "uppercase" },
  { key: "orderDate", label: "Order Date" },
  { key: "customer.name", label: "Customer Name", classes: "capitalize" },
]

const Columns = ({
  fields,
  onView,
}: {
  fields: { key: string; label: string; classes?: string }[]
  onView: (item: SalesOrderType) => void
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
          .map((detail) => detail.amount)
          .reduce((acc, amount) => acc + amount, 0)

        return <span>{totalAmount}</span>
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
            className='py-2 px-4 bg-gray-200 hover:bg-gray-300 hover:text-primary rounded-md shadow-md'
          >
            <MdOutlineRemoveRedEye size={20} />
          </button>
        </div>
      ),
      header: () => <span className='text-center truncate'>Actions</span>,
    }),
  ]
}

const SalesPage = () => {
  const { data, isLoading, isError } = useSalesOrder()
  const [openModal, setOpenModal] = useState<boolean>()
  const [openSalesOrderModal, setOpenSalesOrderModal] = useState<boolean>()

  const handleSalesOrderModalToggle = () => {
    setOpenSalesOrderModal((prev) => !prev)
  }

  const handleOpenModalToggle = () => {
    setOpenModal((prev) => !prev)
  }

  const handleUpdate = (row: SalesOrderType) => {
    handleOpenModalToggle()
    console.log(row)
  }

  const columns = Columns({
    fields,
    onView: () => {},
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
    <div className='flex flex-col max-w-full mx-auto h-dynamic-sm lg:h-dynamic-lg px-4 lg:px-8 py-4'>
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
          handleUpdate={handleUpdate}
        />
      )}

      {openSalesOrderModal && (
        <CustomModal
          toggleModal={handleSalesOrderModalToggle}
          classes='h-[480px] md:p-8 w-[343px] md:w-[970px]'
        >
          <SalesOrderComponent close={handleSalesOrderModalToggle} />
        </CustomModal>
      )}

      {openModal && (
        <CustomModal
          toggleModal={handleOpenModalToggle}
          classes='h-[480px] md:p-8 w-[343px] md:w-[970px]'
        >
          <h1>Update Sales Order</h1>
        </CustomModal>
      )}
    </div>
  )
}

export default SalesPage
