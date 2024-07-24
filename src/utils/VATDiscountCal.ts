import { IAdditionalExpense, IPurchase, ISell } from '@/types'

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

// ------------------------ADDITIONAL EXPENSE CALCULATION------------------------

// Calculate the total expense amount from an array of expenses
export function calculateTotalExpense(
  expenses: IAdditionalExpense[] | []
): number {
  return expenses.reduce((total, expense) => total + expense.expenseAmount, 0)
}

// ------------------------MONTHLY VATS CALCULATIONS------------------------
// import dayjs from 'dayjs'

// // Function to get the transactions and filter them based on the current month
// export const calculateMonthlyVat = async api => {
//   try {
//     // Fetch data from the API
//     const response = await api()
//     const transactions = response.data

//     // Get the current month
//     const now = dayjs()
//     const start = now.startOf('month')
//     const end = now.endOf('month')
//     const daysInMonth = end.date() - start.date() + 1

//     // Adjust the range based on the number of days in the month
//     const adjustedEnd = end.add(2, 'day')

//     // Format dates for comparison
//     const formattedStart = start.format('YYYY-MM-DD')
//     const formattedEnd = adjustedEnd.format('YYYY-MM-DD')

//     // Filter transactions within the current month
//     const filteredTransactions = transactions.filter(transaction => {
//       const createdAt = dayjs(transaction.createdAt)
//       const formattedCreatedAt = createdAt.format('YYYY-MM-DD')
//       return (
//         formattedCreatedAt >= formattedStart &&
//         formattedCreatedAt <= formattedEnd
//       )
//     })

//     return filteredTransactions
//   } catch (error) {
//     console.error('Error fetching or filtering transactions:', error)
//     return []
//   }
// }
