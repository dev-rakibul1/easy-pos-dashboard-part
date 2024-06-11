'use client'

import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import ActionBar from '@/components/ui/ActionBar'
import { getUserInfo } from '@/services/auth.services'

const page = ({ params }: any) => {
  const { role } = getUserInfo() as any

  return (
    <div>
      <PosBreadcrumb
        items={[
          {
            label: `${role}`,
            link: `/${role}`,
          },
          {
            label: `Supplier list`,
            link: `/${role}/supplier-lists/`,
          },
          {
            label: `Report`,
            // @ts-ignore
            link: `/${role}/supplier-lists/report/${params?.id}`,
          },
        ]}
      />

      <ActionBar title="Report details"></ActionBar>
    </div>
  )
}

export default page
