import apiClient from "../../utils/apiClient"
import { PREDICT } from "../urls/predictionUrl"

export const getPredictions = async () => {
    const response = await apiClient.get(PREDICT)
  
    return response.data
}