'use client'

import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import ActionBar from '@/components/ui/ActionBar'
import POSTable from '@/components/ui/POSTable'
import { useGetAllPurchaseQuery } from '@/redux/api/purchaseApi/PurchaseApi'
import { useDebounced } from '@/redux/hooks'
import { getUserInfo } from '@/services/auth.services'
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import { Button, Input, Tooltip } from 'antd'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useState } from 'react'

const PurchaseList = () => {
  const { role } = getUserInfo() as any
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [sortBy, setSortBy] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  //Create Search debouncedTerms
  const debouncedSearchTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  })

  const query = {
    page,
    sortBy,
    sortOrder,
    limit,
    searchTerm: debouncedSearchTerm,
  }

  const { isLoading, data } = useGetAllPurchaseQuery(query)
  const meta = data?.meta
  const purchases = data?.purchases

  console.log(purchases)

  // Reset filter
  const resetFilters = () => {
    setSortBy('')
    setSortOrder('')
    setSearchTerm('')
  }
  const shouldShowResetButton = !!sortBy || !!sortOrder || !!searchTerm

  const columns = [
    {
      title: 'Unique id',
      dataIndex: 'uniqueId',
    },
    {
      title: 'P. Rate',
      dataIndex: 'purchaseRate',
    },
    {
      title: 'S. Price',
      dataIndex: 'sellingPrice',
    },
    {
      title: 'Discounts',
      dataIndex: 'discounts',
    },
    {
      title: 'Vats',
      dataIndex: 'vats',
    },
    {
      title: 'Color',
      dataIndex: 'color',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      sorter: true,
      render: (data: any) => {
        return data && dayjs(data).format('D MMM, YYYY hh:mm A')
      },
    },
    {
      title: 'Action',
      render: (data: any) => {
        return (
          <>
            <Tooltip title="Details">
              <Link href={`/${role}/purchase-list/details/${data.id}`}>
                <Button style={{ margin: '0 3px' }} size="small" type="text">
                  <EyeOutlined />
                </Button>
              </Link>
            </Tooltip>
            <Tooltip title="Edit">
              <Link href={`/${role}/purchase-list/edit/${data.id}`}>
                <Button style={{ margin: '0 3px' }} size="small" type="text">
                  <EditOutlined />
                </Button>
              </Link>
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                style={{ margin: '0 3px' }}
                onClick={() => console.log(data)}
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

  // Pagination changer
  const onPaginationChange = (page: number, pageSize: number) => {
    setPage(page)
    setLimit(pageSize)
  }

  // Column sort
  const onTableChange = (pagination: any, filters: any, sorter: any) => {
    const { order, field } = sorter
    setSortBy(field)
    setSortOrder(order === 'ascend' ? 'asc' : 'desc')
  }

  return (
    <div>
      <PosBreadcrumb
        items={[
          {
            label: `${role}`,
            link: `/${role}`,
          },
          {
            label: `Purchase list`,
            link: `/${role}/purchase-lists`,
          },
        ]}
      />

      <ActionBar title="Purchase list">
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
          ) : (
            <Link href={`/${role}/add-purchase`}>
              <Button type="primary">Create</Button>
            </Link>
          )}
        </div>
      </ActionBar>

      <div style={{ marginTop: '15px' }}>
        <POSTable
          loading={isLoading}
          columns={columns}
          dataSource={purchases}
          pageSize={limit}
          totalPages={meta?.total ? Number(meta.total) : 0}
          showSizeChanger={true}
          onPaginationChange={onPaginationChange}
          onTableChange={onTableChange}
        />
      </div>
    </div>
  )
}

export default PurchaseList
