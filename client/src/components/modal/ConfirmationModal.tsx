import { IoIosInformationCircleOutline } from "react-icons/io"
import CustomModal from "../common/utils/CustomModal"

interface ConfirmationModalProps {
  option?: boolean
  children: React.ReactNode
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  option,
  children,
}) => {
  return (
    <CustomModal classes='w-[300px]'>
      <div className='px-2 py-1 flex flex-col justify-between gap-4 items-center'>
        <IoIosInformationCircleOutline size={24} />
        {option && (
          <p className='text-xs text-center'>We don't have enough stock.</p>
        )}
        <p className='text-xs text-center'>
          Are you sure, you want to proceed?
        </p>
        <div className='flex gap-2.5 items-center justify-between'>
          {children}
        </div>
      </div>
    </CustomModal>
  )
}

export default ConfirmationModal
