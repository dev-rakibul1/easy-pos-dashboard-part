'use client'
import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import Form from '@/components/form/Form'
import FormInput from '@/components/form/FormInput'
import InputTextAreaFields from '@/components/form/InputTextArea'
import ActionBar from '@/components/ui/ActionBar'
import {
  useGetSingleAdditionalExpenseQuery,
  useUpdateAdditionalExpenseMutation,
} from '@/redux/api/additionalExpense/additionalExpenseApi'
import { UpdateAdditionalExpenseYupValidation } from '@/schemas/updateAdditionalExpense/updateAdditionalExpense'
import { getUserInfo } from '@/services/auth.services'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Col, Row, message } from 'antd'
import { useRouter } from 'next/navigation'

type IExpense = {
  expenseAmount: number
  details?: string
}

const EditAdditionalExpense = ({ params }: any) => {
  const { role } = getUserInfo() as any
  const { id } = params

  const { data } = useGetSingleAdditionalExpenseQuery(id)

  const [updateAdditionalExpense] = useUpdateAdditionalExpenseMutation()
  const router = useRouter()

  const onsubmit = async (values: IExpense) => {
    values.expenseAmount = Number(values.expenseAmount)
    message.loading({ content: 'Updating expense...', key: 'updating' })
    try {
      const res = await updateAdditionalExpense({ id, body: values })

      if (res.data) {
        message.success('Additional expense updated success!')
        router.push(`/${role}/additional-expense`)
      }
    } catch (error: any) {
      message.error(error.message)
    }
  }

  const defaultValue = {
    expenseAmount: data?.expenseAmount || 0,
    details: data?.details || '',
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
            label: `Additional Expense`,
            link: `/${role}/additional-expense`,
          },
          {
            label: `Edit`,
            // @ts-ignore
            link: `/${role}/edit/${params?.id}`,
          },
        ]}
      />

      <ActionBar title="Update additional expense "></ActionBar>

      <Form
        submitHandler={onsubmit}
        resolver={yupResolver(UpdateAdditionalExpenseYupValidation)}
        defaultValues={defaultValue}
      >
        <div
          style={{ border: '1px solid #ddd', padding: '15px', margin: '15px' }}
        >
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col className="gutter-row" span={8}>
              <FormInput
                type="number"
                name="expenseAmount"
                size="large"
                label="Expense amount"
              />
            </Col>
            <Col className="gutter-row" span={24} style={{ marginTop: '15px' }}>
              <InputTextAreaFields
                name="details"
                size="large"
                label="Details (optional)"
                rows={5}
                validation={validateWordCount}
              />
            </Col>
          </Row>
        </div>

        <Button type="primary" htmlType="submit">
          Updated
        </Button>
      </Form>
    </div>
  )
}

export default EditAdditionalExpense
