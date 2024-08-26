'use client'

import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import ActionBar from '@/components/ui/ActionBar'
import { useGetSingleUserQuery } from '@/redux/api/userApi/userApi'
import { getUserInfo } from '@/services/auth.services'

const SuperAdminPage = () => {
  const { role, uniqueId: id } = getUserInfo() as any

  const { data } = useGetSingleUserQuery(id)
  console.log(data)

  return (
    <div>
      <PosBreadcrumb
        items={[
          {
            label: `${role}`,
            link: `/${role}`,
          },
        ]}
      />

      <ActionBar title="Super admin page"></ActionBar>
    </div>
  )
}

export default SuperAdminPage
