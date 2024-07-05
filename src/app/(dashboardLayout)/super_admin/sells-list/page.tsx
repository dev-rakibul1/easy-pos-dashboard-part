'use client'

import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import DeleteModal from '@/components/deleteModal/DeleteModal'
import ActionBar from '@/components/ui/ActionBar'
import POSTable from '@/components/ui/POSTable'
import UnitModals from '@/modals/unit/UnitModals'
import { useGetAllSellGroupQuery } from '@/redux/api/sellGroups/sellGroupApi'
import { useDeleteUnitMutation } from '@/redux/api/unitApi/unitApi'
import { useDebounced } from '@/redux/hooks'
import { getUserInfo } from '@/services/auth.services'
import { ICustomer, IUnitDataResponse } from '@/types'
import { DeleteOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons'
import { Button, Input, message } from 'antd'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useState } from 'react'

const SellsListPage = () => {
  const { role } = getUserInfo() as any
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [sortBy, setSortBy] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  interface CustomerPurchase {
    quantity?: number
    totalPurchaseAmounts?: number
    totalDue?: number
    totalPay?: number
    customer?: ICustomer
  }

  interface SellGroup {
    id: string
    uniqueId: string
    createdAt: string
    customerPurchase?: CustomerPurchase
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
  const { isLoading, data } = useGetAllSellGroupQuery(query)
  const meta = data?.meta
  const sellGroups = data?.sellGroups
  // console.log(sellGroups)

  const columns = [
    {
      title: 'INV. NO',
      dataIndex: 'uniqueId',
    },
    {
      title: 'CUSTOMER N.',
      dataIndex: ['customerPurchase', 'customer', 'firstName'],
      render: (text: string, record: any) => {
        return `${
          !record?.customerPurchase?.customer?.firstName &&
          !record?.customerPurchase?.customer?.lastName
            ? 'N/A'
            : `${record?.customerPurchase?.customer?.firstName || ''} ${
                record?.customerPurchase?.customer?.lastName || ''
              }`.trim()
        }`
      },
    },
    {
      title: 'PHONE N.',
      render: (record: SellGroup) =>
        record?.customerPurchase?.customer?.phoneNo || 'N/A',
    },
    {
      title: 'EMAIL A.',
      render: (record: SellGroup) =>
        record?.customerPurchase?.customer?.email || 'N/A',
    },
    {
      title: 'QTY',
      render: (record: SellGroup) =>
        record?.customerPurchase?.quantity || 'N/A',
    },
    {
      title: 'TOTAL P.',

      render: (record: SellGroup) =>
        record?.customerPurchase?.totalPurchaseAmounts || 'N/A',
    },
    {
      title: 'TOTAL D.',

      render: (record: SellGroup) =>
        record?.customerPurchase?.totalDue || 'N/A',
    },
    {
      title: 'TOTAL P.',
      render: (record: SellGroup) =>
        record?.customerPurchase?.totalPay || 'N/A',
    },
    {
      title: 'P. DATE',
      dataIndex: 'createdAt',
      sorter: true,
      render: (data: any) => {
        return data && dayjs(data).format('D MMM, YYYY hh:mm A')
      },
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
            label: `Sell list`,
            link: `/${role}/sells-list`,
          },
        ]}
      />

      <ActionBar title="Sell lists">
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
          dataSource={sellGroups}
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

export default SellsListPage
