import { ReactNode } from "react";

interface TooltipProps {
  text: string;
  children: ReactNode;
  width?: string;
}

export default function Tooltip({ text, children, width }: TooltipProps) {
  return (
    <div className="relative group inline-block">
      {children}
      <div className={`absolute hidden lg:block bottom-full mb-2 ${width ? width : "w-28"} text-xs bg-primary text-white rounded-md p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-normal break-words overflow-visible`}>
        {text}
      </div>
    </div>
  );
}