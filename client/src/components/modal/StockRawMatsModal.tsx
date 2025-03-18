import { useState } from "react"
import { IoIosClose } from "react-icons/io"
import CustomModal from "../common/utils/CustomModal"
import AddStocksRawMats from "./AddStockRawMats"
// import StockOutRawMats from "./StockOutRawMats"
import StockOutTable from "../common/StockOutTable"
import StockInHistory from "../common/StockInHistory"

interface StockRawMatsProps {
  productId: string
  productCode: string
  productName: string
  close: () => void
}

const StockRawMatsModal: React.FC<StockRawMatsProps> = ({
  productId,
  productCode,
  productName,
  close,
}) => {
  const [addStockState, setAddStockState] = useState<boolean>(false)
  const [removedStockState, setRemovedStockState] = useState<boolean>(false)
  const [viewApproval, setViewApproval] = useState<boolean>(false)

  const handleAddToggle = () => {
    setAddStockState((prev) => !prev)
  }
  const handleRemovedToggle = () => {
    setRemovedStockState((prev) => !prev)
  }
  const handleApprovalToggle = () => {
    setViewApproval((prev) => !prev)
  }

  return (
    <>
      <div className='flex flex-col gap-6'>
        <div className='flex items-center justify-between border-b border-[#14aff1] pb-1'>
          <h3>
            Stock for {productCode} - {productName}
          </h3>
          <IoIosClose size={20} className='cursor-pointer' onClick={close} />
        </div>
        <div className='flex gap-6 items-center justify-center'>
          <button
            type='button'
            onClick={handleAddToggle}
            className='bg-gray-200 rounded-md py-2.5 text-xs w-[100px] text-center'
          >
            Add Stock
          </button>
          <button
            type='button'
            onClick={handleRemovedToggle}
            className='bg-gray-200 rounded-md py-2.5 w-[100px] text-xs text-center'
          >
            Remove Stock
          </button>

          <button
            type='button'
            onClick={handleApprovalToggle}
            className='bg-gray-200 rounded-md py-2.5 w-[100px] text-xs text-center'
          >
            Approval
          </button>
        </div>
      </div>
      {addStockState && (
        <CustomModal>
          <AddStocksRawMats
            productCode={productCode || ""}
            productName={productName || ""}
            toggleModal={close}
          />
        </CustomModal>
      )}
      {removedStockState && (
        <CustomModal classes='md:h-[480px] md:p-8 w-full h-full md:w-[970px]'>
          <StockInHistory itemId={productId || ""} close={close} />
        </CustomModal>
      )}

      {viewApproval && (
        <CustomModal classes='md:h-[480px] md:p-8 w-full h-full md:w-[970px]'>
          <StockOutTable productId={productId || ""} close={close} />
        </CustomModal>
      )}
    </>
  )
}

export default StockRawMatsModal
