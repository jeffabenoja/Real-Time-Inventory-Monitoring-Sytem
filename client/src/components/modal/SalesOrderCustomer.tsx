import { createColumnHelper } from "@tanstack/react-table"
import Table from "../common/table/Table"
import { CustomerType } from "../../type/salesType"
const customerFields = [
  { key: "name", label: "Customer Name", classes: "capitalize" },
  { key: "address", label: "Address", classes: "capitalize" },
  { key: "contactPerson", label: "Contact Person", classes: "capitalize" },
  { key: "contactNumber", label: "Telephone Number" },
  { key: "status", label: "Unit", classes: "capitalize" },
]
const CustomerColumns = ({
  customerFields,
}: {
  customerFields: { key: string; label: string; classes?: string }[]
}) => {
  const columnHelper = createColumnHelper<any>()

  return [
    columnHelper.accessor("select", {
      id: "select",
      header: () => <span className='truncate'>Select</span>,
      cell: ({ row }) => (
        <input
          type='checkbox'
          checked={row.getIsSelected()}
          onChange={() => row.toggleSelected()}
          className='w-4 h-4 cursor-pointer'
        />
      ),
    }),
    ...customerFields.map((field) =>
      columnHelper.accessor(field.key, {
        cell: (info) => (
          <span className={`${field.classes}`}>{info.getValue()}</span>
        ),
        header: () => <span className='truncate'>{field.label}</span>,
      })
    ),
  ]
}

interface CustomerSalesProps {
  customerData: CustomerType[]
  onSubmit: (inventoryProductPerItem: CustomerType[]) => void
  toggleModal: () => void
}

const SalesOrderCustomer: React.FC<CustomerSalesProps> = ({
  customerData,
  onSubmit,
  toggleModal,
}) => {
  const customerColumn = CustomerColumns({
    customerFields,
  })
  return (
    <>
      <h1 className='text-md mb-1'>Customer</h1>
      <div className='border-t border-[#14aff1] pt-2'>
        <Table
          data={customerData}
          columns={customerColumn}
          search={true}
          withImport={false}
          withExport={false}
          withSubmit={true}
          withCancel={true}
          add={false}
          view={false}
          handleSubmit={onSubmit}
          toggleModal={toggleModal}
        />
      </div>
    </>
  )
}

export default SalesOrderCustomer
