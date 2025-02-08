import { createColumnHelper } from "@tanstack/react-table"
import Table from "../common/table/Table"
import { CustomerType } from "../../type/salesType"
import useCustomerHook from "../../hooks/customer/useCustomerHook"
import { FaExclamationTriangle } from "react-icons/fa"
import Spinner from "../common/utils/Spinner"
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
  onSubmit: (inventoryProductPerItem: CustomerType[]) => void
  toggleModal: () => void
}

const SalesOrderCustomer: React.FC<CustomerSalesProps> = ({
  onSubmit,
  toggleModal,
}) => {
  const { data: customerData = [], isLoading, isError } = useCustomerHook()
  const customerColumn = CustomerColumns({
    customerFields,
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
      <h1 className='text-md mb-1'>Customer</h1>
      <div className='border-t border-[#14aff1] pt-2'>
        {isLoading ? (
          <Spinner />
        ) : (
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
        )}
      </div>
    </>
  )
}

export default SalesOrderCustomer
