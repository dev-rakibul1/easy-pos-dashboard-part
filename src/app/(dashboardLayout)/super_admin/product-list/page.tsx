'use client'

import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import DeleteModal from '@/components/deleteModal/DeleteModal'
import ActionBar from '@/components/ui/ActionBar'
import POSTable from '@/components/ui/POSTable'
import {
  useDeleteProductMutation,
  useGetAllProductQuery,
} from '@/redux/api/productApi/productApi'
import { useDebounced } from '@/redux/hooks'
import { getUserInfo } from '@/services/auth.services'
import { IProduct, IVariant } from '@/types'
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import { Button, Input, Tooltip, message } from 'antd'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useState } from 'react'

const ProductListPage = () => {
  const { role } = getUserInfo() as any
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [sortBy, setSortBy] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState<string>('')
  // const [deleteId, setDeleteId] = useState<string | null>(null)

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

  const { isLoading, data } = useGetAllProductQuery(query)
  const meta = data?.meta
  const products = data?.products

  // console.log(products)

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
                onClick={() => handleDeleteClick(data)}
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

  // -----------Delete modal-----------
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<IProduct | null>(null)
  const [deleteRecord] = useDeleteProductMutation()

  type IRecord = {
    name?: string
    id?: string
  }

  const recordPayloads: IRecord = {
    name: selectedRecord?.productName,
    id: selectedRecord?.id,
  }

  const handleDeleteClick = (record: IProduct) => {
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
        entityType="Product"
        entityName={recordPayloads}
      />

      <ActionBar title="Product list">
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
            <Link href={`/${role}/add-product`}>
              <Button type="primary">Create</Button>
            </Link>
          )}
        </div>
      </ActionBar>

      <PosBreadcrumb
        items={[
          {
            label: `${role}`,
            link: `/${role}`,
          },
          {
            label: `Product list`,
            link: `/${role}/product-lists`,
          },
        ]}
      />

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
        />
      </div>
    </div>
  )
}

export default ProductListPage
