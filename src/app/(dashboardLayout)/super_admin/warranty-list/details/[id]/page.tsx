'use client'

import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import ActionBar from '@/components/ui/ActionBar'
import RepairStatusForm from '@/components/warranty/deliveryForm/DeliverySubmit'
import { useGetSinglePendingQuery } from '@/redux/api/warranty/warrantyApi'
import { getUserInfo } from '@/services/auth.services'
import { ITokenObj } from '@/types'
import { getWarrantyDate } from '@/utils/warranty/warrantyDate'
import { Col, Descriptions, Empty, Row, Spin } from 'antd'
import dayjs from 'dayjs'

interface WarrantyDetailsProps {
  params: { id: string }
}

const WarrantyDetails = ({ params }: WarrantyDetailsProps) => {
  const { role } = getUserInfo() as ITokenObj
  const id = params?.id
  const { data, error, isLoading } = useGetSinglePendingQuery(id)
  console.log(data)
  return (
    <div>
      <PosBreadcrumb
        items={[
          {
            label: `${role}`,
            link: `/${role}`,
          },
          {
            label: `Warranty list`,
            link: `/${role}/warranty-list`,
          },
        ]}
      />
      <ActionBar title="Warranty pending details information" />

      {isLoading ? (
        <div
          style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}
        >
          <Spin size="small" />
        </div>
      ) : (
        <>
          <Row gutter={[32, 32]} style={{ marginTop: '25px' }}>
            <Col xs={24} sm={24} md={18} lg={18}>
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
                <Descriptions.Item label="Name">
                  {data?.name || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                  {data?.phone || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {data?.email || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Imei">
                  {`${data?.imei}` || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Model">
                  {data?.model || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  {data?.status ? 'Pending' : 'Delivered' || 'N/A'}
                </Descriptions.Item>

                {data?.deliveryTime && (
                  <Descriptions.Item label="Delivery Time">
                    {data?.deliveryTime
                      ? dayjs(data?.deliveryTime).format('D MMM, YYYY hh:mm A')
                      : 'N/A'}
                  </Descriptions.Item>
                )}

                <Descriptions.Item label="Warranty Id">
                  {data?.uniqueId || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Issue submit date">
                  {data?.issueSubmitDate
                    ? dayjs(data.issueSubmitDate).format('D MMM, YYYY hh:mm A')
                    : 'N/A'}
                </Descriptions.Item>

                <Descriptions.Item label="Selling ID">
                  {data?.uniqueId || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Total repair">
                  {data?.repairCount === 1
                    ? 'First time'
                    : data?.repairCount || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Previous repair">
                  {data?.repairHistory === 'no' ? 'No' : 'Yes' || 'N/A'}
                </Descriptions.Item>

                <Descriptions.Item label="Purchase Date">
                  {data?.purchaseDate
                    ? dayjs(data.purchaseDate).format('D MMM, YYYY hh:mm A')
                    : 'N/A'}
                </Descriptions.Item>

                <Descriptions.Item label="Calculate Date">
                  {data?.purchaseDate
                    ? getWarrantyDate(data.purchaseDate)
                    : 'N/A'}
                </Descriptions.Item>

                <Descriptions.Item label="Issue details">
                  {data?.issue || 'N/A'}
                </Descriptions.Item>
              </Descriptions>
            </Col>

            {/* Repair status form */}
            <Col xs={24} sm={24} md={6} lg={6}>
              {data?.status ? (
                // @ts-ignore
                <RepairStatusForm id={id} email={data?.email} />
              ) : (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '50vh',
                  }}
                >
                  <Empty
                    description={`Product already delivered!`}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                </div>
              )}
            </Col>
          </Row>
        </>
      )}
    </div>
  )
}

export default WarrantyDetails
