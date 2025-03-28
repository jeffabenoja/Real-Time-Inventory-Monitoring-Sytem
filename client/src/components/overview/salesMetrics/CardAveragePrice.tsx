import { IoIosTrendingUp } from "react-icons/io"
import { IoIosTrendingDown } from "react-icons/io"

interface CardAveragePriceProps {
  averageItemPrice: number
}
const CardAveragePrice: React.FC<CardAveragePriceProps> = ({
  averageItemPrice,
}) => {
  const isPositiveChange = averageItemPrice > 0
  return (
    <div className='flex justify-between items-center mb-6 px-2.5 mt-5 shadow-md rounded-md'>
      <div className='text-lg font-medium'>
        <p className='text-[10px] md:text-xs text-gray-400'>Average Price</p>
        <div className='flex flex-col md:flex-row gap-1'>
          <span className='text-xl md:text-2xl font-extrabold'>
            {(() => {
              if (averageItemPrice >= 1000000) {
                return `P${(averageItemPrice / 1000000).toFixed(2)}M`
              } else if (averageItemPrice >= 1000) {
                return `P${(averageItemPrice / 1000).toFixed(0)}K`
              }
              return `P${averageItemPrice.toFixed(2)}`
            })()}
          </span>
          <span
            className={`text-[10px] md:text-sm ${
              isPositiveChange ? "text-green-500" : "text-red-500"
            }`}
          >
            {isPositiveChange ? (
              <IoIosTrendingUp className='inline w-4 h-4 mr-1' />
            ) : (
              <IoIosTrendingDown className='inline w-4 h-4 mr-1' />
            )}
            Price
          </span>
        </div>
      </div>
    </div>
  )
}

export default CardAveragePrice
