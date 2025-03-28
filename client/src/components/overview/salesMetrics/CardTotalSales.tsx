import { IoIosTrendingUp } from "react-icons/io"
import { IoIosTrendingDown } from "react-icons/io"

interface CardTotalSalesProps {
  totalSales: number
}

const CardTotalSales: React.FC<CardTotalSalesProps> = ({ totalSales }) => {
  const isPositiveChange = totalSales > 0
  return (
    <div className='flex justify-between items-center mb-6 px-2.5 mt-5 shadow-md rounded-md'>
      <div className='text-lg font-medium'>
        <p className='text-[10px] md:text-xs text-gray-400'>Total Sales</p>
        <div className='flex flex-col md:flex-row gap-1'>
          <span className='text-xl md:text-2xl font-extrabold'>
            {totalSales.toLocaleString()}
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
            Sales
          </span>
        </div>
      </div>
    </div>
  )
}

export default CardTotalSales
