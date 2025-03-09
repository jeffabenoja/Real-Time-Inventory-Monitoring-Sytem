import { useEffect } from "react"
import { useLocation } from "react-router-dom"

const usePageTitle = (title: string) => {
  const location = useLocation()

  useEffect(() => {
    document.title = `${title} | E&L Delicatessen`
  }, [location, title])
}

export default usePageTitle
