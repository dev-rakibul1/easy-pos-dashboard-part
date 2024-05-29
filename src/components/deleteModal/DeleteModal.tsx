'use client'

import { useDeleteUnitMutation } from '@/redux/api/unitApi/unitApi'
import { Modal, message } from 'antd'
import { useState } from 'react'

const DeleteModal = ({
  setIsDeleteModal,
  isDeleteModal,
  handleDeleteOk,
  handleDeleteCancel,
  deleteId: id,
}: any) => {
  const [deleteUnit] = useDeleteUnitMutation()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleOk = async () => {
    setIsDeleting(true)
    try {
      message.loading({ content: 'Deleting...', key: 'deleting' })

      // @ts-ignore
      const res = await deleteUnit(id)

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
      message.error({ content: 'Delete failed!', key: 'deleting', duration: 2 })
    } finally {
      setIsDeleting(false)
      setIsDeleteModal(false)
      handleDeleteOk()
    }
  }

  return (
    <Modal
      title="Confirm Deletion"
      open={isDeleteModal}
      onOk={handleOk}
      confirmLoading={isDeleting}
      onCancel={handleDeleteCancel}
      okText="Yes, delete it"
      cancelText="Cancel"
    >
      <p>Are you sure you want to delete this item?</p>
    </Modal>
  )
}

export default DeleteModal
