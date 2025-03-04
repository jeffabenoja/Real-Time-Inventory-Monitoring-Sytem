interface SalesCostCircleProps {
  salesPercentage: number
  costPercentage: number
}

const SalesCostCircle: React.FC<SalesCostCircleProps> = ({
  salesPercentage,
  costPercentage,
}) => {
  const circleRadius = 50
  const circleCircumference = 2 * Math.PI * circleRadius

  const strokeDashoffset =
    circleCircumference - (circleCircumference * salesPercentage) / 100

  return (
    <div className='flex flex-col row-span-6 shadow-md rounded-2xl bg-[#FAFAFA] px-5'>
      <div className='flex justify-between items-center px-2.5 pt-5 mb-2'>
        <h2 className='text-lg font-semibold '>Sales vs Cost Percentages</h2>
      </div>
      <hr />

      <div className='flex justify-between flex-1'>
        <svg width='250' height='250' viewBox='0 0 120 120'>
          <circle
            cx='60'
            cy='60'
            r={circleRadius}
            fill='none'
            stroke='#ddd'
            strokeWidth='7'
          />

          <circle
            cx='60'
            cy='60'
            r={circleRadius}
            fill='none'
            stroke='#10B981'
            strokeWidth='7'
            strokeDasharray={circleCircumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap='round'
            transform='rotate(-90 60 60)'
          />

          <text
            x='50%'
            y='50%'
            textAnchor='middle'
            dominantBaseline='middle'
            className='text-xl font-semibold text-gray-800'
          >
            {`${salesPercentage.toFixed(2)}%`}
          </text>
        </svg>

        <span className='text-sm ml-2 text-red-500'>
          Cost: {costPercentage.toFixed(2)}%
        </span>
      </div>
    </div>
  )
}

export default SalesCostCircle
