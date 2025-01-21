import Table from "../components/common/table/Table"
import Columns from "../components/common/table/Columns"
import Spinner from "../components/common/utils/Spinner"
import PageTitle from "../components/common/utils/PageTitle"
import { ItemType } from "../type/itemType"
import { useState } from "react"
import CustomModal from "../components/common/utils/CustomModal"
import AddItems from "../components/modal/AddItems"
import { useItemMaterials } from "../hooks/items/useItemMaterials"
import { FaExclamationTriangle } from "react-icons/fa"
import CSVUploader from "../components/modal/CsvUploader"

const fields = [
  { key: "code", label: "Code", classes: "uppercase" },
  { key: "description", label: "Description", classes: "capitalize" },
  { key: "category", label: "Category", classes: "capitalize" },
  { key: "brand", label: "Brand", classes: "uppercase" },
  { key: "unit", label: "Unit", classes: "lowercase" },
  { key: "reorderPoint", label: "Re-ordering Point" },
  { key: "cost", label: "Cost" },
  { key: "status", label: "Status", classes: "lowercase" },
]

const StocklistPage = () => {
  const [isOpenAdd, setIsOpenAdd] = useState<boolean>(false)
  const [isOpenImport, setIsOpenImport] = useState<boolean>(false)
  const [isOpenUpdate, setIsOpenUpdate] = useState<boolean>(false)
  const [isAddStock, setIsAddStock] = useState<boolean>(false)
  const [isUpdateStock, setIsUpdateStock] = useState<boolean>(false)
  const [productData, setProductData] = useState<ItemType | null>(null)
  const {
    data,
    isLoading,
    isError,
    createItem,
    isPending,
    updateItem,
    isPendingUpdate,
  } = useItemMaterials()

  const handleModalAdd = () => {
    setIsOpenAdd((prev) => !prev)
  }

  const handleModalImport = () => {
    setIsOpenImport((prev) => !prev)
  }

  const handleModalUpdate = () => {
    setIsOpenUpdate((prev) => !prev)
  }

  const handleUpdate = (row: ItemType) => {
    handleModalUpdate()
    setProductData(row)
  }

  /* Stock functionality */
  const handleAddStockToggle = () => {
    setIsAddStock((prev) => !prev)
  }
  const handleUpdateStockToggle = () => {
    setIsUpdateStock((prev) => !prev)
  }

  const handleUpdateStock = (item: ItemType) => {
    handleUpdateStockToggle()
    setProductData(item)
  }

  const handleAddStock = (item: ItemType) => {
    handleAddStockToggle()
    setProductData(item)
  }

  const columns = Columns({
    fields,
    onUpdate: handleUpdateStock,
    onAdd: handleAddStock,
  })

  if (isError) {
    return (
      <section className='text-center flex flex-col justify-center items-center h-96'>
        <FaExclamationTriangle className='text-red-900 text-6xl mb-4' />
        <h1 className='text-6xl font-bold mb-4'>Something went wrong</h1>
        <p className='text-xl mb-5 text-primary'>
          Please contact your administrator
        </p>
      </section>
    )
  }

  return (
    <div className='flex flex-col max-w-full mx-auto h-dynamic-sm lg:h-dynamic-lg px-4 lg:px-8 py-4'>
      <PageTitle>Stocklist Page</PageTitle>
      {isLoading ? (
        <Spinner />
      ) : (
        <Table
          data={data || []}
          columns={columns}
          search={true}
          withImport={true}
          withExport={true}
          add={true}
          view={true}
          handleAdd={handleModalAdd}
          handleImport={handleModalImport}
          handleUpdate={handleUpdate}
        />
      )}
      {isOpenAdd && (
        <CustomModal toggleModal={handleModalAdd}>
          <AddItems
            title={"Raw Materials"}
            isStocklist={true}
            isOnSubmit={createItem}
            isLoading={isPending}
            toggleModal={handleModalAdd}
          />
        </CustomModal>
      )}
      {isOpenUpdate && (
        <CustomModal toggleModal={handleModalUpdate}>
          <AddItems
            title={"Raw Materials"}
            isStocklist={true}
            isOnSubmit={updateItem}
            isLoading={isPendingUpdate}
            toggleModal={handleModalUpdate}
            productData={productData}
          />
        </CustomModal>
      )}
      {isOpenImport && (
        <CustomModal toggleModal={handleModalImport}>
          <CSVUploader
            isOnSubmit={createItem}
            isLoading={isPending}
            toggleModal={handleModalImport}
          />
        </CustomModal>
      )}
      /* Stocking functionality */
      {isAddStock && (
        <CustomModal toggleModal={handleAddStockToggle}>
          <h1>Add Stock</h1>
        </CustomModal>
      )}
      {isUpdateStock && (
        <CustomModal toggleModal={handleUpdateStockToggle}>
          <h1>Update Stock</h1>
        </CustomModal>
      )}
    </div>
  )
}

export default StocklistPage
