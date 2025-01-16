import React, { ReactNode, MouseEvent } from "react"

interface CustomModalProps {
  toggleModal: () => void
  children: ReactNode
}

const CustomModal: React.FC<CustomModalProps> = ({ toggleModal, children }) => {
  return (
    <div
      onClick={toggleModal}
      className='fixed left-0 right-0 bottom-0 top-0 bg-[rgba(0,0,0,0.2)] z-20 flex items-center justify-center overflow-y-auto max-h-screen scrollbar-hide'
    >
      <div
        onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        className='p-6 md:p-8 w-[343px] md:w-[480px] bg-white dark:bg-secondary-600 rounded-md'
      >
        {/* Content */}
        {children}
      </div>
    </div>
  )
}

export default CustomModal
