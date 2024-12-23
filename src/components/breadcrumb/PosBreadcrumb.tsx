'use client'

import { HomeOutlined } from '@ant-design/icons'
import { Breadcrumb } from 'antd'
import Link from 'next/link'

const PosBreadcrumb = ({
  items,
}: {
  items: { label: string; link: string }[]
}) => {
  const breadcrumbItems = [
    {
      title: (
        <Link href="/">
          <HomeOutlined />
        </Link>
      ),
    },

    ...items.map(item => {
      return {
        title: item.link ? (
          <Link href={item.link}>{item.label}</Link>
        ) : (
          <span>{item.label}</span>
        ),
      }
    }),
  ]

  return (
    <Breadcrumb
      style={{ margin: '10px 0' }}
      items={breadcrumbItems}
    ></Breadcrumb>
  )
}

export default PosBreadcrumb
