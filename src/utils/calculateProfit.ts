import { ISell } from '@/types'

export const calculateProfit = (
  sells: ISell[]
): { profits: number[]; totalProfit: number; totalCost: number } => {
  const profits = sells?.map(sell => {
    const vatAmount = (sell?.sellingPrice * sell?.vats) / 100

    const balanceAfterVat = sell?.totalSellPrice - vatAmount
    const profit = balanceAfterVat - sell?.purchaseRate
    const profitToFixed = parseFloat(profit.toFixed(2))

    return profitToFixed
  })

  const totalProfit = profits?.reduce((acc, profit) => acc + profit, 0)
  const totalCost = sells?.reduce((acc, sell) => acc + sell?.purchaseRate, 0)

  return { profits, totalProfit, totalCost }
}
