'use client'

import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import ShopForm from '@/components/ShopInfo/ShopForm'
import ActionBar from '@/components/ui/ActionBar'
import { getUserInfo } from '@/services/auth.services'
import { ITokenObj } from '@/types'

const ShopInfo = () => {
  const { role } = getUserInfo() as ITokenObj

  return (
    <div>
      <PosBreadcrumb
        items={[
          {
            label: `${role}`,
            link: `/${role}`,
          },
          {
            label: `Shop information`,
            link: `/${role}/shop-information`,
          },
        ]}
      />

      <ActionBar title="Shop/Company information collected form."></ActionBar>

      <ShopForm />
    </div>
  )
}

export default ShopInfo
