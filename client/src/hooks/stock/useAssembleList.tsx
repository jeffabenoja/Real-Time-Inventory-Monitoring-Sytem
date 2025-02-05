import { useQuery } from "@tanstack/react-query"
import { getAssemblePerItem } from "../../api/services/stock"
import { AssembleStock } from "../../type/StockType"

export const useAssembleList = (id: string) => {
  // Fetch Finished Goods
  const { data, isLoading, isError } = useQuery<AssembleStock[]>({
    queryKey: ["Stock", "Raw Mats"],
    queryFn: () => getAssemblePerItem(id),
    retry: 0,
    enabled: !!id,
  })

  return {
    data,
    isLoading,
    isError,
  }
}
