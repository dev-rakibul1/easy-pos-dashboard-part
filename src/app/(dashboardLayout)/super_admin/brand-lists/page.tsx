'use client'

import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import DeleteModal from '@/components/deleteModal/DeleteModal'
import ActionBar from '@/components/ui/ActionBar'
import POSTable from '@/components/ui/POSTable'
import BrandModal from '@/modals/brand/Brand'
import {
  useDeleteBrandMutation,
  useGetAllBrandQuery,
} from '@/redux/api/brandApi/brandApi'
import { useDebounced } from '@/redux/hooks'
import { getUserInfo } from '@/services/auth.services'
import { IBrandResponse, ITokenObj } from '@/types'
import { TruncateDescription } from '@/utils/TruncateDescriptions'
import { DeleteOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons'
import { Button, Input, message } from 'antd'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useState } from 'react'

const BrandLists = () => {
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

  const { isLoading, data } = useGetAllBrandQuery(query)
  const meta = data?.meta
  const brands = data?.brands

  const columns = [
    {
      title: 'Brand Name',
      dataIndex: 'brandName',
    },
    {
      title: 'Summery',
      dataIndex: 'description',
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
            <Link href={`/${role}/brand-lists/edit/${data.id}`}>
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

  // -----------Brand modal-----------
  const [isBrandModal, setIsBrandModal] = useState(false)
  const showBrandModal = () => {
    setIsBrandModal(true)
  }

  const handleBrandOk = () => {
    setIsBrandModal(false)
  }

  const handleBrandCancel = () => {
    setIsBrandModal(false)
  }

  // -----------Delete modal-----------
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<IBrandResponse | null>(
    null
  )
  const [deleteRecord] = useDeleteBrandMutation()

  type IRecord = {
    name?: string
    id?: string
  }

  const recordPayloads: IRecord = {
    name: selectedRecord?.brandName,
    id: selectedRecord?.id,
  }

  const handleDeleteClick = (record: IBrandResponse) => {
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
        entityType="Brand"
        entityName={recordPayloads}
      />
      <PosBreadcrumb
        items={[
          {
            label: `${role}`,
            link: `/${role}`,
          },
          {
            label: `Brand list`,
            link: `/${role}/brand-lists`,
          },
        ]}
      />

      {/* Start Crate a brand */}
      <BrandModal
        handleBrandOk={handleBrandOk}
        showBrandModal={showBrandModal}
        handleBrandCancel={handleBrandCancel}
        isBrandModal={isBrandModal}
        setIsBrandModal={setIsBrandModal}
      />

      <ActionBar title="Brand list">
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
            <Button type="primary" onClick={showBrandModal}>
              Create
            </Button>
          )}
        </div>
      </ActionBar>

      <div style={{ marginTop: '15px' }}>
        <POSTable
          loading={isLoading}
          columns={columns}
          dataSource={brands}
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

export default BrandLists
