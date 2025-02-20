import React, { ReactNode, MouseEvent } from "react"
import { createPortal } from "react-dom"

interface CustomModalProps {
  classes?: string
  toggleModal?: () => void
  children: ReactNode
}

const CustomModal: React.FC<CustomModalProps> = ({
  classes,
  toggleModal,
  children,
}) => {
  const overlayRoot = document.getElementById("overlay")

  if (!overlayRoot) return null

  return createPortal(
    <div
      onClick={toggleModal}
      className='lg:pl-64 fixed left-0 right-0 bottom-0 top-0 bg-[rgba(0,0,0,0.2)] z-50 flex items-center justify-center max-h-screen scrollbar-hide overflow-y-auto'
    >
      <div
        onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        className={`${
          classes ? classes : "md:p-8 w-[343px] md:w-[480px]"
        } p-6 bg-white dark:bg-secondary-600 rounded-md overflow-hidden overflow-y-auto  scrollbar`}
      >
        {/* Content */}
        {children}
      </div>
    </div>,
    overlayRoot
  )
}

export default CustomModal
