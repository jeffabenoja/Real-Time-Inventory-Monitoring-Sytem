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

const fields = [
  { key: "code", label: "Code" },
  { key: "description", label: "Description" },
  { key: "category", label: "Category" },
  { key: "brand", label: "Brand" },
  { key: "unit", label: "Unit" },
  { key: "reorderPoint", label: "Re-ordering Point" },
  { key: "status", label: "Status" },
]

const handleUpdate = (item: ItemType) => {
  console.log("Update Item:", item)
}

const handleDelete = (item: ItemType) => {
  console.log("Delete Item:", item)
}

const columns = Columns({
  fields,
  onUpdate: handleUpdate,
  onDelete: handleDelete,
})

const StocklistPage = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const { data, isLoading, isError, createItem, isPending } = useItemMaterials()

  const handleModalToggle = () => {
    setIsOpen((prev) => !prev)
  }

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
          handleAdd={handleModalToggle}
        />
      )}

      {isOpen && (
        <CustomModal toggleModal={handleModalToggle}>
          <AddItems
            title={"Raw Materials"}
            isStocklist={true}
            isOnSubmit={createItem}
            isLoading={isPending}
            toggleModal={handleModalToggle}
          />
        </CustomModal>
      )}
    </div>
  )
}

export default StocklistPage
