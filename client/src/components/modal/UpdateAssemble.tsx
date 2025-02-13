import { AssembleTransaction } from "../../type/stockType"
import { useState } from "react"

interface UpdateAssembleProps {
  row: AssembleTransaction | null
  close: () => void
}
const UpdateAssemble: React.FC<UpdateAssembleProps> = ({ row, close }) => {
  const [assembleUpdate, setAssembleUpdate] = useState({
    remarks: row?.remarks,
    finishProduct: row?.finishProduct,
    assemble_quantity: row?.assemble_quantity,
    batchNo: row?.batchNo,
    status: row?.status,
  })

  return (
    <div className='max-w-full mx-auto'>
      <div className='flex justify-between items-center'>
        <h1 className='mb-2 font-bold'>Order Number: {row?.transactionNo}</h1>
        <p className='text-xs'>
          Created Date:{" "}
          {row?.createdDateTime
            ? new Date(row.createdDateTime).toLocaleDateString("en-US")
            : "N/A"}
        </p>
      </div>
      <form onSubmit={() => {}}>
        <div className='pt-4 px-2 border-t border-[#14aff1] flex flex-col gap-5'>
            
        </div>
      </form>
    </div>
  )
}

export default UpdateAssemble
