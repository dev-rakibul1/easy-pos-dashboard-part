'use client'

import {
  useDeleteShopRecordMutation,
  useGetAllShopQuery,
} from '@/redux/api/shop/shopApi'
import { getUserInfo } from '@/services/auth.services'
import { IShopFormAPIs, ITokenObj } from '@/types'
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons'
import { Button, message, Tooltip } from 'antd'
import Link from 'next/link'
import { useState } from 'react'
import DeleteModal from '../deleteModal/DeleteModal'
import POSTable from '../ui/POSTable'

const ShopList = () => {
  const { role } = getUserInfo() as ITokenObj
  const { data, isLoading } = useGetAllShopQuery({ limit: 10 })

  const record = data?.shop

  const columns = [
    {
      title: 'Shop Name',
      dataIndex: 'shopName',
    },
    {
      title: 'Work Time',
      dataIndex: 'hours',
    },
    {
      title: 'Establish Date',
      dataIndex: 'establishedDate',
    },
    {
      title: 'Shop Type',
      dataIndex: 'type',
    },

    {
      title: 'Action',
      render: (data: any) => {
        return (
          <>
            <Tooltip title="Details">
              <Link href={`/${role}/shop-information/details/${data.id}`}>
                <Button
                  style={{ margin: '0 3px' }}
                  //   onClick={() => handleDeleteClick(data)}
                  size="small"
                  type="text"
                >
                  <EyeOutlined />
                </Button>
              </Link>
            </Tooltip>

            <Tooltip title="Edit/Update">
              <Link href={`/${role}/shop-information/edit/${data.id}`}>
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

  // -----------Delete modal-----------
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<IShopFormAPIs | null>(
    null
  )
  const [deleteRecord] = useDeleteShopRecordMutation()

  type IRecord = {
    name?: string
    id?: string
  }

  const recordPayloads: IRecord = {
    name: selectedRecord?.shopName,
    id: selectedRecord?.id,
  }

  const handleDeleteClick = (record: IShopFormAPIs) => {
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
    <>
      {/* Delete modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        entityType="Shop/Company record"
        entityName={recordPayloads}
      />
      <div style={{ marginTop: '25px' }}>
        <POSTable
          loading={isLoading}
          columns={columns}
          dataSource={record}
          showPagination={false}
          showSizeChanger={false}
        />
      </div>
    </>
  )
}

export default ShopList
