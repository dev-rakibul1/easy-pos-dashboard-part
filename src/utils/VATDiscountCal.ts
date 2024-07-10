import { IPurchase, ISell } from '@/types'

interface CalculatedValues {
  vatAmount: number
  discountedAmount: number
  finalAmount: number
}

interface Totals {
  discountAmount: string
  vatAmount: string
  totalPrice: string
}

// Function to calculate VAT and apply discount for sales
export function calculatePriceWithVAT(data: ISell[]): Totals {
  const isDataArray = data || []

  const calculateValues = (item: ISell): CalculatedValues => {
    const vatAmount = (item.vats / 100) * item.sellingPrice
    const discountedAmount = (item?.discounts / 100) * item.sellingPrice
    const finalAmount = item.sellingPrice + vatAmount - discountedAmount
    return {
      vatAmount,
      discountedAmount,
      finalAmount,
    }
  }

  // Calculate values for each item
  const calculatedValues = isDataArray.map(calculateValues)

  const totals = calculatedValues.reduce(
    (acc, item) => {
      acc.discountAmount += item.discountedAmount
      acc.vatAmount += item.vatAmount
      acc.totalPrice += item.finalAmount
      return acc
    },
    { discountAmount: 0, vatAmount: 0, totalPrice: 0 }
  )

  return {
    discountAmount: totals.discountAmount.toFixed(2),
    vatAmount: totals.vatAmount.toFixed(2),
    totalPrice: totals.totalPrice.toFixed(2),
  }
}

// Function to calculate VAT and apply discount for purchases
export function purchaseCalculatePriceWithVAT(data: IPurchase[]): Totals {
  const isDataArray = data || []

  const calculateValues = (item: IPurchase): CalculatedValues => {
    const vatAmount = (item.vats / 100) * item.purchaseRate!
    const discountedAmount = (item.discounts / 100) * item.purchaseRate!
    const finalAmount = item.purchaseRate! + vatAmount - discountedAmount
    return {
      vatAmount,
      discountedAmount,
      finalAmount,
    }
  }

  // Calculate values for each item
  const calculatedValues = isDataArray.map(calculateValues)

  const totals = calculatedValues.reduce(
    (acc, item) => {
      acc.discountAmount += item.discountedAmount
      acc.vatAmount += item.vatAmount
      acc.totalPrice += item.finalAmount
      return acc
    },
    { discountAmount: 0, vatAmount: 0, totalPrice: 0 }
  )

  return {
    discountAmount: totals.discountAmount.toFixed(2),
    vatAmount: totals.vatAmount.toFixed(2),
    totalPrice: totals.totalPrice.toFixed(2),
  }
}
