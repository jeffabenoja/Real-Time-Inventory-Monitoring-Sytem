import { ReactNode, MouseEvent } from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";

interface CustomModalProps {
  classes?: string;
  closeModal: () => void;
  children: ReactNode;
  desktopCross?: boolean
  noPadding?:boolean 
}

export default function CustomModalV2({
  classes,
  closeModal,
  children,
  desktopCross,
  noPadding
}: CustomModalProps) {
  const overlayRoot = document.getElementById("overlay");

  if (!overlayRoot) return null;

  return createPortal(
    <div
      className={`${!noPadding && "lg:pl-64"} fixed left-0 right-0 bottom-0 top-0 bg-[rgba(0,0,0,0.2)] z-50 flex items-center justify-center max-h-screen scrollbar-hide overflow-y-auto`}
    >
      <div
        onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        className={`${
          classes ? classes : "relative md:p-8 md:w-[480px]"
        } h-screen w-screen md:h-auto px-6 bg-white dark:bg-secondary-600 rounded-md overflow-hidden overflow-y-auto scrollbar flex flex-col justify-center md:block`}
      > 
        <IoClose className={`absolute top-4 right-4 cursor-pointer ${!desktopCross && "md:hidden"} md:top-2 md:right-2`} size={24} onClick={closeModal} />
        {children}
      </div>
    </div>,
    overlayRoot
  );
}
