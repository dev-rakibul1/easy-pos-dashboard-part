import ActionBar from '@/components/ui/ActionBar'
import POSTable from '@/components/ui/POSTable'
import { useGetAllDeliveryWarrantyQuery } from '@/redux/api/warranty/warrantyApi'
import { useDebounced } from '@/redux/hooks'
import { getUserInfo } from '@/services/auth.services'
import { ITokenObj } from '@/types'
import { TruncateDescription } from '@/utils/TruncateDescriptions'
import { EditOutlined, ReloadOutlined } from '@ant-design/icons'
import { Button, Input } from 'antd'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useState } from 'react'

const Delivery = () => {
  const { role } = getUserInfo() as ITokenObj
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [sortBy, setSortBy] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState<string>('')

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

  // delivery info
  const { isLoading, data } = useGetAllDeliveryWarrantyQuery(query)
  const meta = data?.meta
  const delivery = data?.warranties

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Imei',
      dataIndex: 'imei',
    },
    {
      title: 'Issue date',
      dataIndex: 'issueSubmitDate',
      render: (data: any) => {
        return data && dayjs(data).format('D MMM, YYYY hh:mm A')
      },
    },

    {
      title: 'Issue',
      dataIndex: 'issue',
      render: (data: any) => {
        return data ? TruncateDescription(data, 15) : ''
      },
    },
    {
      title: 'Record time',
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
            <Link href={`/${role}/warranty-list/details/${data.id}`}>
              <Button style={{ margin: '0 3px' }} size="small" type="text">
                <EditOutlined />
              </Button>
            </Link>
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

  // Reset filter
  const resetFilters = () => {
    setSortBy('')
    setSortOrder('')
    setSearchTerm('')
  }
  const shouldShowResetButton = !!sortBy || !!sortOrder || !!searchTerm

  return (
    <div>
      <ActionBar title="Warranty pending list">
        <Input
          type="text"
          size="large"
          placeholder="Search..."
          value={searchTerm}
          style={{ width: '50%', maxWidth: '100%', marginTop: '10px' }}
          onChange={event => setSearchTerm(event.target.value)}
        />
        <div>
          {shouldShowResetButton && (
            <Button type="primary" onClick={resetFilters}>
              <ReloadOutlined />
            </Button>
          )}
        </div>
      </ActionBar>

      <div style={{ marginTop: '15px' }}>
        <POSTable
          loading={isLoading}
          columns={columns}
          dataSource={delivery}
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

export default Delivery
