'use client'

import { currencyName } from '@/constants/global'
import { useGetSuppliersByUserIdQuery } from '@/redux/api/supplierApi/supplierApi'
import { useGetSupplierSellsByUserIdQuery } from '@/redux/api/supplierSells/supplierSellApi'
import { useGetSingleUserQuery } from '@/redux/api/userApi/userApi'
import { getUserInfo } from '@/services/auth.services'
import { ISupplier, ISupplierSells, ITokenObj } from '@/types'
import numberConvert from '@/utils/numberConvert'
import { EyeOutlined } from '@ant-design/icons'
import { Button, Row, Table, Tooltip, Typography } from 'antd'
import Link from 'next/link'
import ActionBar from '../ui/ActionBar'
import DebtChart from './DebtChart'

const { Title } = Typography

const TotalDebt = () => {
  const { role, uniqueId: id } = getUserInfo() as ITokenObj
  const { data: userInfo } = useGetSingleUserQuery(id)

  const userId = userInfo?.id
  const { data, isLoading } = useGetSupplierSellsByUserIdQuery(userId, {
    skip: !userId, // Skip the query if userId is not defined
  })

  const { data: supplierInfo } = useGetSuppliersByUserIdQuery(userId)

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone No',
      dataIndex: 'phoneNo',
      key: 'phoneNo',
    },
    {
      title: 'Total Sell Amounts',
      dataIndex: 'totalSellAmounts',
      key: 'totalSellAmounts',
    },
    {
      title: 'Total Pay',
      dataIndex: 'totalPay',
      key: 'totalPay',
    },
    {
      title: 'Total Due',
      dataIndex: 'totalDue',
      key: 'totalDue',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (data: any) => {
        return (
          <Tooltip title="Details">
            <Link href={`/${role}/supplier-lists/details/${data?.key}`}>
              <Button style={{ margin: '0 3px' }} size="small" type="text">
                <EyeOutlined />
              </Button>
            </Link>
          </Tooltip>
        )
      },
    },
  ]

  // Transform the data to be used in the table
  const transformedData =
    supplierInfo?.map((supplier: ISupplier) => ({
      key: supplier.id,
      name: `${supplier.firstName} ${supplier.middleName} ${supplier.lastName}`,
      email: supplier.email,
      phoneNo: supplier.phoneNo,
      totalSellAmounts: supplier.supplierSell?.reduce(
        (acc, curr) => acc + curr.totalSellAmounts,
        0
      ),
      totalPay: supplier.supplierSell?.reduce(
        (acc, curr) => acc + curr.totalPay,
        0
      ),
      totalDue: supplier.supplierSell?.reduce(
        (acc, curr) => acc + curr.totalDue,
        0
      ),
    })) || []

  const totalPrice =
    data?.reduce(
      (acc: number, item: ISupplierSells) => acc + item.totalSellAmounts,
      0
    ) || 0

  const dueAmount =
    data?.reduce(
      (acc: number, item: ISupplierSells) => acc + item.totalDue,
      0
    ) || 0

  const totalPay =
    data?.reduce(
      (acc: number, item: ISupplierSells) => acc + item.totalPay,
      0
    ) || 0

  const paymentPayloads = {
    totalPrice,
    dueAmount,
    totalPay,
  }

  return (
    <>
      <DebtChart paymentPayloads={paymentPayloads} />

      <div style={{ padding: '20px' }}>
        <Row gutter={[32, 32]} justify="center">
          <Title level={2} style={{ textAlign: 'center' }}>
            Due - {numberConvert(dueAmount, currencyName)}
          </Title>
        </Row>
        <ActionBar title="List of debt in seller" />
        <Table
          loading={isLoading}
          columns={columns}
          dataSource={transformedData}
          size="small"
          pagination={{
            pageSizeOptions: [10, 20, 50, 100],
            showSizeChanger: true,
          }}
          bordered
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>Total Sum</Table.Summary.Cell>
              <Table.Summary.Cell index={1} />
              <Table.Summary.Cell index={2} />
              <Table.Summary.Cell index={3}>
                {numberConvert(totalPrice.toFixed(2), currencyName)}
              </Table.Summary.Cell>
              <Table.Summary.Cell index={4}>
                {numberConvert(totalPay.toFixed(2), currencyName)}
              </Table.Summary.Cell>
              <Table.Summary.Cell index={5}>
                {numberConvert(dueAmount.toFixed(2), currencyName)}
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
      </div>
    </>
  )
}

export default TotalDebt