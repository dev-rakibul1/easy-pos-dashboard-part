import { ISell } from '@/types'

export const calculateProfit = (
  sells: ISell[],
  expenseAmount: number = 0 // Default value of 0 for expenseAmount
): { profits: number[]; totalProfit: number; totalCost: number } => {
  const profits = sells?.map(sell => {
    const discountAmount = (sell?.sellingPrice * sell?.discounts) / 100
    const vatAmount = (sell?.sellingPrice * sell?.vats) / 100
    const balanceAfterVat = sell?.sellingPrice + vatAmount - discountAmount
    const profit = balanceAfterVat - sell?.purchaseRate
    const profitToFixed = parseFloat(profit.toFixed(2))

    return profitToFixed
  })

  const totalProfit =
    profits?.reduce((acc, profit) => acc + profit, 0) - expenseAmount
  const totalCost =
    sells?.reduce((acc, sell) => acc + sell?.purchaseRate, 0) + expenseAmount

  return { profits, totalProfit, totalCost }
}
