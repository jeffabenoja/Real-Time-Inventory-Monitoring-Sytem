import { ItemType } from "../../type/itemType"
import { getInventoryPerItem } from "../../api/services/inventory"
import { InventoryPerItemType } from "../../type/stockType"
import { useQuery } from "@tanstack/react-query"
import Spinner from "../common/utils/Spinner"
import { FaExclamationTriangle } from "react-icons/fa"

interface AddStockProps {
  product: ItemType | null
}

const ViewItemStock: React.FC<AddStockProps> = ({ product }) => {
  const { data, isLoading, isError, isFetched } =
    useQuery<InventoryPerItemType>({
      queryKey: ["Item", "Finished Goods", "Raw Mats"],
      queryFn: () => {
        if (!product?.id) {
          return Promise.reject("Product ID is missing.")
        }
        return getInventoryPerItem(product.id)
      },
      enabled: !!product?.id,
    })

  if (isError) {
    return (
      <section className='text-center flex flex-col justify-center items-center'>
        <FaExclamationTriangle className='text-red-900 text-6xl mb-4' />
        <h1 className='text-xl font-bold mb-4'>Item not found in inventory.</h1>
      </section>
    )
  }

  const itemData = Array.isArray(data) ? data[0] : data

  return (
    <>
      {isLoading || !isFetched || product?.id !== itemData.item.id ? (
        <Spinner />
      ) : (
        <div className='flex flex-col gap-6'>
          <h3 className='border-b border-[#14aff1] pb-1 font-bold uppercase'>
            Stock for {itemData?.item.code}
          </h3>

          <div className='flex flex-col gap-2'>
            <label htmlFor='description' className='text-sm'>
              Product Name
            </label>
            <input
              id='description'
              type='text'
              name='description'
              value={itemData?.item.description}
              readOnly
              autoComplete='off'
              className='py-2 px-4 border border-secondary-200 border-opacity-25 rounded-md outline-transparent bg-transparent placeholder:text-sm focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary'
            />
          </div>

          <div className='flex justify-between items-center gap-2'>
            <div className='flex flex-col gap-2'>
              <label htmlFor='remarks' className='body-l'>
                In Quantity
              </label>
              <input
                id='remarks'
                type='text'
                name='onQuantity'
                readOnly
                value={itemData?.inQuantity - itemData?.outQuantity}
                autoComplete='off'
                className='w-[120px] md:w-[150px] py-1 pl-4 pr-1 border border-secondary-200 border-opacity-25 rounded-md outline-transparent bg-transparent focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary'
              />
            </div>

            <div className='flex flex-col gap-2'>
              <label htmlFor='outQuantity' className='text-sm'>
                Out Quantity
              </label>
              <input
                type='text'
                id='outQuantity'
                autoComplete='off'
                readOnly
                name='outQuantity'
                value={itemData?.outQuantity}
                className='w-[120px] md:w-[150px] py-1 pl-4 pr-1 border border-secondary-200 border-opacity-25 rounded-md outline-transparent bg-transparent focus:border-primary focus:outline-none active:border-primary active:outline-none hover:border-primary'
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ViewItemStock
