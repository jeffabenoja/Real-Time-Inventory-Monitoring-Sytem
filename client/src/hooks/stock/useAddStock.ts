import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  addStock,
  addStockForFinishedGoods,
  stockOuts,
  stockOutsAssemble,
} from "../../api/services/stock"
import { showToast } from "../../utils/Toast"

// Type Guard to check if error is an AxiosError

export interface StockType {
  transactionDate: string
  remarks: string
  item: { code: string }
  quantity: string
  batchNo: string
  expiryDate: string
}

export const useAddStock = () => {
  const queryClient = useQueryClient()

  const stockMutation = useMutation({
    mutationFn: addStock,
    onSuccess: () => {
      // Refetch the list of items
      queryClient.invalidateQueries({ queryKey: ["Stock", "Raw Mats"] })
      showToast.success("Successfully added new stock")
    },
    onError: () => {
      let message = "Error adding stock for this item"

      showToast.error(message)
    },
  })

  const addStockMutation = useMutation({
    mutationFn: addStockForFinishedGoods,
    onSuccess: () => {
      // Refetch the list of items
      queryClient.invalidateQueries({ queryKey: ["Stock", "Finished Goods"] })
      showToast.success("Successfully added new stock")
    },
    onError: () => {
      let message = "Insufficient stock for raw materials"

      showToast.error(message)
    },
  })

  const stockOutMutation = useMutation({
    mutationFn: stockOuts,
    onSuccess: () => {
      // Refetch the list of items
      queryClient.invalidateQueries({ queryKey: ["StockOut", "Raw Mats"] })
      showToast.success("Successfully removed this item")
    },
    onError: () => {
      let message = "Error removing this item"

      showToast.error(message)
    },
  })

  const stockOutAssembleMutation = useMutation({
    mutationFn: stockOutsAssemble,
    onSuccess: () => {
      // Refetch the list of items
      queryClient.invalidateQueries({ queryKey: ["Stock", "Finished Goods"] })
      showToast.success("Successfully removed this item")
    },
    onError: () => {
      let message = "Error removing this item"

      showToast.error(message)
    },
  })

  return {
    addStock: stockMutation.mutate,
    isPending: stockMutation.isPending,
    addStockFinishGoods: addStockMutation.mutate,
    isPendingFinishedGoods: addStockMutation.isPending,
    stockOut: stockOutMutation.mutate,
    stockOutPending: stockOutMutation.isPending,
    stockOutAssemble: stockOutAssembleMutation.mutate,
    stockOutAssemblePending: stockOutAssembleMutation.isPending,
  }
}

export const useAddStocksMutation = (usercode: string, token: string) => {
  return useMutation<PromiseSettledResult<any>[], Error, StockType[]>({
    mutationFn: (stocks: StockType[]) => {
      const promises = stocks.map((stock) => {
        const convertedStock = {
          ...stock,
          quantity: Number(stock.quantity), // convert quantity from string to number
        }
        return addStock({ stock: convertedStock, usercode, token })
      })
      return Promise.allSettled(promises)
    },
  })
}
