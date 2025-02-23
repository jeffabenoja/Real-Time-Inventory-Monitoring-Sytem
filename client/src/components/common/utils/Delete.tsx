import { ReactNode } from "react";

interface Props {
  closeModal: () => void;
  children: ReactNode;
  clicked: () => void;
  pending: boolean;
}
export function Delete({ children, closeModal, clicked, pending }: Props) {
  return (
    <div>
      <p className="text-base">
        Are you sure you want to delete{" "}
        <span className="font-bold">{children}</span>?
      </p>
      <div className="flex justify-center gap-4 pt-3">
        <button
          type="button"
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 active:bg-blue-500 transition duration-150 ease-in-out"
          onClick={closeModal}
        >
          Cancel
        </button>
        <button
          onClick={clicked}
          className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-200 active:bg-red-500 transition duration-150 ease-in-out"
          disabled={pending}
        >
            {!pending ? "Delete" : "Deleting..."}
        </button>
      </div>
    </div>
  );
}
