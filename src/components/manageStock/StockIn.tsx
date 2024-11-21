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
import { Button, Col, Input, Row, Table, Tooltip, Typography } from 'antd'
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
  data: IProduct[] | []
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
  data,
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
  const total = data?.length || 0

  const meta = {
    total,
    limit: 10,
  }
  const products = Array.isArray(data) ? data : []

  const { data: variantQ } = useLastStockVariantsQuery({ limit: 100 })
  const info = variantQ?.data
  // console.log(info)

  const finalProduct = info?.map((data: IPurchaseStockType) => {
    return products?.map((product: IProduct) => ({
      ...product,
      _totalStockPrice: data?.totalStockPrice,
      _PurchasePrice: data?.sellingPrice,
      _totalPrice: data?.totalPrice,
    }))
  })

  // Log the flattened result
  // console.log(finalProduct?.flat())
  // // console.log(purchasePayloads)
  // console.log(data)

  // -------------------------------------
  // demo
  // console.log(products)
  const uniqueIds = new Set()

  // Filter products to only those with non-empty variants arrays
  const isStockInProduct = products.filter(pro => pro.variants?.length! > 0)

  // Collect all unique purchase IDs
  isStockInProduct?.forEach(pro => {
    pro.variants?.forEach(va => {
      uniqueIds.add(va.purchaseId)
    })
  })

  // Convert the Set to an array if needed
  const uniqueIdsArray = Array.from(uniqueIds)
  // console.log(uniqueIdsArray)

  // Map over each unique ID and count occurrences in the variants
  const idsCount = uniqueIdsArray
    .map(id => {
      let count = 0

      // Count how many times the current ID appears in all variants
      products?.forEach(pro => {
        count += pro.variants?.filter(va => va.purchaseId === id).length || 0
      })

      return count > 0 ? { id, count } : null
    })
    .filter(Boolean) // Remove any null entries where count was 0

  // console.log(idsCount)

  const getActualStockIn = products?.filter(pro =>
    pro.purchases?.map(pur => {
      idsCount?.map(match => match?.id === pur.id)
    })
  )

  getActualStockIn.map(product => {
    const lent = product.variants?.length
    product.purchases?.map(pur => {
      const singlePrice = pur.totalPrice / pur.totalStock
      const lastStockPrice = singlePrice * lent || 0
      // console.log(lastStockPrice)
    })
  })

  // console.log(getActualStockIn)

  // -------------------------------------

  const purchaseRate =
    variantQ?.data?.reduce(
      (acc: number, item: IPurchaseStockType) => acc + item.purchaseRate,
      0
    ) || 0
  const totalStockPrice =
    variantQ?.data?.reduce(
      (acc: number, item: IPurchaseStockType) => acc + item.totalStockPrice,
      0
    ) || 0

  const sellingPrice =
    variantQ?.data?.reduce(
      (acc: number, item: IPurchaseStockType) => acc + item.sellingPrice,
      0
    ) || 0

  const totalPrice =
    variantQ?.data?.reduce(
      (acc: number, item: IPurchaseStockType) => acc + item.totalPrice,
      0
    ) || 0

  const quantity = variantQ?.count

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

  // console.log(products)

  return (
    <div>
      <Row
        gutter={16}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'end',
        }}
      >
        {/* ActionBar, Product Card, and Search Input */}
        <Col xs={24} md={12}>
          <div className="product-card" style={{ marginBottom: '60px' }}>
            <div className="product-price">
              <Text className="currency">{currencyName}</Text>
              <h1 className="price">{numberConvert(totalStockPrice)}</h1>
            </div>
          </div>
          <ActionBar title="List of stock in product">
            <Input
              type="text"
              size="large"
              placeholder="Search..."
              value={searchTerm}
              style={{ width: '100%', marginTop: '10px' }}
              onChange={event => setSearchTerm(event.target.value)}
            />
            {shouldShowResetButton && (
              <Button type="primary" onClick={resetFilters}>
                <ReloadOutlined />
              </Button>
            )}
          </ActionBar>
        </Col>

        {/* StockChart */}
        <Col xs={24} md={12}>
          <StockChart paymentPayloads={paymentPayloads} />
        </Col>
      </Row>

      {/* Table with responsive adjustments */}
      <Row style={{ marginTop: '15px' }}>
        <Col xs={24}>
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
        </Col>
      </Row>
    </div>
  )
}

export default StockIn
