'use client'

import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import PurchaseForm from '@/components/purchase/Purchase'
import ActionBar from '@/components/ui/ActionBar'
import { getUserInfo } from '@/services/auth.services'
import { Switch, Typography } from 'antd'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
const { Text } = Typography

type IPurchaseType = {
  purchaseRate: number
  sellingPrice: number
  discounts?: number
  vats?: number
  totalPrice: number
  totalStock?: number
  color?: number
  uniqueId: number
  userId?: string
  productId?: string
  supplierId?: string
}

const AddPurchase = () => {
  const { role } = getUserInfo() as any
  const router = useRouter()
  const [isChecked, setIsChecked] = useState<boolean>(false)

  const onSubmit = async (data: IPurchaseType) => {
    try {
      console.log('from purchase page', data)
    } catch (error: any) {
      console.error(error.message)
    }
  }

  const handleAddSupplier = () => {
    router.push(`/${role}/add-supplier`)
  }
  const handleAddProduct = () => {
    router.push(`/${role}/add-product`)
  }

  const onChange = (checked: boolean) => {
    setIsChecked(checked)
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
            label: `Purchase`,
            link: `/${role}/add-purchase`,
          },
        ]}
      />
      <ActionBar title="Create a new purchase">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'end',
            width: '100%',
            margin: '15px 0',
          }}
        >
          <div style={{ display: 'flex', justifyItems: 'center' }}>
            <Text strong style={{ marginRight: '15px' }}>
              Add variant
            </Text>
            <Switch onChange={onChange} />
          </div>
        </div>
      </ActionBar>
      <div style={{ border: '1px solid #ddd', padding: '15px' }}>
        <PurchaseForm size="small" isChecked={isChecked} />
      </div>
    </div>
  )
}

export default AddPurchase
