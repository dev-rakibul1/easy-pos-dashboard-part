import { currencyName } from '@/constants/global'
import { calculatePriceWithVAT } from '@/utils/VATDiscountCal'
import { Card, Col, Descriptions, Divider, Row, Typography } from 'antd'
import React from 'react'

const { Title, Text } = Typography

// Define interfaces/types for props and data structures
interface SellGroupInfo {
  customerPurchase?: {
    totalPurchaseAmounts?: number
    totalDue?: number
    totalPay?: number
  }
}

interface SalesItem {
  vats?: number
  discounts?: number
  sellingPrice?: number
}

interface DailyReportProps {
  sellGroups?: {
    sellGroups: SellGroupInfo[]
  }
  sales?: SalesItem[]
  purchases: any
  purchaseGroups: any
}

const DailyReport: React.FC<DailyReportProps> = ({
  sellGroups,
  sales,
  purchases,
  purchaseGroups,
}) => {
  // ----------------------Purchase information----------------------
  const purchaseInfo = purchases?.purchases
  const purchaseGroupsInfo = purchaseGroups?.purchaseGroups

  // Accumulate VAT, Discount, and Selling Price
  const totalPurchasePrice =
    purchaseInfo?.reduce((acc, item) => acc + (item?.purchaseRate || 0), 0) || 0
  const totalPurchaseVatRate =
    purchaseInfo?.reduce((acc, item) => acc + (item?.vats || 0), 0) || 0
  const purchaseDiscountRate =
    purchaseInfo?.reduce((acc, item) => acc + (item?.discounts || 0), 0) || 0
  const totalPurchasePriceWithVatsDiscounts =
    purchaseInfo?.reduce((acc, item) => acc + (item?.totalPrice || 0), 0) || 0

  // Calculate VAT and Discount
  const calculatePurchaseVatDiscount = calculatePriceWithVAT(
    totalPurchasePrice,
    totalPurchaseVatRate,
    purchaseDiscountRate
  )
  const purchaseTotals = purchaseGroupsInfo?.reduce(
    (acc, sellGroup) => {
      acc.totalSellAmounts += sellGroup?.supplierSells?.totalSellAmounts || 0
      acc.totalDue += sellGroup?.supplierSells?.totalDue || 0
      acc.totalPay += sellGroup?.supplierSells?.totalPay || 0
      return acc
    },
    { totalSellAmounts: 0, totalDue: 0, totalPay: 0 }
  )

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
  const totalSellingPrice =
    sales?.reduce((acc, item) => acc + (item?.sellingPrice || 0), 0) || 0
  const totalVatRate =
    sales?.reduce((acc, item) => acc + (item?.vats || 0), 0) || 0
  const discountRate =
    sales?.reduce((acc, item) => acc + (item?.discounts || 0), 0) || 0

  // Calculate VAT and Discount
  const calculateVatDiscount = calculatePriceWithVAT(
    totalSellingPrice,
    totalVatRate,
    discountRate
  )

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
                  ? `${sellsTotals?.totalPurchaseAmounts} ${currencyName}`
                  : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Due sales">
                {sellsTotals?.totalDue
                  ? `${sellsTotals?.totalDue} ${currencyName}`
                  : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Cash sales">
                {sellsTotals?.totalPay
                  ? `${sellsTotals?.totalPay} ${currencyName}`
                  : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Total vats">
                {calculateVatDiscount?.vatAmount
                  ? `${calculateVatDiscount?.vatAmount} ${currencyName}`
                  : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Total discounts">
                {calculateVatDiscount?.discountAmount
                  ? `${calculateVatDiscount?.discountAmount} ${currencyName}`
                  : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Total exp. selling price">
                {calculateVatDiscount?.totalPrice
                  ? `${calculateVatDiscount?.totalPrice} ${currencyName}`
                  : 'N/A'}
              </Descriptions.Item>
            </Descriptions>
          </Col>
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
                  ? `${totalPurchasePriceWithVatsDiscounts} ${currencyName}`
                  : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Due purchase">
                {purchaseTotals?.totalDue
                  ? `${purchaseTotals?.totalDue} ${currencyName}`
                  : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Cash purchase">
                {purchaseTotals?.totalPay
                  ? `${purchaseTotals?.totalPay} ${currencyName}`
                  : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Total purchase">
                {calculatePurchaseVatDiscount?.totalPrice
                  ? `${calculatePurchaseVatDiscount?.totalPrice} ${currencyName}`
                  : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Total vats">
                {calculatePurchaseVatDiscount?.vatAmount
                  ? `${calculatePurchaseVatDiscount?.vatAmount} ${currencyName}`
                  : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Total discounts">
                {calculatePurchaseVatDiscount?.discountAmount
                  ? `${calculatePurchaseVatDiscount?.discountAmount} ${currencyName}`
                  : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Permanent address">
                {/* {purchase?.suppliers?.permanentAddress
                  ? purchase?.suppliers?.permanentAddress
                  : 'N/A'} */}
                permanentAddress
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
        <Divider />
      </Card>
    </div>
  )
}

export default DailyReport
