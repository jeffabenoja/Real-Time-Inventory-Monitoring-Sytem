import React, { useState } from "react"
import { showToast } from "../../utils/Toast"
import Papa from "papaparse"

interface CsvUploaderProps {
  isOnSubmit: (item: any) => void
  isLoading: boolean
  toggleModal: () => void
}

const CSVUploader: React.FC<CsvUploaderProps> = ({
  isOnSubmit,
  isLoading,
  toggleModal,
}) => {
  const [fileData, setFileData] = useState<Record<string, any>[] | null>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const parsedData = await handleFileChange(e)
      setFileData(parsedData)
    } catch (error) {
      console.error("Error parsing file:", error)
    }
  }

  const handleSubmit = () => {
    if (!fileData) {
      showToast.error("No data to submit. Please upload a file first.")
      return
    }

    const requiredFields: string[] = [
      "code",
      "description",
      "unit",
      "reorderPoint",
    ]

    // Validate each row in the uploaded data
    const invalidRows = fileData.filter((row) => {
      const emptyFields = requiredFields.filter((field) => !row[field])

      // Check if unit is valid
      const isUnitInvalid =
        row.unit.toLowerCase() !== "kg" && row.unit.toLowerCase() !== "pcs"

      return emptyFields.length > 0 || isUnitInvalid
    })

    if (invalidRows.length > 0) {
      showToast.error(
        `${invalidRows.length} row(s) have invalid or missing fields. Please fix them before submitting.`
      )
      return
    }

    // Prepare updated data with the category and brand fields
    const updatedData = fileData.map((row) => ({
      ...row,
      brand: row.brand || "N/A",
    }))

    // Check the length of updatedData
    if (updatedData.length > 1) {
      console.log("Multiple rows to submit:", updatedData)
    } else if (updatedData.length === 1) {
      isOnSubmit(updatedData[0])
      console.log(updatedData)
    } else {
      console.log("No data to submit.")
    }

    toggleModal()
  }

  const handleImportModal = () => {
    setFileData(null)
    ;(document.getElementById("file_input") as HTMLInputElement).value = ""
    toggleModal()
  }

  return (
    <div>
      <p className='mb-3 text-sm text-gray-700'>Upload CSV files.</p>
      <input
        className='file:p-2 file:border file:border-primary file:mr-2 w-full text-sm border file:font-medium border-gray-300 rounded-lg cursor-pointer file:bg-primary file:text-white focus:outline-none'
        id='file_input'
        type='file'
        onChange={(e) => handleFileUpload(e)}
      />
      <div className='flex gap-2 items-center'>
        <button
          className='w-28 rounded-md border-0 outline-transparent p-2 font-medium mt-3 cursor-pointer text-white bg-primary'
          onClick={handleSubmit}
        >
          {isLoading ? (
            <div className='w-5 h-5 border-2 border-t-2 border-[#0A140A] border-t-white rounded-full animate-spin'></div>
          ) : (
            "Submit"
          )}
        </button>
        <button
          className='w-28 rounded-md border-0 outline-transparent p-2 font-medium mt-3 cursor-pointer bg-gray-100 hover:bg-gray-300'
          onClick={handleImportModal}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

const handleFileChange = (
  e: React.ChangeEvent<HTMLInputElement>
): Promise<Record<string, any>[]> => {
  return new Promise((resolve, reject) => {
    const file = e.target.files ? e.target.files[0] : null
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: function (result) {
          try {
            const data = result.data as Record<string, any>[]

            const colArr: string[] = Object.keys(data[0])
            const valArr: any[] = data.map((dataRow) => Object.values(dataRow))

            const combinedData = valArr
              .map((values) => {
                const rowObject: { [key: string]: any } = {}
                colArr.forEach((col, idx) => {
                  rowObject[col] = values[idx]
                })
                return rowObject
              })
              .filter((row) => {
                return Object.values(row).some(
                  (value) => value !== undefined && value !== ""
                )
              })

            resolve(combinedData)
          } catch (error) {
            reject(error)
          }
        },
        error: function (error) {
          reject(error)
        },
      })
    } else {
      reject(new Error("No file selected"))
    }
  })
}

export default CSVUploader
