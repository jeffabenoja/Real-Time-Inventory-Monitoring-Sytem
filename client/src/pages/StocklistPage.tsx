import Table from "../components/common/table/Table"
import Columns from "../components/common/table/Columns"
import Spinner from "../components/common/utils/Spinner"
import PageTitle from "../components/common/utils/PageTitle"
import { ItemType } from "../type/itemType"
import { useState } from "react"
import CustomModal from "../components/common/utils/CustomModal"
import AddItems from "../components/modal/AddItems"
import AddStocksRawMats from "../components/modal/AddStockRawMats"
import { useItemMaterials } from "../hooks/items/useItemMaterials"
import { FaExclamationTriangle } from "react-icons/fa"
import CSVUploader from "../components/modal/CsvUploader"
import UpdateStockTable from "../components/common/UpdateStockTable"
import ViewItemStock from "../components/modal/ViewItemStock"
import InventoryTable from "../components/common/InventoryTable"

const fields = [
  { key: "code", label: "Product Code", classes: "uppercase" },
  { key: "description", label: "Product Name", classes: "capitalize" },
  { key: "category", label: "Category", classes: "capitalize" },
  { key: "brand", label: "Brand", classes: "uppercase" },
  { key: "unit", label: "Unit", classes: "lowercase" },
  { key: "reorderPoint", label: "Stock Level" },
  { key: "cost", label: "Cost" },
  { key: "status", label: "Status", classes: "lowercase" },
]

const StocklistPage = () => {
  const [isOpenAdd, setIsOpenAdd] = useState<boolean>(false)
  const [isOpenImport, setIsOpenImport] = useState<boolean>(false)
  const [isOpenUpdate, setIsOpenUpdate] = useState<boolean>(false)
  const [isOpenInventory, setIsOpenInventory] = useState<boolean>(false)
  const [isAddStock, setIsAddStock] = useState<boolean>(false)
  const [isUpdateStock, setIsUpdateStock] = useState<boolean>(false)
  const [isViewItemInventory, setIsViewItemInventory] = useState<boolean>(false)
  const [productData, setProductData] = useState<ItemType | null>(null)
  const [itemId, setItemId] = useState<string>("")

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

  const handleUpdateStock = async (item: ItemType) => {
    handleUpdateStockToggle()
    setItemId(item.id ?? "")
  }

  const handleAddStock = (item: ItemType) => {
    handleAddStockToggle()
    setProductData(item)
  }

  const handleViewStockToggle = () => {
    setIsViewItemInventory((prev) => !prev)
  }

  const handleViewStock = (item: ItemType) => {
    handleViewStockToggle()
    setProductData(item)
  }

  const handleModalViewInventory = () => {
    setIsOpenInventory((prev) => !prev)
  }

  const columns = Columns({
    fields,
    onUpdate: handleUpdateStock,
    onAdd: handleAddStock,
    onView: handleViewStock,
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
          handleView={handleModalViewInventory}
        />
      )}
      {isOpenAdd && (
        <CustomModal toggleModal={handleModalAdd}>
          <AddItems
            title={"Materials"}
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
      {/* Stocking functionality  */}
      {isAddStock && (
        <CustomModal toggleModal={handleAddStockToggle}>
          <AddStocksRawMats
            productCode={productData?.code || ""}
            productName={productData?.description || ""}
            toggleModal={handleAddStockToggle}
          />
        </CustomModal>
      )}
      {isUpdateStock && (
        <CustomModal
          toggleModal={handleUpdateStockToggle}
          classes='h-[480px] md:p-8 w-[343px] md:w-[970px]'
        >
          <UpdateStockTable itemId={itemId} />
        </CustomModal>
      )}

      {isViewItemInventory && (
        <CustomModal toggleModal={handleViewStockToggle}>
          <ViewItemStock product={productData} />
        </CustomModal>
      )}

      {isOpenInventory && (
        <CustomModal
          toggleModal={handleModalViewInventory}
          classes='h-[480px] md:p-8 w-[343px] md:w-[970px]'
        >
          <InventoryTable category='Raw Mats' />
        </CustomModal>
      )}
    </div>
  )
}

export default StocklistPage
