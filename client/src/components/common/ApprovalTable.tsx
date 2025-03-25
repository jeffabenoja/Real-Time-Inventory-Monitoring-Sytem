import { getStockList, getAllStockOutList } from "../../api/services/stock"
import { FaExclamationTriangle } from "react-icons/fa"
import { useQuery } from "@tanstack/react-query"
import Spinner from "./utils/Spinner"
import { IoIosClose } from "react-icons/io"
import { createColumnHelper } from "@tanstack/react-table"
import Table from "./table/Table"
import { StockListType, StockOutListType } from "../../type/stockType"
import { useState, useEffect } from "react"
import { showToast } from "../../utils/Toast"
import { rawMatsStockOut, rawMatsStockIn } from "../../store/slices/inventory"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../store"
import { updateStock, updateStockOut } from "../../api/services/stock"

const fields = [
  { key: "transactionNo", label: "Transaction Number", classes: "uppercase" },
  { key: "expiryDate", label: "Expiry Date" },
  { key: "batchNo", label: "Batch Number", classes: "uppercase" },
  { key: "quantity", label: "Quantity" },
  { key: "item.code", label: "Product Code", classes: "uppercase" },
  { key: "item.description", label: "Product Name", classes: "uppercase" },
  { key: "issuedQuantity", label: "Issued Quantity" },
  { key: "returnQuantity", label: "Return Quantity" },
]

const stockOutFields = [
  { key: "transactionNo", label: "Transaction Number", classes: "uppercase" },
  { key: "batchNo", label: "Batch Number", classes: "uppercase" },
  { key: "quantity", label: "Quantity" },
  { key: "stockIn.item.code", label: "Product Code", classes: "uppercase" },
  {
    key: "stockIn.item.description",
    label: "Product Name",
    classes: "uppercase",
  },
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
            row.original.expiryDate !== null &&
            row.original.quantity > 0 &&
            row.original.batchNo !== ""
          ) {
            const stockToUpdate = {
              ...row.original,
              status: newStatus,
            }
            onUpdate(stockToUpdate)
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
  ]
}

