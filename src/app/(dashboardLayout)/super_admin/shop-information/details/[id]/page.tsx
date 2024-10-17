'use client'

import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import ActionBar from '@/components/ui/ActionBar'
import { useGetSingleShopQuery } from '@/redux/api/shop/shopApi'
import { getUserInfo } from '@/services/auth.services'
import { ITokenObj } from '@/types'
import { Descriptions, Spin } from 'antd'
import Link from 'next/link'

type Params = {
  id: string
}

type IProps = {
  params: Params
}

const ShopDetails = ({ params }: IProps) => {
  const { role } = getUserInfo() as ITokenObj
  const id = params?.id
  const { data, isLoading } = useGetSingleShopQuery(id)

  return (
    <div>
      <PosBreadcrumb
        items={[
          {
            label: `${role}`,
            link: `/${role}`,
          },
          {
            label: 'Shop info',
            link: `/${role}/shop-information`,
          },
        ]}
      />

      <ActionBar title="Record shop/company details" />

      {isLoading ? (
        <div>
          <Spin size="small" />
        </div>
      ) : (
        <Descriptions
          bordered
          column={1}
          size="small"
          style={{
            width: '100%',
            maxWidth: '100%',
            margin: '20px auto',
          }}
          contentStyle={{ padding: '8px 16px' }}
          labelStyle={{ padding: '8px 16px', fontWeight: 'bold' }}
        >
          <Descriptions.Item label="Shop Name">
            {data?.shopName || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Owner">
            {data?.owner || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Phone">
            {`${data?.phone}` || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {`${data?.email}` || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Website">
            {(
              <Link href={data?.website} target="_blank">
                Visit Now
              </Link>
            ) || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Working Time">
            {data?.hours || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Products">
            {data?.products || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Shop Type">
            {data?.type || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Location">
            {data?.location || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="About Shop">
            {data?.aboutShop || 'N/A'}
          </Descriptions.Item>
        </Descriptions>
      )}
    </div>
  )
}

export default ShopDetails
