'use client'

import {
  useDeleteAdditionalExpenseMutation,
  useGetAllAdditionalExpenseQuery,
} from '@/redux/api/additionalExpense/additionalExpenseApi'
import { useDebounced } from '@/redux/hooks'
import { getUserInfo } from '@/services/auth.services'
import { IAdditionalExpense } from '@/types'
import { TruncateDescription } from '@/utils/TruncateDescriptions'
import { DeleteOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons'
import { Button, Input, message } from 'antd'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useState } from 'react'
import DeleteModal from '../deleteModal/DeleteModal'
import ActionBar from '../ui/ActionBar'
import POSTable from '../ui/POSTable'

const AdditionalExpenseList = () => {
  const { role } = getUserInfo() as any
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [sortBy, setSortBy] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState<string>('')

  // ----------ADDITIONAL EXPENSE LIST---------
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

  const { isLoading, data } = useGetAllAdditionalExpenseQuery(query)
  const meta = data?.meta
  const additionalExpense = data?.expenses

  const onFinishFailed = (errorInfo: any) => {
    console.error('Failed:', errorInfo)
    message.error('Failed to submit expense')
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'uniqueId',
    },
    {
      title: 'Expense Amount',
      dataIndex: 'expenseAmount',
    },
    {
      title: 'Details',
      dataIndex: 'details',
      render: (data: any) => {
        return data ? TruncateDescription(data, 15) : ''
      },
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
      title: 'Updated At',
      dataIndex: 'updatedAt',
      render: (data: any) => {
        return data && dayjs(data).format('D MMM, YYYY hh:mm A')
      },
    },
    {
      title: 'Action',
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
            <Link href={`/${role}/additional-expense/edit/${data.id}`}>
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

  // -----------Delete modal-----------
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] =
    useState<IAdditionalExpense | null>(null)
  const [deleteRecord] = useDeleteAdditionalExpenseMutation()

  type IRecord = {
    name?: string
    id?: string
  }

  const recordPayloads: IRecord = {
    name: selectedRecord?.uniqueId,
    id: selectedRecord?.id,
  }

  const handleDeleteClick = (record: IAdditionalExpense) => {
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

  return (
    <div>
      {/* Delete modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        entityType="Additional expense"
        entityName={recordPayloads}
      />

      <ActionBar title="Additional expense list">
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
            <Button type="primary">Create</Button>
          )}
        </div>
      </ActionBar>

      <div style={{ marginTop: '15px' }}>
        <POSTable
          loading={isLoading}
          columns={columns}
          dataSource={additionalExpense}
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

export default AdditionalExpenseList
