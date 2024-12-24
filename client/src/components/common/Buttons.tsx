import React from "react"

// Define the props for the component
interface CustomButtonProps {
  type?: "button" | "submit" | "reset"
  label: string // Button label
  Icon: React.ComponentType<{ className?: string; size?: number }>
  onClick?: () => void
  className?: string
}

const CustomButton: React.FC<CustomButtonProps> = ({
  type = "button",
  label,
  Icon,
  onClick,
  className = "",
}) => {
  return (
    <button
      type={type}
      className={`px-2 py-1 bg-white border border-gray-300 rounded-md flex items-center hover:bg-gray-50 ${className}`}
      onClick={onClick}
    >
      <Icon className='md:mr-2' size={18} />
      <span className='hidden md:block'>{label}</span>
    </button>
  )
}

export default CustomButton
