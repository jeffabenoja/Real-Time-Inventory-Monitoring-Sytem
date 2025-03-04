import { IoIosTrendingUp } from "react-icons/io"
import { IoIosTrendingDown } from "react-icons/io"

interface CardSalesRevenueProps {
  totalValueSum: number
  averageChangePercentage: number
}

const CardSalesRevenue: React.FC<CardSalesRevenueProps> = ({
  totalValueSum,
  averageChangePercentage,
}) => {
  const isPositiveChange = totalValueSum > 0
  return (
    <div className='flex justify-between items-center mb-6 px-2.5 mt-5 shadow-md rounded-md'>
      <div className='text-lg font-medium'>
        <p className='text-xs text-gray-400'>Sales Revenue</p>
        <span className='text-2xl font-extrabold'>
          {(() => {
            if (totalValueSum >= 1000000) {
              return `P${(totalValueSum / 1000000).toFixed(2)}M`
            } else if (totalValueSum >= 1000) {
              return `P${(totalValueSum / 1000).toFixed(0)}K`
            }
            return `P${totalValueSum}`
          })()}
        </span>
        <span
          className={`text-sm ml-2 ${
            isPositiveChange ? "text-green-500" : "text-red-500"
          }`}
        >
          {isPositiveChange ? (
            <IoIosTrendingUp className='inline w-4 h-4 mr-1' />
          ) : (
            <IoIosTrendingDown className='inline w-4 h-4 mr-1' />
          )}
          {averageChangePercentage.toFixed(2)}%
        </span>
      </div>
    </div>
  )
}

export default CardSalesRevenue
