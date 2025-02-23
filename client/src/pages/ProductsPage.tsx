import Table from "../components/common/table/Table"
import Spinner from "../components/common/utils/Spinner"
import PageTitle from "../components/common/utils/PageTitle"
import usePageTitle from "../hooks/usePageTitle"
import { useState } from "react"
import CustomModal from "../components/common/utils/CustomModal"
import AddItems from "../components/modal/AddItems"
import ProductColumns from "../components/common/table/ProductColumns"
import { useItemComponents } from "../hooks/items/useItemComponents"
import { FaExclamationTriangle } from "react-icons/fa"
import { ItemType } from "../type/itemType"
import { Navigate } from "react-router-dom"
import AddStocksFinishedProduct from "../components/modal/AddStockFinishedProduct"
import ViewItemStock from "../components/modal/ViewItemStock"
import InventoryTable from "../components/common/InventoryTable"
import ViewAssembleTable from "../components/common/ViewAssembleTable"

const fields = [
  { key: "code", label: "Product Code", classes: "uppercase" },
  { key: "description", label: "Product Name", classes: "capitalize" },
  { key: "brand", label: "Brand", classes: "uppercase" },
  { key: "unit", label: "Unit", classes: "lowercase" },
  { key: "reorderPoint", label: "Stock Level" },
  { key: "status", label: "Status", classes: "uppercase" },
]

const ProductsPage = () => {
  usePageTitle("Products")

  const [isOpenAdd, setIsOpenAdd] = useState<boolean>(false)
  const [isOpenUpdate, setIsOpenUpdate] = useState<boolean>(false)
  const [isAddStock, setIsAddStock] = useState<boolean>(false)
  const [isOpenInventory, setIsOpenInventory] = useState<boolean>(false)
  const [isUpdateStock, setIsUpdateStock] = useState<boolean>(false)
  const [productData, setProductData] = useState<ItemType | null>(null)
  const [itemId, setItemId] = useState<string>("")
  const [isViewItemInventory, setIsViewItemInventory] = useState<boolean>(false)
  const { data, isLoading, isError, updateItem, isPendingUpdate } =
    useItemComponents()

  const handleModalAdd = () => {
    setIsOpenAdd((prev) => !prev)
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

  const columns = ProductColumns({
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
      <PageTitle>Products Page</PageTitle>
      {isLoading ? (
        <Spinner />
      ) : (
        <Table
          data={data || []}
          columns={columns}
          search={true}
          withImport={false}
          withExport={true}
          add={true}
          view={true}
          toolTip='Inventory List'
          handleAdd={handleModalAdd}
          handleUpdate={handleUpdate}
          handleView={handleModalViewInventory}
        />
      )}

      {isOpenAdd && <Navigate to='/dashboard/products/create/components' />}

      {isOpenUpdate && (
        <CustomModal>
          <AddItems
            title={"Finished Goods"}
            isProduct={true}
            isOnSubmit={updateItem}
            isLoading={isPendingUpdate}
            toggleModal={handleModalUpdate}
            productData={productData}
          />
        </CustomModal>
      )}
      {/* Stocking functionality  */}
      {isAddStock && (
        <CustomModal>
          <AddStocksFinishedProduct
            product={productData}
            toggleModal={handleAddStockToggle}
          />
        </CustomModal>
      )}
      {isUpdateStock && (
        <CustomModal
          toggleModal={handleUpdateStockToggle}
          classes='h-[480px] md:p-8 w-[343px] md:w-[970px]'
        >
          <ViewAssembleTable itemId={itemId} />
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
          <InventoryTable category='Finished Goods' />
        </CustomModal>
      )}
    </>
  )
}

export default ProductsPage
