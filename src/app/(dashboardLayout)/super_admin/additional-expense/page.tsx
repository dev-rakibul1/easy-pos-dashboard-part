'use client'

import AdditionalExpenseList from '@/components/additionalExpense/AdditionalExpenseList'
import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import ActionBar from '@/components/ui/ActionBar'
import { useAddANewAdditionalExpenseMutation } from '@/redux/api/additionalExpense/additionalExpenseApi'
import { getUserInfo } from '@/services/auth.services'
import { Button, Form, Input, InputNumber, message } from 'antd'
import { useRouter } from 'next/navigation'

type IExpenseResponse = {
  expenseAmount: number
  details: string
}

const AdditionalExpense = () => {
  const { role } = getUserInfo() as any
  const [addANewAdditionalExpense] = useAddANewAdditionalExpenseMutation()
  const [form] = Form.useForm()

  const router = useRouter()

  const onFinish = async (values: IExpenseResponse) => {
    message.loading({
      content: 'Creating additional expense...',
      key: 'Creating',
    })

    try {
      const res = await addANewAdditionalExpense(values)

      if (res?.data) {
        message.success({
          content: 'Creating additional expense success!',
          key: 'Creating',
          duration: 2,
        })
        form.resetFields()
      }
    } catch (error: any) {
      message.error({
        content: error.message,
        key: 'Creating',
        duration: 2,
      })
    }
  }

  const onFinishFailed = (errorInfo: any) => {
    console.error('Failed:', errorInfo)
    message.error('Failed to submit expense')
  }

  const validateWordCount = (_: any, value: string) => {
    const wordCount = value ? value.trim().split(/\s+/).length : 0
    if (wordCount > 1000) {
      return Promise.reject(
        new Error('Expense details cannot exceed 1000 words!')
      )
    }
    return Promise.resolve()
  }

  return (
    <div>
      <PosBreadcrumb
        items={[
          {
            label: `${role}`,
            link: `/${role}`,
          },
          {
            label: `Additional expense`,
            link: `/${role}/additional-expense`,
          },
        ]}
      />
      <ActionBar title="Additional expense"></ActionBar>

      {/* Additional expense */}
      <div
        style={{ border: '1px solid #ddd', padding: '15px', marginTop: '15px' }}
      >
        <Form
          form={form}
          name="expense_form"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Amount"
            name="expenseAmount"
            rules={[
              {
                required: true,
                message: 'Please input the amount!',
              },
              {
                type: 'number',
                min: 0,
                message: 'Amount must be a positive number!',
              },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              placeholder="Enter amount"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Expense Details"
            name="details"
            rules={[
              {
                required: true,
                message: 'Please input the expense details!',
              },
              {
                validator: validateWordCount,
              },
            ]}
          >
            <Input.TextArea
              rows={6}
              placeholder="Enter expense details"
              maxLength={2000} // Assuming average word length of 5 characters for better UX
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>

      <AdditionalExpenseList />
    </div>
  )
}

export default AdditionalExpense
