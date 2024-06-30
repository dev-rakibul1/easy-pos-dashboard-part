'use client'

import { useGetCustomerPurchasesByCustomerAndUserQuery } from '@/redux/api/customerPurchase/customerPurchaseApi'
import { useGetSingleUserQuery } from '@/redux/api/userApi/userApi'
import { getUserInfo } from '@/services/auth.services'
import { ICustomer, ICustomerPurchase } from '@/types'
import { Button, Table, Tooltip } from 'antd'
import dayjs from 'dayjs'
import Link from 'next/link'
import { SiFampay } from 'react-icons/si'
import { TbReport } from 'react-icons/tb'

interface SupplierActionsProps {
  customer: ICustomer
}

const Purchase: React.FC<SupplierActionsProps> = ({ customer }) => {
  const { role, uniqueId: id } = getUserInfo() as any
  const { data } = useGetSingleUserQuery(id)

  const customerId = customer?.id
  const userId = data?.id

  const { data: customerPurchase } =
    useGetCustomerPurchasesByCustomerAndUserQuery(customerId, userId)

  const columns = [
    {
      title: 'Purchase Date',
      dataIndex: 'createdAt',
      key: 'createdAt',

      render: (data: any) => {
        return data && dayjs(data).format('D MMM, YYYY hh:mm A')
      },
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalPurchaseAmounts',
      key: 'totalPurchaseAmounts',
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
      render: (data: any) => {
        return (
          <>
            <Tooltip title="Payment">
              <Link href={`/${role}/customers-list/customer-pay/${data.id}`}>
                <Button style={{ margin: '0 3px' }} size="small" type="text">
                  <SiFampay />
                </Button>
              </Link>
            </Tooltip>
            <Tooltip title="Report">
              <Link href={`/${role}/customers-list/report/${data.id}`}>
                <Button style={{ margin: '0 3px' }} size="small" type="text">
                  <TbReport />
                </Button>
              </Link>
            </Tooltip>
          </>
        )
      },
    },
  ]

  const totalQuantity = customerPurchase?.reduce(
    (acc: number, item: ICustomerPurchase) => acc + item.quantity,
    0
  )

  const totalPrice = customerPurchase?.reduce(
    (acc: number, item: ICustomerPurchase) => acc + item.totalPurchaseAmounts,
    0
  )
  const dueAmount = customerPurchase?.reduce(
    (acc: number, item: ICustomerPurchase) => acc + item.totalDue,
    0
  )
  const totalPay = customerPurchase?.reduce(
    (acc: number, item: ICustomerPurchase) => acc + item.totalPay,
    0
  )

  return (
    <div>
      <Table
        columns={columns}
        dataSource={customerPurchase}
        size="small"
        pagination={{
          pageSizeOptions: [10, 20, 50, 100],
          showSizeChanger: true,
        }}
        bordered
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0}>Total Sum</Table.Summary.Cell>
            <Table.Summary.Cell index={1}>{totalQuantity}</Table.Summary.Cell>
            <Table.Summary.Cell index={2}>{totalPrice}</Table.Summary.Cell>
            <Table.Summary.Cell index={3}>{totalPay}</Table.Summary.Cell>
            <Table.Summary.Cell index={4}>{dueAmount}</Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />
    </div>
  )
}

export default Purchase
