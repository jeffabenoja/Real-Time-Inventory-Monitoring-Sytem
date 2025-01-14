import React from "react";
import ReactDOM from "react-dom";
import { ImCross } from "react-icons/im";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const overlayRoot = document.getElementById("overlay")!;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow-lg w-[570px] p-6">
        <div className="absolute top-3 right-3">
          <ImCross size={15} onClick={onClose} className="cursor-pointer"/>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>,
    overlayRoot
  );
};

export default Modal;