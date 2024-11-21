'use client'
import {
  DollarOutlined,
  FileTextOutlined,
  RedoOutlined,
  ShopOutlined,
} from '@ant-design/icons'

// @ts-ignore
import { ProfitAndCost } from '@/app/(dashboardLayout)/super_admin/monthly-transaction/page'
import { currencyName } from '@/constants/global'
import { useGetAllAdditionalExpenseByCurrentMonthQuery } from '@/redux/api/additionalExpense/additionalExpenseApi'
import { useGetCustomerPurchaseByUserIdQuery } from '@/redux/api/customerPurchase/customerPurchaseApi'
import { useGetAllPurchaseByCurrentMonthQuery } from '@/redux/api/purchaseApi/PurchaseApi'
import { useGetPurchaseGroupByCurrentMonthQuery } from '@/redux/api/purchaseGroup/purchaseGroupApi'
import { useGetAllReturnGroupByCurrentMonthQuery } from '@/redux/api/returnGroupApi/returnGroupApi'
import { useGetSellByCurrentMonthQuery } from '@/redux/api/sells/sellsApi'
import { useGetSingleUserQuery } from '@/redux/api/userApi/userApi'
import { useGetAllVariantsQuery } from '@/redux/api/variantApi/variantApi'
import { getUserInfo } from '@/services/auth.services'
import { ICustomerPurchase, ISell, ITokenObj } from '@/types'
import { calculateProfit } from '@/utils/calculateProfit'
import numberConvert from '@/utils/numberConvert'
import { additionalPaymentCalculateForReturn } from '@/utils/paymentMethodCalculate'
import {
  calculateTotalExpense,
  purchaseCalculatePriceWithVAT,
} from '@/utils/VATDiscountCal'
import { Card, Col, Row, Spin, Typography } from 'antd'
import Link from 'next/link'
import React from 'react'
import HomeDailyTrans from './HomeDailyTrans'
import SalesLineChart from './HomePageChart'

const { Title } = Typography

