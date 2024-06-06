'use client'

import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import PurchaseForm from '@/components/purchase/Purchase'
import ActionBar from '@/components/ui/ActionBar'
import { useGetSingleUserQuery } from '@/redux/api/userApi/userApi'
import { getUserInfo } from '@/services/auth.services'
import { Switch, Typography } from 'antd'
import { useState } from 'react'
const { Text } = Typography

const AddPurchase = () => {
  const { role, uniqueId: id } = getUserInfo() as any
  const [isChecked, setIsChecked] = useState<boolean>(false)
  const { data: userData } = useGetSingleUserQuery(id)

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
      <div>
        <PurchaseForm size="small" isChecked={isChecked} userData={userData} />
      </div>
    </div>
  )
}

export default AddPurchase
