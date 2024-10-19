'use client'

import { useGetAllAdditionalExpenseByCurrentMonthQuery } from '@/redux/api/additionalExpense/additionalExpenseApi'
import { useGetAllPurchaseByCurrentMonthQuery } from '@/redux/api/purchaseApi/PurchaseApi'
import { useGetAllReturnsByCurrentMonthQuery } from '@/redux/api/returnApi/returnApi'
import { useGetSellByCurrentMonthQuery } from '@/redux/api/sells/sellsApi'
import { Spin } from 'antd'

import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { Line } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

// Helper function: Generate an array of dates for the current month
const getDaysInMonth = () => {
  const now = dayjs()
  const daysInMonth = now.daysInMonth()
  return Array.from({ length: daysInMonth }, (_, i) =>
    now.startOf('month').add(i, 'day').format('YYYY-MM-DD')
  )
}

// Define type for chart data points
// Type for individual chart data points
interface ChartDataPoint {
  date: string
  amount: number
}

// Redux API Response Types
interface ISell {
  createdAt: string
  totalSellPrice: number
}

interface IPurchase {
  createdAt: string
  totalPrice: number
}

interface IReturn {
  createdAt: string
  price: number
}

interface IExpense {
  createdAt: string
  expenseAmount: number
}

// Main SalesLineChart Component
const SalesLineChart = () => {
  const [chartData, setChartData] = useState<any>(null)

  const { data: sales } = useGetSellByCurrentMonthQuery({ limit: 100 })
  const { data: purchase } = useGetAllPurchaseByCurrentMonthQuery({
    limit: 100,
  })
  const { data: returns } = useGetAllReturnsByCurrentMonthQuery({ limit: 100 })
  const { data: additionalExpense } =
    useGetAllAdditionalExpenseByCurrentMonthQuery({ limit: 100 })

  // @ts-ignore
  const salesInfo = useMemo<ChartDataPoint[]>(() => {
    if (!sales) return []
    // @ts-ignore
    const groupedByDate = sales.reduce<Record<string, number>>(
      (acc: any, data: ISell) => {
        const date = dayjs(data.createdAt).format('YYYY-MM-DD')
        acc[date] = (acc[date] || 0) + data.totalSellPrice
        return acc
      },
      {}
    )
    return Object.entries(groupedByDate).map(([date, amount]) => ({
      date,
      amount,
    }))
  }, [sales])
  // @ts-ignore
  const purchaseInfo = useMemo<ChartDataPoint[]>(() => {
    if (!purchase?.purchases) return []
    // @ts-ignore
    const groupedByDate = purchase?.purchases?.reduce<Record<string, number>>(
      (acc: any, data: IPurchase) => {
        const date = dayjs(data.createdAt).format('YYYY-MM-DD')
        acc[date] = (acc[date] || 0) + data.totalPrice
        return acc
      },
      {}
    )
    return Object.entries(groupedByDate).map(([date, amount]) => ({
      date,
      amount,
    }))
  }, [purchase])

  const returnInfo = useMemo<ChartDataPoint[]>(() => {
    if (!returns?.returns) return []
    return returns.returns.map((data: any) => ({
      date: dayjs(data.createdAt).format('YYYY-MM-DD'),
      amount: data.price,
    }))
  }, [returns])

  // const additionalCost = useMemo<ChartDataPoint[]>(() => {
  //   if (!additionalExpense?.expenses) return []
  //   // @ts-ignore
  //   return additionalExpense?.expenses?.map(
  //     (data: {
  //       createdAt: string | number | dayjs.Dayjs | Date | null | undefined
  //       expenseAmount: any
  //     }) => ({
  //       date: dayjs(data.createdAt).format('YYYY-MM-DD'),
  //       amount: data.expenseAmount,
  //     })
  //   )
  // }, [additionalExpense])

  // @ts-ignore
  const additionalCost = useMemo<ChartDataPoint[]>(() => {
    if (!additionalExpense) return []
    // @ts-ignore
    const groupedByDate = additionalExpense?.expenses?.reduce<
      Record<string, number>
    >((acc: any, data: IExpense) => {
      const date = dayjs(data.createdAt).format('YYYY-MM-DD')
      acc[date] = (acc[date] || 0) + data.expenseAmount
      return acc
    }, {})
    return Object.entries(groupedByDate).map(([date, amount]) => ({
      date,
      amount,
    }))
  }, [additionalExpense])

  useEffect(() => {
    const labels = getDaysInMonth()

    const mapDataToDays = (data: ChartDataPoint[]) =>
      labels.map(date => {
        const entry = data.find(item => item.date === date)
        return entry ? entry.amount : 0
      })

    const salesDataset = mapDataToDays(salesInfo)
    const purchaseDataset = mapDataToDays(purchaseInfo)
    const returnDataset = mapDataToDays(returnInfo)
    const costDataset = mapDataToDays(additionalCost)

    setChartData({
      labels,
      datasets: [
        {
          label: 'Sales',
          data: salesDataset,
          borderColor: 'lime',
          backgroundColor: 'rgba(0, 255, 0, 0.2)',
          borderWidth: 2,
          fill: true,
        },
        {
          label: 'Purchases',
          data: purchaseDataset,
          borderColor: 'royalblue',
          backgroundColor: 'rgba(65, 105, 225, 0.2)',
          borderWidth: 2,
          fill: true,
        },
        {
          label: 'Return',
          data: returnDataset,
          borderColor: 'magenta',
          backgroundColor: 'rgba(255, 0, 255, 0.2)',
          borderWidth: 2,
          fill: true,
        },
        {
          label: 'A. Cost',
          data: costDataset,
          borderColor: 'rgb(250, 84, 28)',
          backgroundColor: 'rgba(250, 84, 28, 0.2)',
          borderWidth: 2,
          fill: true,
        },
      ],
    })
  }, [salesInfo, purchaseInfo, returnInfo, additionalCost])

  if (!chartData)
    return (
      <div>
        <Spin size="small" />
      </div>
    )

  return (
    <div>
      <Line
        data={chartData}
        options={{
          animation: {
            duration: 2000, // Duration of each animation cycle in ms
            loop: false, // Loop the animation infinitely
            easing: 'easeInOutQuad', // Optional: Animation easing function
          },
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                usePointStyle: true,
                color: '#000',
                font: {
                  size: 12,
                  //   family: 'Arial',
                  weight: 200,
                },
              },
            },
            title: {
              display: true,
              text: 'Monthly Sales, Purchases, Returns, and Costs',
              color: '#FF6384',
              font: {
                size: 16,
                // family: 'Arial',
                weight: 200,
              },
            },
            tooltip: {
              backgroundColor: '#fff',
              titleColor: '#000',
              bodyColor: '#000',
              borderColor: 'lime',
              borderWidth: 1,
              cornerRadius: 4,
              padding: 10,
              titleFont: {
                size: 14,
                weight: 'bold',
                family: 'Arial',
              },
              bodyFont: {
                size: 12,
                // family: 'Arial',
              },
              // @ts-ignore
              titleColor: '#FF6384',
              // @ts-ignore
              bodyColor: '#000',
            },
          },
          elements: {
            line: {
              tension: 0.15, // Smoothing effect for line curves
            },
          },
        }}
      />
    </div>
  )
}

export default SalesLineChart
