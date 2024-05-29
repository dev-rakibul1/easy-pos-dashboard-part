'use client'

import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import DeleteModal from '@/components/deleteModal/DeleteModal'
import ActionBar from '@/components/ui/ActionBar'
import POSTable from '@/components/ui/POSTable'
import UnitModals from '@/modals/unit/UnitModals'
import { useGetAllUnitQuery } from '@/redux/api/unitApi/unitApi'
import { useDebounced } from '@/redux/hooks'
import { getUserInfo } from '@/services/auth.services'
import { DeleteOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons'
import { Button, Input } from 'antd'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useState } from 'react'

const UnitLists = () => {
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
  const { isLoading, data } = useGetAllUnitQuery(query)
  const meta = data?.meta
  const units = data?.units

  const columns = [
    {
      title: 'Unit Name',
      dataIndex: 'unitName',
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
              onClick={() => showDeleteModal(data.id)}
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

  // -----------Unit modal-----------
  const [isUnitModal, setIsUnitModal] = useState(false)
  const showUnitModal = () => {
    setIsUnitModal(true)
  }

  const handleUnitOk = () => {
    setIsUnitModal(false)
  }

  const handleUnitCancel = () => {
    setIsUnitModal(false)
  }

  // -----------Delete modal-----------
  const [isDeleteModal, setIsDeleteModal] = useState(false)
  const showDeleteModal = (id: string) => {
    setDeleteId(id)
    setIsDeleteModal(true)
  }

  const handleDeleteOk = () => {
    setIsDeleteModal(false)
  }

  const handleDeleteCancel = () => {
    setIsDeleteModal(false)
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
      <DeleteModal
        handleDeleteOk={handleDeleteOk}
        handleDeleteCancel={handleDeleteCancel}
        isDeleteModal={isDeleteModal}
        setIsDeleteModal={setIsDeleteModal}
        deleteId={deleteId}
      />
      <PosBreadcrumb
        items={[
          {
            label: `${role}`,
            link: `/${role}`,
          },
          {
            label: `Unit list`,
            link: `/${role}/unit-lists`,
          },
        ]}
      />

      <ActionBar title="Unit list">
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
            <Button type="primary" onClick={showUnitModal}>
              Create
            </Button>
          )}
        </div>
      </ActionBar>

      {/* Start Create a Unit */}
      <UnitModals
        handleUnitOk={handleUnitOk}
        showUnitModal={showUnitModal}
        handleUnitCancel={handleUnitCancel}
        isUnitModal={isUnitModal}
        setIsUnitModal={setIsUnitModal}
      />

      <div style={{ marginTop: '15px' }}>
        <POSTable
          loading={isLoading}
          columns={columns}
          dataSource={units}
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

export default UnitLists
