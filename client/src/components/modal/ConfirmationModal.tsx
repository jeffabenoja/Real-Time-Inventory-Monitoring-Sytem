import { IoIosInformationCircleOutline } from "react-icons/io"
import CustomModal from "../common/utils/CustomModal"

interface ConfirmationModalProps {
  children: React.ReactNode
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ children }) => {
  return (
    <CustomModal classes='w-[300px]'>
      <div className='px-2 py-1 flex flex-col justify-between gap-4 items-center'>
        <IoIosInformationCircleOutline size={24} />
        <p className='text-xs'>Are you sure, you want to proceed?</p>
        <div className='flex gap-2.5 items-center justify-between'>
          {children}
        </div>
      </div>
    </CustomModal>
  )
}

export default ConfirmationModal
