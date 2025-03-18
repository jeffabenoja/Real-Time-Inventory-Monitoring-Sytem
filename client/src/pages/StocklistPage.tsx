import Table from "../components/common/table/Table"
import StockListColumns from "../components/common/table/StockListColumns"
import Spinner from "../components/common/utils/Spinner"
import PageTitle from "../components/common/utils/PageTitle"
import { ItemType } from "../type/itemType"
import { useState } from "react"
import CustomModal from "../components/common/utils/CustomModal"
import AddItems from "../components/modal/AddItems"
import StockRawMatsModal from "../components/modal/StockRawMatsModal"
import { useItemMaterials } from "../hooks/items/useItemMaterials"
import { FaExclamationTriangle } from "react-icons/fa"
import CSVUploader from "../components/modal/CsvUploader"
import UpdateStockTable from "../components/common/UpdateStockTable"
import InventoryTable from "../components/common/InventoryTable"
import usePageTitle from "../hooks/usePageTitle"
import ApprovalTable from "../components/common/ApprovalTable"
import StockCardTable from "../components/common/StockCardTable"

const fields = [
  { key: "code", label: "Product Code", classes: "uppercase" },
  { key: "description", label: "Product Name", classes: "capitalize" },
  { key: "brand", label: "Brand", classes: "uppercase" },
  { key: "unit", label: "Unit", classes: "lowercase" },
  { key: "reorderPoint", label: "Restocking Point" },
  { key: "status", label: "Status", classes: "uppercase" },
]

const StocklistPage = () => {
  usePageTitle("Stocklist")

  const [isOpenAdd, setIsOpenAdd] = useState<boolean>(false)
  const [isOpenImport, setIsOpenImport] = useState<boolean>(false)
  const [isOpenUpdate, setIsOpenUpdate] = useState<boolean>(false)
  const [isOpenInventory, setIsOpenInventory] = useState<boolean>(false)
  const [isAddStock, setIsAddStock] = useState<boolean>(false)
  const [isUpdateStock, setIsUpdateStock] = useState<boolean>(false)
  const [isViewItemInventory, setIsViewItemInventory] = useState<boolean>(false)
  const [approval, setApproval] = useState<boolean>(false)
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

  const handleApprovalToggle = () => {
    setApproval((prev) => !prev)
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

  const columns = StockListColumns({
    fields,
    onUpdate: handleUpdate,
    onAdd: handleAddStock,
    onView: handleViewStock,
    onApproval: handleUpdateStock,
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
    <>
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
          approval={true}
          toolTip='Inventory List'
          handleAdd={handleModalAdd}
          handleImport={handleModalImport}
          handleView={handleModalViewInventory}
          handleApproval={handleApprovalToggle}
        />
      )}
      {isOpenAdd && (
        <CustomModal>
          <AddItems
            title={"Add Item"}
            isStocklist={true}
            isOnSubmit={createItem}
            isLoading={isPending}
            toggleModal={handleModalAdd}
          />
        </CustomModal>
      )}
      {isOpenUpdate && (
        <CustomModal>
          <AddItems
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
        <CustomModal>
          <StockRawMatsModal
            productId={productData?.id || ""}
            productCode={productData?.code || ""}
            productName={productData?.description || ""}
            close={handleAddStockToggle}
          />
        </CustomModal>
      )}
      {isUpdateStock && (
        <CustomModal
          toggleModal={handleUpdateStockToggle}
          classes='md:h-[480px] md:p-8 w-full h-full md:w-[970px]'
        >
          <UpdateStockTable itemId={itemId} close={handleUpdateStockToggle} />
        </CustomModal>
      )}

      {isViewItemInventory && (
        <CustomModal classes='md:h-[480px] md:p-8 w-full h-full md:w-[970px]'>
          <StockCardTable
            itemId={productData?.id || ""}
            close={handleViewStockToggle}
          />
        </CustomModal>
      )}

      {isOpenInventory && (
        <CustomModal classes='md:h-[480px] md:p-8 w-full h-full md:w-[970px]'>
          <InventoryTable
            category='Raw Mats'
            close={handleModalViewInventory}
          />
        </CustomModal>
      )}
      {approval && (
        <CustomModal classes='md:h-[480px] md:p-8 w-full h-full md:w-[970px]'>
          <ApprovalTable close={handleApprovalToggle} />
        </CustomModal>
      )}
    </>
  )
}

export default StocklistPage
