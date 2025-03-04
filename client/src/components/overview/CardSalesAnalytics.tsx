import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

type CardSalesAnalyticsProps = {
  salesData: { month: string; sales: number }[]
}

const CardSalesAnalytics = ({ salesData }: CardSalesAnalyticsProps) => {
  return (
    <div className='row-span-3 xl:row-span-6 bg-gray-white shadow-md rounded-2xl bg-[#FAFAFA]'>
      <div>
        <h2 className='text-lg font-semibold mb-2 px-7 pt-5'>
          12 Months Sales Analytics Summary
        </h2>
        <hr />
      </div>

      <ResponsiveContainer width='100%' height={450} className='px-7'>
        <AreaChart
          data={salesData}
          margin={{ top: 0, right: 0, left: -10, bottom: 0 }}
        >
          <XAxis dataKey='month' tick={{ fontSize: 10, dx: -1 }} />
          <YAxis
            tickFormatter={(value) => {
              if (value >= 1000000) {
                return `P${(value / 1000000).toFixed(1)}M`
              } else if (value >= 1000) {
                return `P${(value / 1000).toFixed(0)}K`
              }
              return `P${value}`
            }}
            tick={{ fontSize: 12, dx: -1 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            formatter={(value) => {
              const numericValue = Number(value)
              if (!isNaN(numericValue)) {
                const formattedValue = new Intl.NumberFormat("en-PH", {
                  style: "currency",
                  currency: "PHP",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(numericValue)
                return [formattedValue]
              }
              return [value]
            }}
            labelFormatter={(label) => label}
          />

          <Area
            type='linear'
            dataKey='sales'
            stroke='#3182CE'
            fill='#63B3ED'
            dot={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CardSalesAnalytics
