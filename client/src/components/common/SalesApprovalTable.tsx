import { FaExclamationTriangle } from "react-icons/fa"
import { IoIosClose } from "react-icons/io"
import { createColumnHelper } from "@tanstack/react-table"
import Table from "./table/Table"
import { useState } from "react"
import { showToast } from "../../utils/Toast"
import { DetailsType } from "../../type/salesType"
import { SalesOrderType } from "../../type/salesType"
import { updateSalesOrder } from "../../api/services/sales"

const fields = [
  { key: "salesorderNo", label: "Order Number", classes: "uppercase" },
  { key: "orderDate", label: "Order Date" },
  { key: "customer.name", label: "Customer Name", classes: "capitalize" },
]

const Columns = ({
  fields,
  onUpdate,
}: {
  fields: { key: string; label: string; classes?: string }[]
  onUpdate: (item: any) => void
}) => {
  const columnHelper = createColumnHelper<any>()

  return [
    columnHelper.accessor("status", {
      cell: ({ row }) => {
        const [selectedStatus, setSelectedStatus] = useState(
          row.original.status
        )

        const handleStatusChange = (
          e: React.ChangeEvent<HTMLSelectElement>
        ) => {
          const newStatus = e.target.value
          setSelectedStatus(newStatus)

          row.original.status = newStatus

          if (
            row.original.status !== "DRAFT" &&
            row.original.remakrs !== "" &&
            row.original.orderDate !== ""
          ) {
            const salesToUpdate = {
              ...row.original,
              status: newStatus,
            }

            onUpdate(salesToUpdate)
          } else {
            showToast.error("Cannot approve invalid entry!")
          }
        }

        return row.original.status === "DRAFT" ? (
          <select
            value={selectedStatus}
            onChange={handleStatusChange}
            className='py-2 rounded-md border outline-transparent bg-transparent text-xs
      focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary'
          >
            <option value='DRAFT'>DRAFT</option>
            <option value='COMPLETED'>COMPLETED</option>
            <option value='CANCEL'>CANCEL</option>
          </select>
        ) : (
          <span className='truncate'>{selectedStatus}</span>
        )
      },
      header: () => <span className='truncate'>Status</span>,
    }),
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
  ]
}

type ApprovalProps = {
  data: SalesOrderType[]
  close: () => void
}
const SalesApprovalTable = ({ data, close }: ApprovalProps) => {
  const [approvalDataState, setApprovalDataState] =
    useState<SalesOrderType[]>(data)

  const draftItems = approvalDataState.filter(
    (pending) => pending.status === "DRAFT"
  )

  const cancelItems = approvalDataState.filter(
    (pending) => pending.status === "CANCEL"
  )
  const handleUpdate = async (updatedRow: any) => {
    const updatedOrder = {
      salesorderNo: updatedRow.salesorderNo,
      orderDate: updatedRow.orderDate,
      remarks: updatedRow.remarks,
      customer: {
        id: updatedRow.customer.id.toString(),
      },
      status: updatedRow.status,
      details: updatedRow.details.map((item: any) => ({
        id: item.id.toString(),
        item: {
          code: item.item.code,
        },
        orderQuantity: item.orderQuantity.toString(),
        itemPrice: item.itemPrice.toString(),
      })),
    }

    try {
      await updateSalesOrder(updatedOrder)
      const updatedApprovalData = approvalDataState.map((item) =>
        item.salesorderNo === updatedRow.salesorderNo ? updatedRow : item
      )

      setApprovalDataState(updatedApprovalData)
      showToast.success("Successfully updated stock transaction")
    } catch (error) {
      showToast.error("Error updating stock transaction")
    }
  }

  const [selectedStatus, setSelectedStatus] = useState<string>("pending")

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedStatus(event.target.value)
  }

  if (data?.length === 0) {
    return (
      <section className='text-center flex flex-col justify-center items-center h-96'>
        <FaExclamationTriangle className='text-red-900 text-6xl mb-4' />
        <h1 className='text-2xl font-bold mb-4'>
          No Available Data for Approval
        </h1>
        <button
          type='button'
          onClick={close}
          className='bg-red-700 rounded-md py-2.5 w-[150px] text-white font-bold text-xs text-center'
        >
          Go Back
        </button>
      </section>
    )
  }

  const columns = Columns({
    fields,
    onUpdate: handleUpdate,
  })

  return (
    <div className='flex flex-col h-full'>
      <div className='flex items-center justify-end'>
        <IoIosClose className='cursor-pointer' size={30} onClick={close} />
      </div>

      <div className='border-b border-[#14aff1] pb-2'>
        <div className='flex justify-center items-center'>
          <h1 className='font-bold text-center mb-2'>APPROVAL LIST</h1>
        </div>

        <div className='flex gap-5 items-center justify-center'>
          <label className='flex items-center cursor-pointer uppercase'>
            <input
              type='radio'
              value='pending'
              checked={selectedStatus === "pending"}
              onChange={handleStatusChange}
              className='mr-2 cursor-pointer'
            />
            Pending
          </label>

          <label className='flex items-center cursor-pointer uppercase'>
            <input
              type='radio'
              value='cancel'
              checked={selectedStatus === "cancel"}
              onChange={handleStatusChange}
              className='mr-2 cursor-pointer'
            />
            Cancel
          </label>
        </div>
      </div>

      <Table
        data={selectedStatus === "pending" ? draftItems : cancelItems}
        columns={columns}
        search={true}
        withImport={false}
        withExport={true}
        withSubmit={false}
        withCancel={false}
        add={false}
        view={false}
        sorting={[{ id: "salesorderNo", desc: true }]}
      />
    </div>
  )
}

export default SalesApprovalTable
