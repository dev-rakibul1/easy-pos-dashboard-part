'use client'

import ActionBar from '@/components/ui/ActionBar'
import POSTable from '@/components/ui/POSTable'
import { getUserInfo } from '@/services/auth.services'
import { IMeta, IProduct, IVariant } from '@/types'
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import { Button, Input, Tooltip } from 'antd'
import dayjs from 'dayjs'
import Link from 'next/link'

type Props = {
  data: IProduct[] | []
  meta: IMeta
  resetFilters: () => void
  onPaginationChange: (page: number, pageSize: number) => void
  isLoading: boolean
  searchTerm: string
  setSearchTerm: any
  shouldShowResetButton: any
  limit: number
  onTableChange: (pagination: any, filter: any, sorter: any) => void
}

const StockOut: React.FC<Props> = ({
  resetFilters,
  onPaginationChange,
  isLoading,
  searchTerm,
  setSearchTerm,
  shouldShowResetButton,
  onTableChange,
  limit,
  data,
  meta,
}) => {
  const { role } = getUserInfo() as any

  // @ts-ignore
  const products = data?.products

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
      title: 'Brand Name',
      dataIndex: 'brandName',
    },
    {
      title: 'Model Name',
      dataIndex: 'modelName',
    },
    {
      title: 'Stock',
      dataIndex: 'variants',
      key: 'variants',
      render: (data: IVariant[]) => {
        return data?.length
      },
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      sorter: true,
      render: (data: string) => {
        return data && dayjs(data).format('D MMM, YYYY hh:mm A')
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
      <ActionBar title="List of stock out product">
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
          pageSize={meta?.limit ? Number(meta?.limit) : 0}
          totalPages={meta?.total ? Number(meta.total) : 0}
          showSizeChanger={true}
          onPaginationChange={onPaginationChange}
          onTableChange={onTableChange}
        />
      </div>
    </div>
  )
}

export default StockOut