const HomeDesign: React.FC = () => {
  const { role, uniqueId: id } = getUserInfo() as ITokenObj
  const { data: sales } = useGetSellByCurrentMonthQuery({ limit: 100 })
  const { data: additionalExpense } =
    useGetAllAdditionalExpenseByCurrentMonthQuery({ limit: 100 })

  // Assuming additionalExpense is of type AdditionalExpenseData | undefined
  const expenseAmount = calculateTotalExpense(
    // @ts-ignore
    additionalExpense?.expenses?.length ? additionalExpense.expenses : []
  )

  // calculate profit and cost
  // const sales = salesData
  const profitAndCost: ProfitAndCost = calculateProfit(sales, expenseAmount)
  const totalProfit = profitAndCost?.totalProfit ?? 0

  const totalRevenue: number = sales?.reduce(
    (acc: number, sell: ISell) => acc + sell.totalSellPrice,
    0
  )

  // ---------------Calculate stock--------------
  const { data: variantData, isLoading: variantLoading } =
    useGetAllVariantsQuery({
      limit: 100,
    })

  // ---------------------RETURN GROUPS---------------------
  const { data: returnsGroups, isLoading: rLoading } =
    useGetAllReturnGroupByCurrentMonthQuery({
      limit: 1200,
    })
  const returnGroupInfo = returnsGroups?.returnGroups

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

  // ----------------------Purchase information----------------------
  const { data: purchase } = useGetAllPurchaseByCurrentMonthQuery({
    limit: 1200,
  })
  const { data: purchaseGroups } = useGetPurchaseGroupByCurrentMonthQuery({
    limit: 1200,
  })
  const purchaseInfo = purchase?.purchases
  const purchaseGroupsInfo = purchaseGroups?.purchaseGroups

  // Accumulate VAT, Discount, and Selling Price
  const totalPurchasePriceWithVatsDiscounts =
    // @ts-ignore
    purchaseInfo?.reduce(
      (acc: any, item: any) => acc + (item?.totalPrice || 0),
      0
    ) || 0

  // Calculate VAT and Discount
  const calculatePurchaseVatDiscount =
    // @ts-ignore
    purchaseCalculatePriceWithVAT(purchaseInfo)

  const purchaseTotals = purchaseGroupsInfo?.reduce(
    (acc: any, sellGroup: any) => {
      acc.totalSellAmounts += sellGroup?.supplierSells?.totalSellAmounts || 0
      acc.totalDue += sellGroup?.supplierSells?.totalDue || 0
      acc.totalPay += sellGroup?.supplierSells?.totalPay || 0
      return acc
    },
    { totalSellAmounts: 0, totalDue: 0, totalPay: 0 }
  )

  const totalPurchase =
    // @ts-ignore
    purchaseInfo?.reduce(
      (acc: any, item: any) => acc + (item?.purchaseRate || 0),
      0
    ) || 0

  // ----------------------Customer due information----------------------

  const { data: userInfo } = useGetSingleUserQuery(id)

  const userId = userInfo?.id
  const { data, isLoading: cuLoading } = useGetCustomerPurchaseByUserIdQuery(
    userId,
    {
      skip: !userId, // Skip the query if userId is not defined
    }
  )

  const customerDueAmount =
    data?.reduce(
      (acc: number, item: ICustomerPurchase) => acc + item.totalDue,
      0
    ) || 0

  return (
    <div style={{ padding: '20px' }}>
      {/* Summary Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Link href={`/${role}/manage-stock`}>
            <Card style={{ boxShadow: '0px 3px 0px 0px #17a2b861' }}>
              <ShopOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
              <Title level={5}>Total Stock</Title>
              {variantLoading ? (
                <Spin size="small" />
              ) : (
                <p>
                  {variantData?.meta?.total
                    ? variantData?.meta?.total + ' ' + 'Pics'
                    : 'N/A'}
                </p>
              )}
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Link href={`/${role}/monthly-transaction`}>
            <Card style={{ boxShadow: '0px 3px 0px 0px #17a2b861' }}>
              <DollarOutlined
                style={{
                  fontSize: '24px',
                  color:
                    totalProfit > 0
                      ? 'green'
                      : totalProfit < 0
                      ? 'red'
                      : '#d9d9d9',
                }}
              />
              <Title level={5}>
                {totalProfit > 0
                  ? 'Total Profit'
                  : totalProfit < 0
                  ? 'Total Loss'
                  : 'Total Profit'}
              </Title>

              <p style={{ color: totalProfit > 0 ? 'green' : 'red' }}>
                {totalProfit !== 0
                  ? ` ${numberConvert(Math.abs(totalProfit), currencyName)}`
                  : 'N/A'}
              </p>
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Link href={`/${role}/monthly-transaction`}>
            <Card style={{ boxShadow: '0px 3px 0px 0px #17a2b861' }}>
              <DollarOutlined style={{ fontSize: '24px', color: '#faad14' }} />
              <Title level={5}>Total Revenue</Title>
              <p>{`${
                totalRevenue ? numberConvert(totalRevenue, currencyName) : 'N/A'
              }`}</p>
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Link href={`/${role}/monthly-transaction`}>
            <Card style={{ boxShadow: '0px 3px 0px 0px #17a2b861' }}>
              <DollarOutlined style={{ fontSize: '24px', color: '#ff4d4f' }} />
              <Title level={5}>Total Cost</Title>

              <p>{`${
                profitAndCost?.totalCost
                  ? numberConvert(profitAndCost?.totalCost, currencyName)
                  : 'N/A'
              }`}</p>
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Link href={`/${role}/monthly-transaction`}>
            <Card style={{ boxShadow: '0px 3px 0px 0px #17a2b861' }}>
              <RedoOutlined style={{ fontSize: '24px', color: '#722ed1' }} />
              <Title level={5}>Total Returns</Title>
              {rLoading ? (
                <Spin size="small" />
              ) : (
                <p>
                  {returnTotals?.totalPay
                    ? numberConvert(
                        returnTotals?.totalPay + returnAdditionalPayment,
                        currencyName
                      )
                    : 'N/A'}
                </p>
              )}
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Link href={`/${role}/monthly-transaction`}>
            <Card style={{ boxShadow: '0px 3px 0px 0px #17a2b861' }}>
              <FileTextOutlined
                style={{ fontSize: '24px', color: '#13c2c2' }}
              />
              <Title level={5}>Total Purchase</Title>
              <p>
                {totalPurchasePriceWithVatsDiscounts
                  ? numberConvert(
                      totalPurchasePriceWithVatsDiscounts,
                      currencyName
                    )
                  : 'N/A'}
              </p>
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Link href={`/${role}/manage-stock`}>
            <Card style={{ boxShadow: '0px 3px 0px 0px #17a2b861' }}>
              <DollarOutlined style={{ fontSize: '24px', color: '#ff85c0' }} />
              <Title level={5}>Customer Due</Title>
              {cuLoading ? (
                <Spin size="small" />
              ) : (
                <p>{`${
                  customerDueAmount
                    ? numberConvert(customerDueAmount, currencyName)
                    : 'N/A'
                }`}</p>
              )}
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Link href={`/${role}/monthly-transaction`}>
            <Card style={{ boxShadow: '0px 3px 0px 0px #17a2b861' }}>
              <DollarOutlined style={{ fontSize: '24px', color: '#fa541c' }} />
              <Title level={5}>Additional Costs</Title>
              <p>
                {expenseAmount
                  ? numberConvert(expenseAmount, currencyName)
                  : 'N/A'}
              </p>
            </Card>
          </Link>
        </Col>
      </Row>

      <div style={{ padding: '20px' }}>
        <SalesLineChart />
      </div>

      <HomeDailyTrans />
    </div>
  )
}

export default HomeDesign
