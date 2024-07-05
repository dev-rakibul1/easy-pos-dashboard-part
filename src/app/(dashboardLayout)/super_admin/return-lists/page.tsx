'use client'

import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import DeleteModal from '@/components/deleteModal/DeleteModal'
import ActionBar from '@/components/ui/ActionBar'
import POSTable from '@/components/ui/POSTable'
import { useGetAllReturnGroupQuery } from '@/redux/api/returnGroupApi/returnGroupApi'
import { useDeleteUnitMutation } from '@/redux/api/unitApi/unitApi'
import { useDebounced } from '@/redux/hooks'
import { getUserInfo } from '@/services/auth.services'
import { ICustomer, IUnitDataResponse } from '@/types'
import { DeleteOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons'
import { Button, Input, message } from 'antd'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const ReturnListPage = () => {
  const { role } = getUserInfo() as any
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [sortBy, setSortBy] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const router = useRouter()

  interface supplierReturnPayments {
    quantity?: number
    totalReturnAmount?: number
    totalDue?: number
    totalPay?: number
    customer?: ICustomer
  }

  interface IReturnData {
    id: string
    uniqueId: string
    createdAt: string
    supplierReturnPayments?: supplierReturnPayments
  }
  // Create Search debouncedTerms
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
  const { isLoading, data } = useGetAllReturnGroupQuery(query)
  const meta = data?.meta
  const returnGroups = data?.returnGroups
  // console.log(returnGroups)

  const columns = [
    {
      title: 'RETURN. DATE',
      dataIndex: 'createdAt',
      sorter: true,
      render: (data: any) => {
        return data && dayjs(data).format('D MMM, YYYY hh:mm A')
      },
    },
    {
      title: 'INV. NO',
      dataIndex: 'uniqueId',
    },
    {
      title: 'CUSTOMER N.',
      dataIndex: ['supplierReturnPayments', 'user', 'firstName'],
      render: (text: string, record: any) => {
        return `${
          !record?.supplierReturnPayments?.user?.firstName &&
          !record?.supplierReturnPayments?.user?.lastName
            ? 'N/A'
            : `${record?.supplierReturnPayments?.user?.firstName || ''} ${
                record?.supplierReturnPayments?.user?.lastName || ''
              }`.trim()
        }`
      },
    },
    {
      title: 'PHONE N.',
      render: (record: any) =>
        record?.supplierReturnPayments?.user?.phoneNo || 'N/A',
    },
    {
      title: 'EMAIL A.',
      render: (record: any) =>
        record?.supplierReturnPayments?.user?.email || 'N/A',
    },
    {
      title: 'QTY',
      render: (record: any) =>
        record?.supplierReturnPayments?.quantity || 'N/A',
    },
    {
      title: 'TOTAL P.',

      render: (record: any) =>
        record?.supplierReturnPayments?.totalReturnAmount || 'N/A',
    },
    {
      title: 'TOTAL D.',

      render: (record: any) =>
        record?.supplierReturnPayments?.totalDue || 'N/A',
    },
    {
      title: 'TOTAL P.',
      render: (record: any) =>
        record?.supplierReturnPayments?.totalPay || 'N/A',
    },

    {
      title: 'ACTION',
      render: (data: any) => {
        return (
          <>
            <Button
              style={{ margin: '0 3px' }}
              onClick={() => handleDeleteClick(data)}
              size="small"
              type="text"
              danger
            >
              <DeleteOutlined />
            </Button>
            <Link href={`/${role}/unit-lists/edit/${data.id}`}>
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

  // -----------Delete modal-----------
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] =
    useState<IUnitDataResponse | null>(null)
  const [deleteRecord] = useDeleteUnitMutation()

  type IRecord = {
    name?: string
    id?: string
  }

  const recordPayloads: IRecord = {
    name: selectedRecord?.unitName,
    id: selectedRecord?.id,
  }

  const handleDeleteClick = (record: IUnitDataResponse) => {
    setSelectedRecord(record)
    setIsDeleteModalOpen(true)
  }

  // Confirm button for delete
  const handleConfirmDelete = async () => {
    if (selectedRecord) {
      message.loading({ content: 'Deleting...', key: 'deleting' })
      const id = selectedRecord.id
      try {
        const res = await deleteRecord(id)
        if (res) {
          message.success({
            content: 'Deleted successfully!',
            key: 'deleting',
            duration: 2,
          })
        } else {
          message.error({
            content: 'Delete failed!',
            key: 'deleting',
            duration: 2,
          })
        }
      } catch (error: any) {
        console.error(error)
      } finally {
        setIsDeleteModalOpen(false)
      }
    }
  }

  // Reset filter
  const resetFilters = () => {
    setSortBy('')
    setSortOrder('')
    setSearchTerm('')
  }
  const shouldShowResetButton = !!sortBy || !!sortOrder || !!searchTerm

  // Redirect to add customer page
  const handleAddReturnProduct = () => {
    router.push(`/${role}/add-return`)
  }

  return (
    <div>
      {/* Delete modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        entityType="Unit"
        entityName={recordPayloads}
      />
      <PosBreadcrumb
        items={[
          {
            label: `${role}`,
            link: `/${role}`,
          },
          {
            label: `Return list`,
            link: `/${role}/return-lists`,
          },
        ]}
      />

      <ActionBar title="Returns list">
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
            <Button type="primary" onClick={handleAddReturnProduct}>
              Return product
            </Button>
          )}
        </div>
      </ActionBar>

      <div style={{ marginTop: '15px' }}>
        <POSTable
          loading={isLoading}
          columns={columns}
          dataSource={returnGroups}
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

export default ReturnListPage
