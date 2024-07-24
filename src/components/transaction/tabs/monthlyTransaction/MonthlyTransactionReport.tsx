import { currencyName } from '@/constants/global'
import { IPurchase, ISell } from '@/types'
import {
  additionalPaymentCalculate,
  additionalPaymentCalculateForPurchase,
  additionalPaymentCalculateForReturn,
  bankPaymentCalculate,
  bankPurchasePaymentCalculate,
  bankReturnPaymentCalculate,
  cashPurchasePaymentCalculate,
  cashReturnPaymentCalculate,
  handPaymentCalculate,
} from '@/utils/paymentMethodCalculate'
import {
  calculatePriceWithVAT,
  purchaseCalculatePriceWithVAT,
} from '@/utils/VATDiscountCal'
import { Card, Col, Descriptions, Divider, Row } from 'antd'
import React from 'react'

interface SellGroupInfo {
  customerPurchase: {
    totalPurchaseAmounts: number
    totalDue: number
    totalPay: number
    paymentType: string
  }
  customerPayInUser: {
    payAmount: number
    paymentType: string
  }[]
}

interface DailyReportProps {
  sellGroups?: {
    sellGroups: SellGroupInfo[]
  }
  expenseAmount: number
  returnsGroups: any
  sales: ISell[]
  purchases: {
    purchases: IPurchase[]
  }
  purchaseGroups?: {
    purchaseGroups: {
      supplierSells: {
        totalSellAmounts: number
        totalDue: number
        totalPay: number
      }
    }[]
  }
  returns: any
}

