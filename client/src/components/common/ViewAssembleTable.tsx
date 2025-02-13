import { createColumnHelper } from "@tanstack/react-table"
import { FaExclamationTriangle } from "react-icons/fa"
import Table from "./table/Table"
import Spinner from "./utils/Spinner"
import { useAssembleList } from "../../hooks/stock/useAssembleList"
import { useState } from "react"
import CustomModal from "./utils/CustomModal"
import { AssembleTransaction } from "../../type/stockType"
import UpdateAssemble from "../modal/UpdateAssemble"

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
]
type AssembleTableProps = {
  itemId: string
}

const Columns = ({
  fields,
}: {
  fields: { key: string; label: string; classes?: string }[]
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

  const columns = Columns({
    fields,
  })

  const handleModalUpdate = () => {
    setOpenModal((prev) => !prev)
  }

  const handleUpdate = (row: AssembleTransaction) => {
    handleModalUpdate()
    setAssembleDataUpdate(row)
  }

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
            handleUpdate={handleUpdate}
          />
        </>
      )}
      {openModal && (
        <CustomModal
          classes='h-[420px] lg:h-[520px] md:p-8 w-[343px] md:w-[860px]'
          toggleModal={handleModalUpdate}
        >
          <UpdateAssemble row={assembleDataUpdate} close={handleModalUpdate} />
        </CustomModal>
      )}
    </>
  )
}

export default ViewAssembleTable
