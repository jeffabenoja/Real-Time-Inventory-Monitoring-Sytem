import { SalesOrderType } from "../../type/salesType"
import Table from "../common/table/Table"
import { createColumnHelper } from "@tanstack/react-table"
import { IoIosArrowRoundBack } from "react-icons/io"
import EscapeKeyListener from "../../utils/EscapeKeyListener"

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
  close: () => void
}

const ViewSalesOrder: React.FC<ViewSalesOrderProps> = ({ row, close }) => {
  const columns = Columns({
    itemFields,
  })

  return (
    <div className='max-w-full mx-auto'>
      <EscapeKeyListener onEscape={close} />
      <div className='flex gap-2 md:justify-between items-center mb-2'>
        <IoIosArrowRoundBack
          className='md:hidden cursor-pointer'
          size={20}
          onClick={close}
        />
        <h1 className='font-bold text-sm md:text-base'>
          Order Number: {row?.salesorderNo}
        </h1>
        <p className='text-xs hidden md:block'>
          Created Date:{" "}
          {row?.createdDateTime
            ? new Date(row.createdDateTime).toLocaleDateString("en-US")
            : "N/A"}
        </p>
      </div>
      <div className='pt-4 px-2 border-t border-[#14aff1] flex flex-col gap-5'>
        <div className='flex flex-col md:flex-row gap-5 md:items-center md:justify-between'>
          <div className='flex items-center gap-2 md:w-[300px]'>
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
            <label htmlFor='contactPerson' className='text-sm w-[125px]'>
              Contact Person:
            </label>
            <div className='flex-1'>
              <input
                id='contactPerson'
                type='text'
                name='contactPerson'
                value={row?.customer.contactPerson}
                readOnly
                autoComplete='off'
                className={`w-full p-2 rounded-md border outline-transparent bg-transparent text-xs
                    focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
              />
            </div>
          </div>
          <div className='flex items-center gap-2 '>
            <label htmlFor='contactNumber' className='text-sm w-[125px]'>
              Contact Number:
            </label>
            <div className='flex-1'>
              <input
                id='contactNumber'
                type='text'
                name='contactNumber'
                value={row?.customer.contactNumber}
                readOnly
                autoComplete='off'
                className={`w-full p-2 rounded-md border outline-transparent bg-transparent text-xs
                    focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary`}
              />
            </div>
          </div>
        </div>
        <div className='flex items-center gap-2 '>
          <label htmlFor='contactAddress' className='text-sm w-[125px]'>
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
        <div className='flex flex-col md:flex-row gap-5 md:tems-center md:justify-between'>
          <div className='flex items-center gap-2 '>
            <label
              htmlFor='orderDate'
              className='text-sm w-[125px] md:w-[80px]'
            >
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
            <label htmlFor='remarks' className='text-sm w-[125px] md:w-[80px]'>
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
