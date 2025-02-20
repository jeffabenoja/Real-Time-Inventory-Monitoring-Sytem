import { createColumnHelper } from "@tanstack/react-table"
import { FaExclamationTriangle } from "react-icons/fa"
import Table from "./table/Table"
import Spinner from "./utils/Spinner"
import { useAssembleList } from "../../hooks/stock/useAssembleList"
import { useState } from "react"
import CustomModal from "./utils/CustomModal"
import { AssembleTransaction } from "../../type/stockType"
import UpdateAssemble from "../modal/UpdateAssemble"
import { CiEdit } from "react-icons/ci"

const fields = [
  { key: "transactionNo", label: "Transaction Number", classes: "uppercase" },
  { key: "batchNo", label: "Batch Number", classes: "uppercase" },
  { key: "finishProduct.code", label: "Product Code", classes: "uppercase" },
  {
    key: "finishProduct.description",
    label: "Product Name",
    classes: "uppercase",
  },
  { key: "assemble_quantity", label: "Quantity" },
  { key: "status", label: "Status", classes: "uppercase" },
]
type AssembleTableProps = {
  itemId: string
}

const Columns = ({
  fields,
  onUpdate,
}: {
  fields: { key: string; label: string; classes?: string }[]
  onUpdate: (item: AssembleTransaction) => void
}) => {
  const columnHelper = createColumnHelper<any>()

  return [
    ...fields.map((field) =>
      columnHelper.accessor(field.key, {
        cell: (info) => {
          const value = info.getValue()
          return <span className={`${field.classes}`}>{value ?? "-"}</span>
        },
        header: () => <span className='truncate'>{field.label}</span>,
      })
    ),

    // Add the actions column
    columnHelper.accessor("actions", {
      id: "actions",
      cell: (info) => (
        <div className='flex gap-2 items-center justify-center w-[150px] lg:w-full'>
          {/* Update Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onUpdate(info.row.original)
            }}
            className='py-2 px-4 bg-gray-200 hover:bg-gray-300 hover:text-blue-700 rounded-md shadow-md'
          >
            <CiEdit size={20} />
          </button>
        </div>
      ),
      header: () => <span className='text-center truncate'>Actions</span>,
    }),
  ]
}

const ViewAssembleTable = ({ itemId }: AssembleTableProps) => {
  const {
    data: assembleData = [],
    isLoading,
    isError,
  } = useAssembleList(itemId)
  const [openModal, setOpenModal] = useState<boolean>()
  const [assembleDataUpdate, setAssembleDataUpdate] =
    useState<AssembleTransaction | null>(null)

  const handleModalUpdate = () => {
    setOpenModal((prev) => !prev)
  }

  const handleUpdate = (row: AssembleTransaction) => {
    handleModalUpdate()
    setAssembleDataUpdate(row)
  }

  const columns = Columns({
    fields,
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

  if (assembleData.length === 0) {
    return (
      <section className='text-center flex flex-col justify-center items-center h-96'>
        <FaExclamationTriangle className='text-red-900 text-6xl mb-4' />
        <h1 className='text-6xl font-bold mb-4'>
          No transaction data available
        </h1>
      </section>
    )
  }

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <h1 className='font-bold text-xl pb-2 border-b border-[#14aff1]'>
            Transaction Stock for{" "}
            <span className='uppercase text-[#14aff1]'>
              {assembleData[0]?.finishProduct?.code}
            </span>
          </h1>
          <Table
            data={assembleData}
            columns={columns}
            sorting={[{ id: "transactionNo", desc: true }]}
            search={true}
            withImport={false}
            withExport={false}
            withSubmit={false}
            withCancel={false}
            add={false}
            view={false}
          />
        </>
      )}
      {openModal && (
        <CustomModal classes='h-[420px] lg:h-[510px] md:p-8 w-[343px] md:w-[860px]'>
          <UpdateAssemble row={assembleDataUpdate} close={handleModalUpdate} />
        </CustomModal>
      )}
    </>
  )
}

export default ViewAssembleTable
