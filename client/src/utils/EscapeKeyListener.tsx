import { useEffect } from "react"

interface EscapeKeyListenerProps {
  onEscape: () => void
}

const EscapeKeyListener: React.FC<EscapeKeyListenerProps> = ({ onEscape }) => {
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onEscape()
      }
    }

    window.addEventListener("keydown", handleEscKey)

    return () => {
      window.removeEventListener("keydown", handleEscKey)
    }
  }, [onEscape])

  return null
}

export default EscapeKeyListener
