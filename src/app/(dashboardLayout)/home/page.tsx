'use client'
import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import HomeDesign from '@/components/home/Home'
import { flexBetween } from '@/components/styles/style'
import ActionBar from '@/components/ui/ActionBar'
import { getUserInfo } from '@/services/auth.services'
import { ITokenObj } from '@/types'
import { PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import Link from 'next/link'

const HomePage = () => {
  const { role } = getUserInfo() as ITokenObj
  return (
    <div>
      <PosBreadcrumb
        items={[
          {
            label: ``,
            link: ``,
          },
        ]}
      />

      <div style={flexBetween}>
        <ActionBar title="Monthly overview"></ActionBar>

        <Link href={`/${role}/add-sells`}>
          <Button type="primary" icon={<PlusOutlined />}>
            New Sale
          </Button>
        </Link>
      </div>

      <HomeDesign />
    </div>
  )
}

export default HomePage
