import { CustomerType } from "../../type/salesType"
import { getCustomerList } from "../../api/services/customer"
import { useQuery } from "@tanstack/react-query"

const useCustomerHook = () => {
  const { data, isLoading, isError } = useQuery<CustomerType[]>({
    queryKey: ["customer"],
    queryFn: getCustomerList,
  })

  return {
    data,
    isLoading,
    isError,
  }
}

export default useCustomerHook
