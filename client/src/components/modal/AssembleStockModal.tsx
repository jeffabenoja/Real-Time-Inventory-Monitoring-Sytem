import { useState } from "react"
import { IoIosClose } from "react-icons/io"
import CustomModal from "../common/utils/CustomModal"
import AddStocksFinishedProduct from "./AddStockFinishedProduct"
import AssembleHistory from "../common/AssembleHistory"
import { ItemType } from "../../type/itemType"
import StockOutAssembleTable from "../common/StockOutAssembleTable"
import StockCardTable from "../common/StockCardTable"
import { useSelector } from "react-redux"
import { RootState } from "../../store"

interface AssembleStockModalProps {
  product: ItemType | null
  close: () => void
}

const AssembleStockModal: React.FC<AssembleStockModalProps> = ({
  product,
  close,
}) => {
  const [addStockState, setAddStockState] = useState<boolean>(false)
  const [removedStockState, setRemovedStockState] = useState<boolean>(false)
  const [viewStockCard, setViewStockCard] = useState<boolean>(false)
  const [viewApproval, setViewApproval] = useState<boolean>(false)
  const groupCode = useSelector(
    (state: RootState) => state.auth.user?.userGroup.code
  );

  const handleAddToggle = () => {
    setAddStockState((prev) => !prev)
  }
  const handleRemovedToggle = () => {
    setRemovedStockState((prev) => !prev)
  }
  const handleApprovalToggle = () => {
    setViewApproval((prev) => !prev)
  }
  const handleStockCardToggle = () => {
    setViewStockCard((prev) => !prev)
  }

  return (
    <>
      <div className='flex flex-col gap-6'>
        <div className='flex items-center justify-between border-b border-[#14aff1] pb-1 font-bold'>
          <h3>
            Stock for {product?.code} - {product?.description}
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
            onClick={handleStockCardToggle}
            className='bg-gray-200 rounded-md py-2.5 w-[100px] text-xs text-center'
          >
            Stock Card
          </button>

          {(groupCode === "APPROVER" || groupCode === "ADMIN" || groupCode === "MANAGER") && <button
            type='button'
            onClick={handleApprovalToggle}
            className='bg-gray-200 rounded-md py-2.5 w-[100px] text-xs text-center'
          >
            Approval
          </button>}
        </div>
      </div>
      {addStockState && (
        <CustomModal>
          <AddStocksFinishedProduct product={product} toggleModal={close} />
        </CustomModal>
      )}
      {removedStockState && (
        <CustomModal classes='md:h-[480px] md:p-8 w-full h-full md:w-[970px]'>
          <AssembleHistory itemId={product?.id || ""} close={close} />
        </CustomModal>
      )}

      {viewStockCard && (
        <CustomModal classes='md:h-[480px] md:p-8 w-full h-full md:w-[970px]'>
          <StockCardTable itemId={product?.id || ""} close={close} />
        </CustomModal>
      )}

      {viewApproval && (
        <CustomModal classes='md:h-[480px] md:p-8 w-full h-full md:w-[970px]'>
          <StockOutAssembleTable productId={product?.id || ""} close={close} />
        </CustomModal>
      )}
    </>
  )
}

export default AssembleStockModal
