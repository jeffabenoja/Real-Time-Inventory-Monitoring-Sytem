export const generateRandomBatchNumber = (idNumber: string) => {
  const currentDate = new Date()

  const day = String(currentDate.getDate()).padStart(2, "0")
  const month = String(currentDate.getMonth() + 1).padStart(2, "0")
  const year = String(currentDate.getFullYear()).slice(2, 4)

  const dateStr = `${month}${day}${year}`
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase()

  const randomBatchNumber = `BT${randomStr}${dateStr}${idNumber}`

  return randomBatchNumber
}
