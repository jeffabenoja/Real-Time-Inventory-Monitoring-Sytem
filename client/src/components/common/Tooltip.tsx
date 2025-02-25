import { ReactNode, useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"

interface TooltipProps {
  text: string
  children: ReactNode
  width?: string
}

export default function Tooltip({ text, children, width }: TooltipProps) {
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [visible, setVisible] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (visible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
      })
    }
  }, [visible])

  return (
    <>
      <div
        ref={triggerRef}
        className='inline-block relative'
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        {children}
      </div>

      {visible &&
        createPortal(
          <div
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
            }}
            className={`absolute ${width ? width : "max-w-28"} text-xs text-center bg-primary text-white rounded-md p-2 shadow-lg z-50 whitespace-normal break-words hidden lg:block`}
          >
            {text}
          </div>,
          document.getElementById('tooltip')!
        )}
    </>
  )
}