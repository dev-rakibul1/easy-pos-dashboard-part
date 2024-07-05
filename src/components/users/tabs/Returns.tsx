'use client'

import { useGetSupplierReturnPaymentBySupplierAndUserQuery } from '@/redux/api/supplierReturnPayment/supplierReturnPayemntApi'
import { useGetSingleUserByIdQuery } from '@/redux/api/userApi/userApi'
import { getUserInfo } from '@/services/auth.services'
import { ISupplierReturn, IUser } from '@/types'
import { Button, Table, Tooltip } from 'antd'
import dayjs from 'dayjs'
import Link from 'next/link'
import { SiFampay } from 'react-icons/si'
import { TbReport } from 'react-icons/tb'

interface SupplierActionsProps {
  user: IUser
}

const Returns: React.FC<SupplierActionsProps> = ({ user }) => {
  const { role } = getUserInfo() as any
  const id = user?.id
  const { data } = useGetSingleUserByIdQuery(id)

  const userId = data?.id

  const { data: returnPayment, isLoading } =
    useGetSupplierReturnPaymentBySupplierAndUserQuery(userId)

  // console.log(returnPayment)

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
      dataIndex: 'totalReturnAmount',
      key: 'totalReturnAmount',
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
              <Link href={`/${role}/return-lists/return-to-pay/${data.id}`}>
                <Button style={{ margin: '0 3px' }} size="small" type="text">
                  <SiFampay />
                </Button>
              </Link>
            </Tooltip>
            <Tooltip title="Report">
              <Link href={`/${role}/return-lists/report/${data.id}`}>
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

  const totalQuantity = returnPayment?.reduce(
    (acc: number, item: ISupplierReturn) => acc + item.quantity,
    0
  )

  const totalPrice = returnPayment?.reduce(
    (acc: number, item: ISupplierReturn) => acc + item?.totalReturnAmount,
    0
  )
  const dueAmount = returnPayment?.reduce(
    (acc: number, item: ISupplierReturn) => acc + item.totalDue,
    0
  )
  const totalPay = returnPayment?.reduce(
    (acc: number, item: ISupplierReturn) => acc + item.totalPay,
    0
  )

  return (
    <div>
      <Table
        loading={isLoading}
        columns={columns}
        dataSource={returnPayment}
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

export default Returns
