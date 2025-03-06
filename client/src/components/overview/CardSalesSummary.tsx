import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface CardSalesSummaryProps {
  salesData: { month: string; sales: number }[]
}

const CardSalesSummary = ({ salesData }: CardSalesSummaryProps) => {
  return (
    <div className='row-span-3 xl:row-span-6 bg-gray-white shadow-md rounded-2xl bg-[#FAFAFA]'>
      <>
        <div>
          <h2 className='text-lg font-semibold mb-2 px-7 pt-5'>
            Sales Summary for the Past 6 Months
          </h2>
          <hr />
        </div>

        <ResponsiveContainer width='100%' height={450} className='px-7'>
          <BarChart
            data={salesData}
            margin={{ top: 0, right: 0, left: -25, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray='' vertical={false} />
            <XAxis dataKey='month' tick={{ fontSize: 12, dx: -1 }} />
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
              formatter={(totalValue: number) => [
                `P${totalValue.toLocaleString("en")}`,
              ]}
              labelFormatter={(label) => label}
            />
            <Bar dataKey='sales' fill='#3182CE' barSize={45} />
          </BarChart>
        </ResponsiveContainer>
      </>
    </div>
  )
}

export default CardSalesSummary
