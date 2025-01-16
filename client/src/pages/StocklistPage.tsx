import Table from "../components/common/Table"
import { createColumnHelper } from "@tanstack/react-table"
import Spinner from "../components/common/Spinner"
import { useQuery } from "@tanstack/react-query"
import PageTitle from "../components/common/PageTitle"
import { getItemListByCategoryRawMats } from "../api/services/item"
import { ItemType } from "../type/itemType"
import { useState } from "react"
import CustomModal from "../components/common/CustomModal"
import AddItems from "../components/modal/AddItems"

const columnHelper = createColumnHelper<any>()

const columns = [
  columnHelper.accessor("code", {
    cell: (info) => info.getValue(),
    header: () => <span className='flex items-center truncate'>Code</span>,
  }),

  columnHelper.accessor("description", {
    cell: (info) => info.getValue(),
    header: () => (
      <span className='flex items-center truncate'>Description</span>
    ),
  }),

  columnHelper.accessor("category", {
    cell: (info) => info.getValue(),
    header: () => <span className='flex items-center truncate'>Category</span>,
  }),

  columnHelper.accessor("brand", {
    cell: (info) => info.getValue(),
    header: () => <span className='flex items-center truncate'>Brand</span>,
  }),

  columnHelper.accessor("unit", {
    cell: (info) => info.getValue(),
    header: () => <span className='flex items-center truncate'>Unit</span>,
  }),

  columnHelper.accessor("reorderPoint", {
    cell: (info) => info.getValue(),
    header: () => (
      <span className='flex items-center truncate'>Re-ordering Point</span>
    ),
  }),

  columnHelper.accessor("price", {
    cell: (info) => info.getValue(),
    header: () => <span className='flex items-center truncate'>Price</span>,
  }),

  columnHelper.accessor("cost", {
    cell: (info) => info.getValue(),
    header: () => <span className='flex items-center truncate'>Price</span>,
  }),

  columnHelper.accessor("status", {
    cell: (info) => info.getValue(),
    header: () => <span className='flex items-center truncate'>Status</span>,
  }),
]

const StocklistPage = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { data, isLoading } = useQuery<ItemType[]>({
    queryKey: ["Items"],
    queryFn: getItemListByCategoryRawMats,
  })

  const handleModalToggle = () => {
    setIsOpen((prev) => !prev)
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
            toggleModal={handleModalToggle}
          />
        </CustomModal>
      )}
    </div>
  )
}

export default StocklistPage
