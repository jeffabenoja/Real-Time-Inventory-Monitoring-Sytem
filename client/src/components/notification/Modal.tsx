import { ReactNode } from "react";
import PageTitle from "../common/utils/PageTitle";

interface Props {
    children: ReactNode
}
export default function Modal({children} : Props) {
  return (
    <div className="bg-white shadow-lg w-[440px] max-h-[672px] z-50 p-5 rounded hidden md:flex md:flex-col gap-4 overflow-y-auto scrollbar">
      <PageTitle>Notifications</PageTitle>
      {children}
    </div>
  );
}