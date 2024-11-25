import {
  CrownOutlined,
  CustomerServiceOutlined,
  HomeOutlined,
  ProductOutlined,
  QuestionCircleOutlined,
  ReconciliationOutlined,
  RetweetOutlined,
  SettingOutlined,
  UserOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import Link from 'next/link'
import { BiPurchaseTag } from 'react-icons/bi'
import { FaArrowRightLong } from 'react-icons/fa6'
import { LiaSellcast } from 'react-icons/lia'
import { LuWebhook } from 'react-icons/lu'

import { ENUM_USER_ROLE } from './role'

const sidebarItems = (role: string) => {
  const defaultSidebarItems: MenuProps['items'] = [
    {
      label: 'Profile',
      key: 'profile',
      icon: <UserOutlined />,
      children: [
        {
          label: <Link href={`/${role}/profile`}>Profile account</Link>,
          key: `/${role}/profile`,
          icon: <FaArrowRightLong />,
        },
        {
          label: <Link href={`/${role}/change-password`}>Change password</Link>,
          key: `/${role}/change-password`,
          icon: <FaArrowRightLong />,
        },
      ],
    },
  ]
  const defaultHomePage: MenuProps['items'] = [
    {
      label: <Link href={`/home`}>Home</Link>,
      key: 'home',
      icon: <HomeOutlined />,
    },
  ]

  const myPurchase: MenuProps['items'] = [
    {
      label: 'Profile',
      key: 'profile',
      icon: <UserOutlined />,
      children: [
        {
          label: <Link href={`/${role}/profile`}>Profile account</Link>,
          key: `/${role}/profile`,
          icon: <FaArrowRightLong />,
        },
        {
          label: <Link href={`/${role}/change-password`}>Change password</Link>,
          key: `/${role}/change-password`,
          icon: <FaArrowRightLong />,
        },
      ],
    },
  ]

  // Add product
  const manageProductItems: MenuProps['items'] = [
    {
      label: 'Products',
      key: 'product',
      icon: <ProductOutlined />,
      children: [
        {
          label: <Link href={`/${role}/add-product`}>Add product</Link>,
          key: `/${role}/add-product`,
          icon: <FaArrowRightLong />,
        },
        {
          label: <Link href={`/${role}/product-list`}>Product list</Link>,
          key: `/${role}/product-list`,
          icon: <FaArrowRightLong />,
        },
      ],
    },
  ]
  // Add purchase
  const managePurchaseItems: MenuProps['items'] = [
    {
      label: 'Purchases',
      key: 'purchase',
      icon: <BiPurchaseTag />,
      children: [
        {
          label: <Link href={`/${role}/add-purchase`}>Add purchase</Link>,
          key: `/${role}/add-purchase`,
          icon: <FaArrowRightLong />,
        },
        {
          label: <Link href={`/${role}/purchase-list`}>Purchase list</Link>,
          key: `/${role}/purchase-list`,
          icon: <FaArrowRightLong />,
        },
      ],
    },
  ]
  // Add sell
  const manageSellItems: MenuProps['items'] = [
    {
      label: 'Point of Sale',
      key: 'sell',
      icon: <LiaSellcast />,
      children: [
        {
          label: <Link href={`/${role}/add-sells`}>POS</Link>,
          key: `/${role}/add-sell`,
          icon: <FaArrowRightLong />,
        },
        {
          label: <Link href={`/${role}/sells-list`}>Sells list</Link>,
          key: `/${role}/sells-list`,
          icon: <FaArrowRightLong />,
        },
      ],
    },
  ]
  // Add Customer
  const manageCustomersItems: MenuProps['items'] = [
    {
      label: 'Customers',
      key: 'customer',
      icon: <CustomerServiceOutlined />,
      children: [
        {
          label: <Link href={`/${role}/add-customers`}>Add customers</Link>,
          key: `/${role}/manage-customer`,
          icon: <FaArrowRightLong />,
        },
        {
          label: <Link href={`/${role}/customers-list`}>Customers list</Link>,
          key: `/${role}/customers-list`,
          icon: <FaArrowRightLong />,
        },
      ],
    },
  ]
  // Add User
  const manageUsersItems: MenuProps['items'] = [
    {
      label: 'Users',
      key: 'user',
      icon: <UsergroupAddOutlined />,
      children: [
        {
          label: <Link href={`/${role}/add-users`}>Add Users</Link>,
          key: `/${role}/add-user`,
          icon: <FaArrowRightLong />,
        },
        {
          label: <Link href={`/${role}/users-list`}>Users list</Link>,
          key: `/${role}/users-list`,
          icon: <FaArrowRightLong />,
        },
      ],
    },
  ]
  // Add return
  const manageReturnItems: MenuProps['items'] = [
    {
      label: 'Return',
      key: 'return',
      icon: <RetweetOutlined />,
      children: [
        {
          label: <Link href={`/${role}/add-return`}>Return product</Link>,
          key: `/${role}/return product`,
          icon: <FaArrowRightLong />,
        },
        {
          label: <Link href={`/${role}/return-lists`}>return list</Link>,
          key: `/${role}/return-lists`,
          icon: <FaArrowRightLong />,
        },
      ],
    },
  ]
  // Add Supplier
  const manageSupplierItems: MenuProps['items'] = [
    {
      label: 'Supplier',
      key: 'supplier',
      icon: <LiaSellcast />,
      children: [
        {
          label: <Link href={`/${role}/add-supplier`}>Add Supplier</Link>,
          key: `/${role}/supplier`,
          icon: <FaArrowRightLong />,
        },
        {
          label: <Link href={`/${role}/supplier-lists`}>Supplier list</Link>,
          key: `/${role}/supplier-lists`,
          icon: <FaArrowRightLong />,
        },
      ],
    },
  ]
  // Add Warranty
  const manageWarrantyItems: MenuProps['items'] = [
    {
      label: 'Warranty',
      key: 'warranty',
      icon: <CrownOutlined />,
      children: [
        {
          label: <Link href={`/${role}/add-warranty`}>warranty product</Link>,
          key: `/${role}/warranty product`,
          icon: <FaArrowRightLong />,
        },
        {
          label: <Link href={`/${role}/warranty-list`}>Warranty list</Link>,
          key: `/${role}/warranty-list`,
          icon: <FaArrowRightLong />,
        },
      ],
    },
  ]
  // Add Transaction
  const manageTransactionItems: MenuProps['items'] = [
    {
      label: 'Transaction',
      key: 'transaction',
      icon: <LiaSellcast />,
      children: [
        {
          label: (
            <Link href={`/${role}/daily-transaction`}>Daily Transaction</Link>
          ),
          key: `/${role}/transaction product`,
          icon: <FaArrowRightLong />,
        },
        {
          label: (
            <Link href={`/${role}/weekly-transaction`}>Weekly Transaction</Link>
          ),
          key: `/${role}/weekly-transaction`,
          icon: <FaArrowRightLong />,
        },
        {
          label: (
            <Link href={`/${role}/monthly-transaction`}>
              Monthly Transaction
            </Link>
          ),
          key: `/${role}/monthly-transaction`,
          icon: <FaArrowRightLong />,
        },
        {
          label: (
            <Link href={`/${role}/yearly-transaction`}>Yearly Transaction</Link>
          ),
          key: `/${role}/yearly-transaction`,
          icon: <FaArrowRightLong />,
        },
      ],
    },
  ]
  // Add reports
  const manageReportItems: MenuProps['items'] = [
    {
      label: 'Reports',
      key: 'report',
      icon: <ReconciliationOutlined />,
      children: [
        {
          label: (
            <Link href={`/${role}/shop-information`}>Shop/Company info</Link>
          ),
          key: `/${role}/shop-information`,
          icon: <FaArrowRightLong />,
        },
        {
          label: <Link href={`/${role}/sells-report`}>Sells report</Link>,
          key: `/${role}/sells-report`,
          icon: <FaArrowRightLong />,
        },
        {
          label: (
            <Link href={`/${role}/purchase-reports`}>Purchase report</Link>
          ),
          key: `/${role}/purchase-report`,
          icon: <FaArrowRightLong />,
        },
        {
          label: <Link href={`/${role}/return-reports`}>Return report</Link>,
          key: `/${role}/return-reports`,
          icon: <FaArrowRightLong />,
        },
        {
          label: <Link href={`/${role}/expense-reports`}>Expense report</Link>,
          key: `/${role}/expense-reports`,
          icon: <FaArrowRightLong />,
        },
        {
          label: <Link href={`/${role}/loss-reports`}>Loss report</Link>,
          key: `/${role}/loss-reports`,
          icon: <FaArrowRightLong />,
        },
        {
          label: <Link href={`/${role}/profit-reports`}>Profit report</Link>,
          key: `/${role}/profit-reports`,
          icon: <FaArrowRightLong />,
        },
      ],
    },
  ]
  // Stock
  const manageStockItems: MenuProps['items'] = [
    {
      label: 'Stock',
      key: 'stock',
      icon: <ReconciliationOutlined />,
      children: [
        {
          label: <Link href={`/${role}/manage-stock`}>Stock</Link>,
          key: `/${role}/manage-stock`,
          icon: <FaArrowRightLong />,
        },
      ],
    },
  ]
  // Add others
  const manageOthersItems: MenuProps['items'] = [
    {
      label: 'Others',
      key: 'others',
      icon: <QuestionCircleOutlined />,
      children: [
        {
          label: (
            <Link href={`/${role}/additional-expense`}>Additional expense</Link>
          ),
          key: `/${role}/additional-expense`,
          icon: <FaArrowRightLong />,
        },
        {
          label: <Link href={`/${role}/discount-lists`}>Discounts</Link>,
          key: `/${role}/discount-lists`,
          icon: <FaArrowRightLong />,
        },
        {
          label: <Link href={`/${role}/vat-lists`}>Vats</Link>,
          key: `/${role}/vat-lists`,
          icon: <FaArrowRightLong />,
        },
        {
          label: <Link href={`/${role}/unit-lists`}>Units</Link>,
          key: 'units',
          icon: <FaArrowRightLong />,
        },
        {
          label: <Link href={`/${role}/brand-lists`}>Brands</Link>,
          key: 'brand',
          icon: <FaArrowRightLong />,
        },
        {
          label: <Link href={`/${role}/category-lists`}>Categories</Link>,
          key: 'category',
          icon: <FaArrowRightLong />,
        },
        {
          label: <Link href={`/${role}/color-lists`}>Colors</Link>,
          key: 'color',
          icon: <FaArrowRightLong />,
        },
      ],
    },
  ]
  // Add Settings
  const manageSettingItems: MenuProps['items'] = [
    {
      label: 'Setting',
      key: 'setting',
      icon: <SettingOutlined />,
      children: [
        {
          label: <Link href={`/${role}/setting`}>Settings</Link>,
          key: `/${role}/settings`,
          icon: <FaArrowRightLong />,
        },
        {
          label: <Link href={`/${role}/vats`}>Vats</Link>,
          key: `/${role}/vats`,
          icon: <FaArrowRightLong />,
        },
      ],
    },
  ]
  // Add Settings
  const manageThemeSettingsItems: MenuProps['items'] = [
    {
      label: 'Theme Setting',
      key: 'theme-setting',
      icon: <LuWebhook />,
      children: [
        {
          label: <Link href={`/${role}/theme-setting`}>Theme Settings</Link>,
          key: `/${role}/theme-settings`,
          icon: <FaArrowRightLong />,
        },
        {
          label: <Link href={`/${role}/vats`}>Vats</Link>,
          key: `/${role}/vats`,
          icon: <FaArrowRightLong />,
        },
      ],
    },
  ]

  // Role bass routing
  const manageSuperAdmin = [
    ...defaultHomePage,
    ...manageSellItems,
    ...managePurchaseItems,
    ...manageTransactionItems,
    ...manageStockItems,
    ...manageProductItems,
    ...manageSupplierItems,
    ...manageCustomersItems,
    ...manageUsersItems,
    ...manageReturnItems,
    ...manageWarrantyItems,
    ...manageReportItems,
    ...manageOthersItems,
    ...manageSettingItems,
    ...manageThemeSettingsItems,
  ]

  const manageAdmin = [
    ...defaultHomePage,
    ...manageSellItems,
    ...managePurchaseItems,
    ...manageTransactionItems,
    ...manageStockItems,
    ...manageProductItems,
    ...manageSupplierItems,
    ...manageCustomersItems,
    ...manageReturnItems,
    ...manageWarrantyItems,
    ...manageReportItems,
    ...manageOthersItems,
    ...manageSettingItems,
    ...manageThemeSettingsItems,
  ]

  const manageModerator = [
    ...defaultHomePage,
    ...manageSellItems,
    ...manageCustomersItems,
    ...manageStockItems,
    ...manageWarrantyItems,
    ...manageReportItems,
    ...manageOthersItems,
    ...manageSettingItems,
  ]
  const contentManager = [
    ...defaultHomePage,
    ...manageReportItems,
    ...manageSettingItems,
    ...manageThemeSettingsItems,
  ]
  const marketingManager = [
    ...defaultHomePage,
    ...manageReportItems,
    ...manageOthersItems,
  ]
  const user = [...defaultHomePage, ...defaultSidebarItems, ...myPurchase]

  if (role === ENUM_USER_ROLE.SUPER_ADMIN) {
    return manageSuperAdmin
  } else if (role === ENUM_USER_ROLE.ADMIN) {
    return manageAdmin
  } else if (role === ENUM_USER_ROLE.MODERATOR) {
    return manageModerator
  } else if (role === ENUM_USER_ROLE.CONTENT_MANAGER) {
    return contentManager
  } else if (role === ENUM_USER_ROLE.MARKETING_MANAGER) {
    return marketingManager
  } else {
    return user
  }
}

export default sidebarItems
