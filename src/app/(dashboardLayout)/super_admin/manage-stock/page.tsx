'use client'

import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import StockIn from '@/components/manageStock/StockIn'
import StockOut from '@/components/manageStock/StockOut'
import TotalCustomerDebt from '@/components/manageStock/TotalCustomerDebt'
import TotalDebt from '@/components/manageStock/TotalDebt'
import {
  userInfoSupplierSpin,
  warningIconStyle,
  warningIconWrap,
} from '@/components/styles/style'
import {
  useGetStockInProductDependStatusQuery,
  useGetStockOutProductDependStatusQuery,
} from '@/redux/api/productApi/productApi'
import { useDebounced } from '@/redux/hooks'
import { getUserInfo } from '@/services/auth.services'
import { IMeta, IProduct, ITokenObj } from '@/types'
import { Modal, Tabs, TabsProps, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { ImWarning } from 'react-icons/im'

const { Text } = Typography

const ManageStockPage = () => {
  const { role } = getUserInfo() as ITokenObj
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [sortBy, setSortBy] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [isModalVisible, setIsModalVisible] = useState(false)

  //Create Search debouncedTerms
  const debouncedSearchTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  })

  const query = {
    page,
    sortBy,
    sortOrder,
    limit,
    searchTerm: debouncedSearchTerm,
  }

  const { data, isLoading } = useGetStockInProductDependStatusQuery(query)
  const { data: stockOut, isLoading: isOutLoading } =
    useGetStockOutProductDependStatusQuery(query)
  // @ts-ignore
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const products: IProduct[] = data?.products || []
  // @ts-ignore
  const stockInMeta: IMeta = data?.meta
  // @ts-ignore
  const stockOutMeta: IMeta = stockOut?.meta

  const resetFilters = () => {
    setSortBy('')
    setSortOrder('')
    setSearchTerm('')
  }

  // Pagination changer
  const onPaginationChange = (page: number, pageSize: number) => {
    setPage(page)
    setLimit(pageSize)
  }

  const shouldShowResetButton = !!sortBy || !!sortOrder || !!searchTerm

  // Column sort
  const onTableChange = (pagination: any, filters: any, sorter: any) => {
    const { order, field } = sorter
    setSortBy(field)
    setSortOrder(order === 'ascend' ? 'asc' : 'desc')
  }

  // filter product for stock in

  const items: TabsProps['items'] = [
    {
      key: '1',
      // @ts-ignore
      label: `Stock in (${stockInMeta?.total ? stockInMeta?.total : 0})`,
      children: (
        <div style={{ padding: '15px' }}>
          <StockIn
            // @ts-ignore
            data={products}
            // @ts-ignore
            meta={stockInMeta}
            onPaginationChange={onPaginationChange}
            isLoading={isLoading}
            resetFilters={resetFilters}
            shouldShowResetButton={shouldShowResetButton}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            limit={limit}
            onTableChange={onTableChange}
          />
        </div>
      ),
    },
    {
      key: '2',
      // @ts-ignore
      label: `Stock out (${stockOutMeta?.total ? stockOutMeta?.total : 0})`,
      children: (
        <StockOut
          // @ts-ignore
          data={stockOut}
          meta={stockOutMeta}
          onPaginationChange={onPaginationChange}
          isLoading={isOutLoading}
          resetFilters={resetFilters}
          shouldShowResetButton={shouldShowResetButton}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          limit={limit}
          onTableChange={onTableChange}
        />
      ),
    },
    {
      key: '3',
      // @ts-ignore
      label: `Total debt`,
      children: <TotalDebt />,
    },
    {
      key: '4',
      // @ts-ignore
      label: `Customer debt`,
      children: <TotalCustomerDebt />,
    },
  ]

  // Re-order label alert
  const showReOrderLabelAlertModal = () => {
    setIsModalVisible(true)
  }

  const handleReOrderAlertOk = () => {
    setIsModalVisible(false)
  }

  const handleReOrderAlertCancel = () => {
    setIsModalVisible(false)
  }

  // Filter the product
  const lessReOrderLabelProduct = products?.filter(
    product =>
      product?.variants &&
      product?.variants.length < product?.reOrderAlert &&
      product?.variants.length > 0
  )

  useEffect(() => {
    products?.map((product: IProduct) => {
      // First time popup the the alert windows
      if (
        product?.variants &&
        product?.variants.length < product?.reOrderAlert &&
        product?.variants.length > 0
      ) {
        showReOrderLabelAlertModal()
      }

      // After each 15 minutes popup the alert window
      if (
        product?.variants &&
        product?.variants.length < product?.reOrderAlert &&
        product?.variants.length > 0
      ) {
        setTimeout(() => {
          showReOrderLabelAlertModal()
        }, 30000)
      } else if (product.variants && !product.variants.length) {
        false
      }
    })
  }, [products])

  return (
    <>
      <Modal
        title={false}
        visible={isModalVisible}
        onOk={handleReOrderAlertOk}
        onCancel={handleReOrderAlertCancel}
        okText="Oh! Ok"
        cancelText="Cancel"
      >
        <div style={{ width: '100%' }}>
          <div style={warningIconWrap}>
            <div style={warningIconStyle}>
              <ImWarning />
            </div>
          </div>
          <Text strong style={userInfoSupplierSpin}>
            Re-order label alert
          </Text>
          {lessReOrderLabelProduct?.map((product: IProduct, i) => (
            <div key={i + 1}>
              <p
                style={{
                  border: '1px solid #ddd',
                  padding: '5px',
                  marginTop: '7px',
                }}
              >
                {`Name: ${product?.productName} | last stock:
                ${product?.variants?.length}`}
                <audio src="/public/audio/alert.mp3"></audio>
              </p>
            </div>
          ))}
        </div>
      </Modal>
      <PosBreadcrumb
        items={[
          {
            label: `${role}`,
            link: `/${role}`,
          },
          {
            label: `Manage stock`,
            link: `/${role}/manage-stock`,
          },
        ]}
      />
      <Tabs defaultActiveKey="1" items={items} />
    </>
  )
}

export default ManageStockPage
