import { CustomerType } from "../../type/salesType"
import { getCustomerList, createNewCustomer } from "../../api/services/customer"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { showToast } from "../../utils/Toast"

const useCustomerHook = () => {
  const queryClient = useQueryClient()
  const { data, isLoading, isError } = useQuery<CustomerType[]>({
    queryKey: ["customer"],
    queryFn: getCustomerList,
  })

  // Add New Item Mutation
  const customerMutation = useMutation({
    mutationFn: createNewCustomer,
    onSuccess: () => {
      // Refetch the list of items
      queryClient.invalidateQueries({ queryKey: ["customer"] })
      showToast.success("Successfully added new customer")
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Error adding new customer"
      showToast.error(message)
    },
  })

  return {
    data,
    isLoading,
    isError,
    createCustomer: customerMutation.mutate,
    isPending: customerMutation.isPending,
  }
}

export default useCustomerHook
