'use client'

import ActionBar from '@/components/ui/ActionBar'
import POSTable from '@/components/ui/POSTable'
import { currencyName } from '@/constants/global'
import { useLastStockVariantsQuery } from '@/redux/api/variantApi/variantApi'
import { getUserInfo } from '@/services/auth.services'
import { IProduct, IVariant } from '@/types'
import numberConvert from '@/utils/numberConvert'
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import { Button, Input, Table, Tooltip, Typography } from 'antd'
import dayjs from 'dayjs'
import Link from 'next/link'
import StockChart from './StockChart'
import './StockStyle.css'
const { Title, Text } = Typography

export type IPurchaseStockType = {
  purchaseRate: number
  sellingPrice: number
  totalPrice: number
  quantity: number
  totalStockPrice: number
}

type Props = {
  stockIn: IProduct[] | []
  resetFilters: () => void
  onPaginationChange: (page: number, pageSize: number) => void
  isLoading: boolean
  searchTerm: string
  setSearchTerm: (value: string) => void
  shouldShowResetButton: boolean
  limit: number
  onTableChange: (pagination: any, filter: any, sorter: any) => void
}

const StockIn: React.FC<Props> = ({
  stockIn,
  resetFilters,
  onPaginationChange,
  isLoading,
  searchTerm,
  setSearchTerm,
  shouldShowResetButton,
  onTableChange,
  limit,
}) => {
  const { role } = getUserInfo() as any
  const total = stockIn?.length || 0

  const meta = {
    total,
    limit: 10,
  }
  const products = Array.isArray(stockIn) ? stockIn : []

  const { data } = useLastStockVariantsQuery({ limit: 100 })
  const info = data?.data

  const finalProduct = info?.map((data: IPurchaseStockType) => {
    return products?.map((product: IProduct) => ({
      ...product,
      _totalStockPrice: data?.totalStockPrice,
      _PurchasePrice: data?.sellingPrice,
      _totalPrice: data?.totalPrice,
    }))
  })

  // Log the flattened result
  console.log(finalProduct?.flat())
  // console.log(purchasePayloads)
  console.log(data)

  const purchaseRate =
    data?.data?.reduce(
      (acc: number, item: IPurchaseStockType) => acc + item.purchaseRate,
      0
    ) || 0
  const totalStockPrice =
    data?.data?.reduce(
      (acc: number, item: IPurchaseStockType) => acc + item.totalStockPrice,
      0
    ) || 0

  const sellingPrice =
    data?.data?.reduce(
      (acc: number, item: IPurchaseStockType) => acc + item.sellingPrice,
      0
    ) || 0

  const totalPrice =
    data?.data?.reduce(
      (acc: number, item: IPurchaseStockType) => acc + item.totalPrice,
      0
    ) || 0

  const quantity = data?.count

  const paymentPayloads = {
    totalPrice,
    purchaseRate,
    sellingPrice,
    quantity,
    totalStockPrice,
  }

  // console.log(finalProduct)

  const columns = [
    {
      title: 'Unique id',
      dataIndex: 'uniqueId',
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
    },

    {
      title: 'Stock amount',
      dataIndex: 'purchases',
      render: (_: any, record: IProduct) => {
        const purchase = record.purchases?.[0]
        return purchase
          ? purchase.purchaseRate * (record.variants?.length || 1)
          : 0
      },
    },
    {
      title: 'Selling Price',
      dataIndex: 'purchases',
      render: (_: any, record: IProduct) => {
        const purchase = record.purchases?.[0]
        return purchase
          ? purchase.sellingPrice * (record.variants?.length || 1)
          : 0
      },
    },
    {
      title: 'Total Price',
      dataIndex: 'purchases',
      render: (_: any, record: IProduct) => {
        const purchase = record.purchases?.[0]
        return purchase ? purchase.totalPrice : 0
      },
    },
    {
      title: 'Stock',
      dataIndex: 'variants',
      key: 'variants',
      render: (data: IVariant[]) => {
        return data?.length || 0
      },
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      sorter: true,
      render: (data: string) => {
        return data ? dayjs(data).format('D MMM, YYYY hh:mm A') : ''
      },
    },
    {
      title: 'Action',
      render: (data: any) => {
        return (
          <>
            <Tooltip title="Details">
              <Link href={`/${role}/product-list/details/${data.id}`}>
                <Button style={{ margin: '0 3px' }} size="small" type="text">
                  <EyeOutlined />
                </Button>
              </Link>
            </Tooltip>
            <Tooltip title="Edit">
              <Link href={`/${role}/product-list/edit/${data.id}`}>
                <Button style={{ margin: '0 3px' }} size="small" type="text">
                  <EditOutlined />
                </Button>
              </Link>
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                style={{ margin: '0 3px' }}
                // onClick={() => handleDeleteClick(data)}
                size="small"
                type="text"
                danger
              >
                <DeleteOutlined />
              </Button>
            </Tooltip>
          </>
        )
      },
    },
  ]

  return (
    <div>
      <StockChart paymentPayloads={paymentPayloads} />

      <div className="product-card">
        <div className="product-price">
          <Text className="currency">{currencyName}</Text>
          <Title level={1} className="price">
            {numberConvert(totalStockPrice)}
          </Title>
        </div>
      </div>

      <ActionBar title="List of stock in product">
        <Input
          type="text"
          size="large"
          placeholder="Search..."
          value={searchTerm}
          style={{ width: '50%', maxWidth: '100%', marginTop: '10px' }}
          onChange={event => setSearchTerm(event.target.value)}
        />
        <div>
          {shouldShowResetButton ? (
            <Button type="primary" onClick={resetFilters}>
              <ReloadOutlined />
            </Button>
          ) : null}
        </div>
      </ActionBar>

      <div style={{ marginTop: '15px' }}>
        <POSTable
          loading={isLoading}
          columns={columns}
          dataSource={products}
          pageSize={limit}
          totalPages={meta?.total ? Number(meta.total) : 0}
          showSizeChanger={true}
          onPaginationChange={onPaginationChange}
          onTableChange={onTableChange}
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>Total Sum</Table.Summary.Cell>
              <Table.Summary.Cell index={1} />

              <Table.Summary.Cell index={2}>
                {totalStockPrice.toFixed(2)}
              </Table.Summary.Cell>
              <Table.Summary.Cell index={3}>
                {sellingPrice.toFixed(2)}
              </Table.Summary.Cell>
              <Table.Summary.Cell index={4}>
                {totalPrice.toFixed(2)}
              </Table.Summary.Cell>

              <Table.Summary.Cell index={5}>{quantity}</Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
      </div>
    </div>
  )
}

export default StockIn
