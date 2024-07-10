import { PAYMENT_TYPE } from '@/constants/role'

interface CustomerPurchase {
  totalPay?: number
  paymentType: string
}
interface SupplierSells {
  totalDue?: number
  totalPay: number
  totalSellAmounts?: number
  paymentType?: string
}
interface SupplierReturnPayments {
  totalDue?: number
  totalPay: number
  totalReturnAmount?: number
  paymentType?: string
}

interface CustomerPayInUser {
  payAmount?: number
  paymentType: string
}
interface PayInSupplier {
  payAmount?: number
  paymentType: string
}
interface AdditionalMoneyBack {
  payAmount?: number
  paymentType: string
}

interface SellGroupInfo {
  customerPurchase?: CustomerPurchase
  customerPayInUser?: CustomerPayInUser[]
}

interface PurchaseGroupInfo {
  supplierSells?: SupplierSells
  payInSupplier?: PayInSupplier[]
}
interface ReturnGroupInfo {
  supplierReturnPayments?: SupplierReturnPayments
  additionalMoneyBack?: AdditionalMoneyBack[]
}

// Function to calculate payment amounts based on payment type
const calculatePaymentAmount = (
  data: SellGroupInfo[] | undefined,
  paymentType: string
): number => {
  const allPaymentType = data?.map(payment => payment.customerPurchase)
  const filterPayment = allPaymentType?.filter(
    getBank => getBank?.paymentType === paymentType
  )
  const paymentAmount =
    filterPayment?.reduce((acc, item) => acc + (item?.totalPay || 0), 0) || 0

  const allAdditionalPaymentType = data?.flatMap(
    payment => payment.customerPayInUser ?? []
  )
  const getAdditionalPaymentMethod = allAdditionalPaymentType?.filter(
    getBank => getBank?.paymentType === paymentType
  )
  const additionalPaymentAmount =
    getAdditionalPaymentMethod?.reduce(
      (acc, item) => acc + (item?.payAmount || 0),
      0
    ) || 0

  const totalPayment = paymentAmount + additionalPaymentAmount
  // console.log(totalPayment)
  return totalPayment
}

// Calculate bank payment
export const bankPaymentCalculate = (
  data: SellGroupInfo[] | undefined
): number => {
  return calculatePaymentAmount(data, PAYMENT_TYPE.BANK_PAYMENT)
}

// Calculate hand cash payment
export const handPaymentCalculate = (
  data: SellGroupInfo[] | undefined
): number => {
  return calculatePaymentAmount(data, PAYMENT_TYPE.HAND_CASH)
}

// --------------Additional payments for sells----------------
export const additionalPaymentCalculate = (
  data: SellGroupInfo[] | undefined
) => {
  const allAdditionalPaymentType = data?.flatMap(
    payment => payment.customerPayInUser ?? []
  )

  const additionalPaymentAmount =
    allAdditionalPaymentType?.reduce(
      (acc, item) => acc + (item?.payAmount || 0),
      0
    ) || 0

  return additionalPaymentAmount
}

// Function to calculate payment amounts based on payment type
const calculatePurchasePaymentAmount = (
  data: PurchaseGroupInfo[] | undefined,
  paymentType: string
): number => {
  const allPaymentType = data?.map(payment => payment.supplierSells)
  const filterPayment = allPaymentType?.filter(
    getBank => getBank?.paymentType === paymentType
  )
  const paymentAmount =
    filterPayment?.reduce((acc, item) => acc + (item?.totalPay || 0), 0) || 0

  const allAdditionalPaymentType = data?.flatMap(
    payment => payment.payInSupplier ?? []
  )
  const getAdditionalPaymentMethod = allAdditionalPaymentType?.filter(
    getBank => getBank?.paymentType === paymentType
  )
  const additionalPaymentAmount =
    getAdditionalPaymentMethod?.reduce(
      (acc, item) => acc + (item?.payAmount || 0),
      0
    ) || 0

  const totalPayment = paymentAmount + additionalPaymentAmount
  // console.log(totalPayment)
  return totalPayment
}

// Calculate bank payment
export const bankPurchasePaymentCalculate = (
  data: PurchaseGroupInfo[] | undefined
): number => {
  return calculatePurchasePaymentAmount(data, PAYMENT_TYPE.BANK_PAYMENT)
}
// Calculate cash payment
export const cashPurchasePaymentCalculate = (
  data: PurchaseGroupInfo[] | undefined
): number => {
  return calculatePurchasePaymentAmount(data, PAYMENT_TYPE.HAND_CASH)
}

// --------------Additional payments for purchase----------------
export const additionalPaymentCalculateForPurchase = (
  data: PurchaseGroupInfo[] | undefined
) => {
  const allAdditionalPaymentType = data?.flatMap(
    payment => payment.payInSupplier ?? []
  )

  const additionalPaymentAmount =
    allAdditionalPaymentType?.reduce(
      (acc, item) => acc + (item?.payAmount || 0),
      0
    ) || 0

  return additionalPaymentAmount
}

// --------------RETURN INFORMATION-------------
// Function to calculate payment amounts based on payment type
const calculateReturnPaymentAmount = (
  data: ReturnGroupInfo[] | undefined,
  paymentType: string
): number => {
  const allPaymentType = data?.map(payment => payment.supplierReturnPayments)
  const filterPayment = allPaymentType?.filter(
    getBank => getBank?.paymentType === paymentType
  )
  const paymentAmount =
    filterPayment?.reduce((acc, item) => acc + (item?.totalPay || 0), 0) || 0

  // Additional payment calculate
  const allAdditionalPaymentType = data?.flatMap(
    payment => payment.additionalMoneyBack ?? []
  )
  const getAdditionalPaymentMethod = allAdditionalPaymentType?.filter(
    getBank => getBank?.paymentType === paymentType
  )
  const additionalPaymentAmount =
    getAdditionalPaymentMethod?.reduce(
      (acc, item) => acc + (item?.payAmount || 0),
      0
    ) || 0

  const totalPayment = paymentAmount + additionalPaymentAmount
  // console.log(totalPayment)
  return totalPayment
}

// Calculate bank payment
export const bankReturnPaymentCalculate = (
  data: ReturnGroupInfo[] | undefined
): number => {
  return calculateReturnPaymentAmount(data, PAYMENT_TYPE.BANK_PAYMENT)
}
// Calculate cash payment
export const cashReturnPaymentCalculate = (
  data: ReturnGroupInfo[] | undefined
): number => {
  return calculateReturnPaymentAmount(data, PAYMENT_TYPE.HAND_CASH)
}

// --------------Additional payments for return----------------
export const additionalPaymentCalculateForReturn = (
  data: ReturnGroupInfo[] | undefined
) => {
  const allAdditionalPaymentType = data?.flatMap(
    payment => payment.additionalMoneyBack ?? []
  )

  const additionalPaymentAmount =
    allAdditionalPaymentType?.reduce(
      (acc, item) => acc + (item?.payAmount || 0),
      0
    ) || 0

  return additionalPaymentAmount
}