const stockOutColumn = ({
  stockOutFields,
  onUpdate,
}: {
  stockOutFields: { key: string; label: string; classes?: string }[]
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

          if (row.original.status !== "DRAFT" && row.original.quantity > 0) {
            const stockToUpdate = {
              ...row.original,
              status: newStatus,
            }
            onUpdate(stockToUpdate)
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
    ...stockOutFields.map((field) =>
      columnHelper.accessor(field.key, {
        cell: (info) => (
          <span className={`${field.classes}`}>{info.getValue()}</span>
        ),
        header: () => <span className='truncate'>{field.label}</span>,
      })
    ),
  ]
}

type ApprovalProps = {
  close: () => void
}
const ApprovalTable = ({ close }: ApprovalProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const [tab, setTab] = useState<string>("stockIn")
  const {
    data: stockInData = [],
    isLoading,
    isError,
  } = useQuery<StockListType[]>({
    queryKey: ["Stock", "Raw Mats"],
    queryFn: getStockList,
  })

  const { data: stockOutDataFetch = [] } = useQuery<StockOutListType[]>({
    queryKey: ["StockOut", "Raw Mats"],
    queryFn: getAllStockOutList,
  })

  const stockOutData = stockOutDataFetch.filter((item) =>
    item.transactionNo.includes("RM")
  )

  const [approvalDataState, setApprovalDataState] = useState<StockListType[]>(
    []
  )
  const [stockOutDataState, setStockOutDataState] = useState<
    StockOutListType[]
  >([])

  useEffect(() => {
    if (
      stockInData.length > 0 &&
      !areArraysEqual(stockInData, approvalDataState)
    ) {
      setApprovalDataState(stockInData)
    }

    if (
      stockOutData.length > 0 &&
      !areArraysEqual(stockOutData, stockOutDataState)
    ) {
      setStockOutDataState(stockOutData)
    }
  }, [stockInData, stockOutData])

  const areArraysEqual = (arr1: any[], arr2: any[]) => {
    return (
      arr1.length === arr2.length &&
      arr1.every((value, index) => value === arr2[index])
    )
  }

  const draftItems = approvalDataState.filter(
    (pending) => pending.status === "DRAFT"
  )
  const approvedItems = approvalDataState.filter(
    (approved) => approved.status === "COMPLETED"
  )
  const cancelItems = approvalDataState.filter(
    (cancel) => cancel.status === "CANCEL"
  )

  const stockOutDraftItems = stockOutDataState.filter(
    (pending) => pending.status === "DRAFT"
  )
  const stockOutApprovedItems = stockOutDataState.filter(
    (approved) => approved.status === "COMPLETED"
  )
  const stockOutCancelItems = stockOutDataState.filter(
    (cancel) => cancel.status === "CANCEL"
  )

  const handleUpdate = async (updatedRow: any) => {
    const stockToUpdate = {
      remarks: updatedRow.remarks,
      quantity: updatedRow.quantity,
      batchNo: updatedRow.batchNo,
      expiryDate: updatedRow.expiryDate,
      status: updatedRow.status,
      transactionNo: updatedRow.transactionNo,
    }

    try {
      await updateStock(stockToUpdate)

      dispatch(
        rawMatsStockIn({
          itemId: updatedRow.item.id,
          quantity: stockToUpdate.quantity,
        })
      )
      const updatedApprovalData = approvalDataState.map((item) =>
        item.transactionNo === updatedRow.transactionNo ? updatedRow : item
      )
      setApprovalDataState(updatedApprovalData)
      showToast.success("Successfully updated stock transaction ")
    } catch (error) {
      showToast.error("Error updating stock transaction ")
    }
  }

  const handleUpdateStockOut = async (updatedRow: any) => {
    const stockToUpdate = {
      remarks: updatedRow.remarks,
      quantity: updatedRow.quantity,
      transactionNo: updatedRow.transactionNo,
      status: updatedRow.status,
    }

    try {
      await updateStockOut(stockToUpdate)
      dispatch(
        rawMatsStockOut({
          itemId: updatedRow.stockIn.item.id,
          quantity: stockToUpdate.quantity,
        })
      )
      const updatedApprovalData = stockOutDataState.map((item) =>
        item.transactionNo === updatedRow.transactionNo ? updatedRow : item
      )

      setApprovalDataState(updatedApprovalData)
      showToast.success("Successfully updated stock transaction ")
    } catch (error) {
      showToast.success("Eroor updating stock transaction ")
    }
  }

  const [selectedStatus, setSelectedStatus] = useState<string>("pending")

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedStatus(event.target.value)
  }

  if (isError) {
    return (
      <section className='text-center flex flex-col justify-center items-center h-96'>
        <FaExclamationTriangle className='text-red-900 text-6xl mb-4' />
        <h1 className='text-6xl font-bold mb-4'>Error Fetching Data</h1>
        <p className='text-xl mb-5 text-primary'>
          Please contact your administrator
        </p>
      </section>
    )
  }

  if (stockInData?.length === 0) {
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

  const stockOutColums = stockOutColumn({
    stockOutFields,

    onUpdate: handleUpdateStockOut,
  })

  return (
    <>
      <div className='flex flex-col h-full'>
        <div className='flex items-center justify-end'>
          <IoIosClose className='cursor-pointer' size={30} onClick={close} />
        </div>

        <div className='border-b border-[#14aff1] pb-2'>
          <div className='flex justify-center items-center'>
            <h1 className='font-bold text-center mb-2'>APPROVAL LIST</h1>
          </div>
          <div>
            <div className='flex gap-5 items-center justify-center mb-2'>
              <button
                onClick={() => setTab("stockIn")}
                className={`${
                  tab === "stockIn" ? "border-[#14aff1]" : "border-white"
                } px-2 py-1 border-b hover:border-[#14aff1] uppercase font-bold`}
              >
                Stock In
              </button>
              <button
                onClick={() => setTab("stockOut")}
                className={`${
                  tab === "stockOut" ? "border-[#14aff1]" : "border-white"
                } px-2 py-1 border-b  hover:border-[#14aff1] uppercase font-bold`}
              >
                Stock Out
              </button>
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
                  value='approved'
                  checked={selectedStatus === "approved"}
                  onChange={handleStatusChange}
                  className='mr-2 cursor-pointer'
                />
                Approved
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
        </div>

        {isLoading ? (
          <Spinner />
        ) : tab === "stockIn" ? (
          <Table
            data={
              selectedStatus === "pending"
                ? draftItems
                : selectedStatus === "approved"
                ? approvedItems
                : cancelItems
            }
            columns={columns}
            search={true}
            withImport={false}
            withExport={true}
            withSubmit={false}
            withCancel={false}
            add={false}
            view={false}
            sorting={[{ id: "transactionNo", desc: true }]}
          />
        ) : (
          <Table
            data={
              selectedStatus === "pending"
                ? stockOutDraftItems
                : selectedStatus === "approved"
                ? stockOutApprovedItems
                : stockOutCancelItems
            }
            columns={stockOutColums}
            search={true}
            withImport={false}
            withExport={true}
            withSubmit={false}
            withCancel={false}
            add={false}
            view={false}
            sorting={[{ id: "transactionNo", desc: true }]}
          />
        )}
      </div>
    </>
  )
}

export default ApprovalTable
