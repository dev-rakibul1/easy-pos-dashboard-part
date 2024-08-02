import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { IPurchaseStockType } from './StockIn'

const COLORS = ['#EC1F24', '#F16621', '#FDBA13', 'green']

type Props = {
  paymentPayloads: IPurchaseStockType
}

const StockChart = ({ paymentPayloads: amount }: Props) => {
  const data = [
    { name: 'Stock as selling price', value: amount?.sellingPrice },
    { name: 'Quantity', value: amount?.quantity },
    { name: 'Total stock', value: amount?.totalStockPrice },
    { name: 'Total', value: amount?.totalPrice },
  ]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          startAngle={180}
          endAngle={0}
          cx="50%"
          cy="50%"
          outerRadius={120} // Reduced outerRadius for smaller pie chart
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )
}

export default StockChart