const MonthlyTransactionReport: React.FC<DailyReportProps> = ({
  sellGroups,
  sales,
  purchases,
  purchaseGroups,
  returnsGroups,
  returns,
  expenseAmount,
}) => {
  // ----------------------Purchase information----------------------
  const purchaseInfo = purchases?.purchases
  const purchaseGroupsInfo = purchaseGroups?.purchaseGroups

  // Accumulate VAT, Discount, and Selling Price
  const totalPurchasePriceWithVatsDiscounts =
    purchaseInfo?.reduce((acc, item) => acc + (item?.totalPrice || 0), 0) || 0

  // Calculate VAT and Discount
  const calculatePurchaseVatDiscount =
    purchaseCalculatePriceWithVAT(purchaseInfo)

  const purchaseTotals = purchaseGroupsInfo?.reduce(
    (acc, sellGroup) => {
      acc.totalSellAmounts += sellGroup?.supplierSells?.totalSellAmounts || 0
      acc.totalDue += sellGroup?.supplierSells?.totalDue || 0
      acc.totalPay += sellGroup?.supplierSells?.totalPay || 0
      return acc
    },
    { totalSellAmounts: 0, totalDue: 0, totalPay: 0 }
  )

  const totalPurchase =
    purchaseInfo?.reduce((acc, item) => acc + (item?.purchaseRate || 0), 0) || 0

  // ----------------------Sales information----------------------
  const sellGroupInfo = sellGroups?.sellGroups
  // Calculate total amounts
  const sellsTotals = sellGroupInfo?.reduce(
    (acc, sellGroup) => {
      acc.totalPurchaseAmounts +=
        sellGroup?.customerPurchase?.totalPurchaseAmounts || 0
      acc.totalDue += sellGroup?.customerPurchase?.totalDue || 0
      acc.totalPay += sellGroup?.customerPurchase?.totalPay || 0
      return acc
    },
    { totalPurchaseAmounts: 0, totalDue: 0, totalPay: 0 }
  )

  // Accumulate VAT, Discount, and Selling Price
  const calculateVatDiscount = calculatePriceWithVAT(sales)
  const totalSells =
    sales?.reduce((acc, item) => acc + (item?.sellingPrice || 0), 0) || 0

  // ---------------------PAYMENT TYPE FOR SALES---------------------
  const bankPayment = bankPaymentCalculate(sellGroupInfo)
  const handCash = handPaymentCalculate(sellGroupInfo)
  const additionalPayment = additionalPaymentCalculate(sellGroupInfo)

  // ---------------------PAYMENT TYPE FOR PURCHASE---------------------
  const purchaseBankPayment = bankPurchasePaymentCalculate(purchaseGroupsInfo)
  const purchaseCashPayment = cashPurchasePaymentCalculate(purchaseGroupsInfo)
  const additionalPurchasePayment =
    additionalPaymentCalculateForPurchase(purchaseGroupsInfo)

  // ---------------------RETURN GROUPS---------------------
  // const returnInfo = returns?.returns
  const returnGroupInfo = returnsGroups?.returnGroups

  const returnBankPayment = bankReturnPaymentCalculate(returnGroupInfo)
  const returnCashPayment = cashReturnPaymentCalculate(returnGroupInfo)

  const returnTotals = returnGroupInfo?.reduce(
    (acc: any, returnGroup: any) => {
      acc.totalReturnAmount +=
        returnGroup?.supplierReturnPayments?.totalReturnAmount || 0
      acc.totalDue += returnGroup?.supplierReturnPayments?.totalDue || 0
      acc.totalPay += returnGroup?.supplierReturnPayments?.totalPay || 0
      return acc
    },
    { totalReturnAmount: 0, totalDue: 0, totalPay: 0 }
  )
  const returnAdditionalPayment =
    additionalPaymentCalculateForReturn(returnGroupInfo)

  return (
    <div>
      <Card
        className="profile-card"
        style={{ width: '100%', marginTop: '15px' }}
      >
        <Row gutter={16}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <Descriptions
              title="Selling Information"
              column={1}
              layout="horizontal"
              bordered
              style={{ width: '100%' }}
            >
              <Descriptions.Item label="Total Revenue (VAT & D.)">
                {sellsTotals?.totalPurchaseAmounts
                  ? ` ${currencyName} ${sellsTotals?.totalPurchaseAmounts.toFixed(
                      2
                    )}`
                  : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Due sales">
                {sellsTotals?.totalDue
                  ? ` ${currencyName} ${sellsTotals?.totalDue.toFixed(2)}`
                  : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Cash sales">
                {sellsTotals?.totalPay
                  ? ` ${currencyName} ${(
                      sellsTotals?.totalPay + additionalPayment
                    ).toFixed(2)}`
                  : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Total vats">
                {calculateVatDiscount?.vatAmount
                  ? `${currencyName} ${parseFloat(
                      calculateVatDiscount?.vatAmount
                    ).toFixed(2)}`
                  : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Total discounts">
                {calculateVatDiscount?.discountAmount
                  ? `${currencyName} ${parseFloat(
                      calculateVatDiscount?.discountAmount
                    ).toFixed(2)}`
                  : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Bank transaction">
                {bankPayment
                  ? `${currencyName} ${bankPayment.toFixed(2)} `
                  : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Hand cash transaction">
                {handCash ? `${currencyName} ${handCash.toFixed(2)} ` : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Total exp. selling price">
                {totalSells
                  ? `${currencyName} ${totalSells.toFixed(2)} `
                  : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Additional cost">
                {expenseAmount
                  ? `${currencyName} ${expenseAmount.toFixed(2)} `
                  : 'N/A'}
              </Descriptions.Item>
            </Descriptions>
          </Col>
          {/* Purchase information */}
          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <Descriptions
              title="Purchase information"
              column={1}
              layout="horizontal"
              bordered
              style={{ width: '100%' }}
            >
              <Descriptions.Item label="Total purchase (+VAT & D.)">
                {totalPurchasePriceWithVatsDiscounts
                  ? `${currencyName} ${totalPurchasePriceWithVatsDiscounts.toFixed(
                      2
                    )} `
                  : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Due purchase">
                {purchaseTotals?.totalDue
                  ? ` ${currencyName} ${purchaseTotals?.totalDue.toFixed(2)}`
                  : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Cash purchase">
                {purchaseTotals?.totalPay
                  ? ` ${currencyName} ${(
                      purchaseTotals?.totalPay + additionalPurchasePayment
                    ).toFixed(2)}`
                  : 'N/A'}
              </Descriptions.Item>

              <Descriptions.Item label="Total vats">
                {calculatePurchaseVatDiscount?.vatAmount
                  ? ` ${currencyName} ${parseFloat(
                      calculatePurchaseVatDiscount?.vatAmount
                    ).toFixed(2)}`
                  : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Total discounts">
                {calculatePurchaseVatDiscount?.discountAmount
                  ? ` ${currencyName} ${parseFloat(
                      calculatePurchaseVatDiscount?.discountAmount
                    ).toFixed(2)}`
                  : 'N/A'}
              </Descriptions.Item>
              {/* <Descriptions.Item label="Total purchase">
                {calculatePurchaseVatDiscount?.totalPrice
                  ? `${currencyName} ${calculatePurchaseVatDiscount?.totalPrice} `
                  : 'N/A'}
              </Descriptions.Item> */}
              <Descriptions.Item label="Bank transaction">
                {purchaseBankPayment
                  ? `${currencyName} ${purchaseBankPayment.toFixed(2)} `
                  : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Hand cash transaction">
                {purchaseCashPayment
                  ? `${currencyName} ${purchaseCashPayment.toFixed(2)} `
                  : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Total exp. purchase price">
                {totalPurchase
                  ? `${currencyName} ${totalPurchase.toFixed(2)} `
                  : 'N/A'}
              </Descriptions.Item>
            </Descriptions>
          </Col>

          {/* Return information */}
          <Col
            xs={24}
            sm={24}
            md={12}
            lg={12}
            xl={12}
            xxl={12}
            style={{ marginTop: '15px' }}
          >
            <Descriptions
              title="Return information"
              column={1}
              layout="horizontal"
              bordered
              style={{ width: '100%' }}
            >
              <Descriptions.Item label="Total return (+VAT & D.)">
                {returnTotals?.totalReturnAmount
                  ? `${currencyName} ${returnTotals?.totalReturnAmount.toFixed(
                      2
                    )} `
                  : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Return due">
                {returnTotals?.totalDue
                  ? ` ${currencyName} ${returnTotals?.totalDue.toFixed(2)}`
                  : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Cash return">
                {returnTotals?.totalPay
                  ? ` ${currencyName} ${(
                      returnTotals?.totalPay + returnAdditionalPayment
                    ).toFixed(2)}`
                  : 'N/A'}
              </Descriptions.Item>

              <Descriptions.Item label="Bank transaction">
                {returnBankPayment
                  ? `${currencyName} ${returnBankPayment.toFixed(2)} `
                  : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Hand cash transaction">
                {returnCashPayment
                  ? `${currencyName} ${returnCashPayment.toFixed(2)} `
                  : 'N/A'}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
        <Divider />
      </Card>
    </div>
  )
}

export default MonthlyTransactionReport
