'use client'

import { Button, Modal } from 'antd'
import React from 'react'

type IRecord = {
  name?: string
  id?: string
}

interface DeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  entityType: string
  entityName: IRecord
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  entityType,
  entityName,
}) => {
  return (
    <Modal
      title={`Delete ${entityType}`}
      visible={isOpen}
      onCancel={onClose}
      okText="Yes, delete it"
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="delete" type="primary" danger onClick={onConfirm}>
          Yes, delete it
        </Button>,
      ]}
    >
      <p>
        Are you sure you want to delete{' '}
        <span
          style={{
            display: 'inline-block',
            background: 'pink',
            padding: '0px 5px',
            borderRadius: '3px',
            cursor: 'pointer',
          }}
        >
          {entityName?.name}
        </span>
        ?
      </p>
    </Modal>
  )
}

export default DeleteModal
