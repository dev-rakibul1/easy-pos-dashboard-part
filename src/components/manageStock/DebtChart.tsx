import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

const COLORS = ['#EC1F24', '#F16621', '#FDBA13']

type IPayloads = {
  totalPrice: number
  dueAmount: number
  totalPay: number
}

type Props = {
  paymentPayloads: IPayloads
}

const DebtChart = ({ paymentPayloads: amount }: Props) => {
  const data = [
    { name: 'Due amount', value: amount?.dueAmount },
    { name: 'Total pay', value: amount?.totalPay },
    { name: 'Total price', value: amount?.totalPrice },
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

export default DebtChart
