import { useDeliveryPendingWarrantyMutation } from '@/redux/api/warranty/warrantyApi'
import { Button, Form, message, Select } from 'antd'
import React, { useState } from 'react'

const { Option } = Select

interface RepairFormProps {
  onSubmit: (status: string) => void
  id: string
  email: string
}

const RepairStatusForm: React.FC<RepairFormProps> = ({
  onSubmit,
  id,
  email,
}) => {
  const [status, setStatus] = useState<string | undefined>(undefined)

  const [deliveryPendingWarranty] = useDeliveryPendingWarrantyMutation()

  const handleStatusChange = (value: string) => {
    setStatus(value)
  }

  const handleSubmit = async () => {
    const payloadBody = {
      status: status === 'done' ? false : true,
      email: email,
    }

    if (status === 'done') {
      //   onSubmit(status) // Trigger delivery submission

      const res = await deliveryPendingWarranty({ id, body: payloadBody })
      message.success('Delivery submitted successfully!')
    } else {
      message.warning('Repair not done yet. Cannot submit delivery.')
    }
  }

  return (
    <Form layout="vertical" style={{ maxWidth: 400, margin: 'auto' }}>
      <Form.Item
        label="Repair Status"
        name="status"
        rules={[{ required: true, message: 'Please select a status!' }]}
      >
        <Select
          placeholder="Select Repair Status"
          onChange={handleStatusChange}
        >
          <Option value="pending">Pending</Option>
          <Option value="inProgress">In Progress</Option>
          <Option value="done">Done</Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" onClick={handleSubmit} disabled={!status}>
          Submit Delivery
        </Button>
      </Form.Item>
    </Form>
  )
}

export default RepairStatusForm
