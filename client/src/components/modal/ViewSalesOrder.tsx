import { SalesOrderType } from "../../type/salesType"
import Table from "../common/table/Table"
import { createColumnHelper } from "@tanstack/react-table"

const itemFields = [
  { key: "item.code", label: "Product Code", classes: "uppercase" },
  { key: "item.description", label: "Product Name", classes: "capitalize" },
  { key: "item.category", label: "Category", classes: "capitalize" },
  { key: "item.brand", label: "Brand", classes: "uppercase" },
  { key: "item.unit", label: "Unit", classes: "lowercase" },
  { key: "orderQuantity", label: "Quantity" },
  { key: "itemPrice", label: "Price" },
  { key: "amount", label: "Total Amount" },
]

const Columns = ({
  itemFields,
}: {
  itemFields: { key: string; label: string; classes?: string }[]
}) => {
  const columnHelper = createColumnHelper<any>()

  return [
    ...itemFields.map((field) =>
      columnHelper.accessor(field.key, {
        cell: (info) => (
          <span className={`${field.classes}`}>{info.getValue()}</span>
        ),
        header: () => <span className='truncate'>{field.label}</span>,
      })
    ),
  ]
}

interface ViewSalesOrderProps {
  row: SalesOrderType | null
}
const ViewSalesOrder: React.FC<ViewSalesOrderProps> = ({ row }) => {
  const columns = Columns({
    itemFields,
  })

  return (
    <div className='max-w-full mx-auto'>
      <div className='flex justify-between items-center'>
        <h1 className='mb-2 font-bold'>Order Number: {row?.salesorderNo}</h1>
        <p className='text-xs'>
          Created Date:{" "}
          {row?.createdDateTime
            ? new Date(row.createdDateTime).toLocaleDateString("en-US")
            : "N/A"}
        </p>
      </div>
      <div className='pt-4 px-2 border-t border-[#14aff1] flex flex-col gap-5'>
        <div className='flex gap-5 items-center justify-between'>
          <div className='flex items-center gap-2 w-[300px]'>
            <label htmlFor='customer' className='text-sm'>
              Customer:
            </label>
            <input
              id='customer'
              type='text'
              name='customer'
              value={row?.customer.name}
              readOnly
              autoComplete='off'
              className={`w-full p-2 rounded-md border outline-transparent bg-transparent text-xs
                    focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
            />
          </div>
          <div className='flex items-center gap-2 '>
            <label htmlFor='contactPerson' className='text-sm '>
              Contact Person:
            </label>
            <input
              id='contactPerson'
              type='text'
              name='contactPerson'
              value={row?.customer.contactPerson}
              readOnly
              autoComplete='off'
              className={`p-2 rounded-md border outline-transparent bg-transparent text-xs
                    focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
            />
          </div>
          <div className='flex items-center gap-2 '>
            <label htmlFor='contactNumber' className='text-sm'>
              Contact Number:
            </label>
            <input
              id='contactNumber'
              type='text'
              name='contactNumber'
              value={row?.customer.contactNumber}
              readOnly
              autoComplete='off'
              className={`p-2 rounded-md border outline-transparent bg-transparent text-xs
                    focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
            />
          </div>
        </div>
        <div className='flex items-center gap-2 '>
          <label htmlFor='contactAddress' className='text-sm '>
            Customer Address:
          </label>
          <div className='flex-1'>
            <input
              id='contactAddress'
              type='text'
              name='contactAddress'
              value={row?.customer.address}
              readOnly
              autoComplete='off'
              className={`w-full p-2 rounded-md border outline-transparent bg-transparent text-xs
                    focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
            />
          </div>
        </div>
        <div className='flex gap-5 items-center justify-between'>
          <div className='flex items-center gap-2 '>
            <label htmlFor='orderDate' className='text-sm '>
              Order Date:
            </label>
            <div className='flex-1'>
              <input
                id='orderDate'
                type='text'
                name='orderDate'
                value={row?.orderDate}
                readOnly
                autoComplete='off'
                className={`w-full p-2 rounded-md border outline-transparent bg-transparent text-xs
                    focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
              />
            </div>
          </div>

          <div className='flex items-center gap-2 flex-1 '>
            <label htmlFor='remarks' className='text-sm '>
              Remarks:
            </label>
            <div className='flex-1'>
              <input
                id='remarks'
                type='text'
                name='remarks'
                readOnly
                value={row?.remarks}
                className={`w-full p-2 rounded-md border outline-transparent bg-transparent text-xs
                    focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
              />
            </div>
          </div>
        </div>
      </div>

      <Table
        data={row?.details || []}
        columns={columns}
        search={true}
        withImport={false}
        withExport={false}
        withSubmit={false}
        withCancel={false}
        add={false}
        view={false}
      />
    </div>
  )
}

export default ViewSalesOrder
