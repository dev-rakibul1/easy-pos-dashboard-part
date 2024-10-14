'use client'

import { BellOutlined } from '@ant-design/icons'
import { Badge, Button, Dropdown, Menu, Modal, Space } from 'antd'
import { useState } from 'react'

// const NavbarStyle = {
//   backgroundColor: '#fff',
//   padding: '10px 20px',
//   borderBottom: '1px solid #ddd',
// }

const notifications = [
  // Example notifications
  'Notification 1',
  'Notification 2',
  'Notification 3',
  'Notification 4',
  'Show a Maximum of 10 Notifications: The dropdown will display up to 10 items.',
  'Notification 5',
  'Notification 6',
  'Notification 7',
  'Notification 8',
  'Notification 9',
  'Notification 10',
  'Notification 11',
  'Notification 12',
]

const NotificationDropdown = () => {
  const [visible, setVisible] = useState(false)

  // Show all notifications in a modal
  const showAllNotifications = () => {
    setVisible(true)
  }

  const handleCancel = () => {
    setVisible(false)
  }

  // Dropdown menu items (up to 10 notifications and "View All")
  const dropdownMenu = (
    <Menu>
      {notifications.slice(0, 10).map((notification, index) => (
        <Menu.Item key={index}>{notification}</Menu.Item>
      ))}
      {notifications.length > 10 && (
        <Menu.Item key="view-all" onClick={showAllNotifications}>
          View All
        </Menu.Item>
      )}
    </Menu>
  )

  return (
    <>
      <Dropdown
        overlay={dropdownMenu}
        trigger={['click']}
        overlayStyle={{
          maxWidth: '250px',
        }}
      >
        <Space wrap size={16}>
          <Badge count={notifications.length} overflowCount={99}>
            <BellOutlined
              style={{ fontSize: '24px', color: '#1890ff', cursor: 'pointer' }}
            />
          </Badge>
        </Space>
      </Dropdown>

      {/* Modal to show all notifications */}
      <Modal
        title="All Notifications"
        visible={visible}
        onCancel={handleCancel}
        footer={<Button onClick={handleCancel}>Close</Button>}
        width={400}
      >
        <ul>
          {notifications.map((notification, index) => (
            <li key={index}>{notification}</li>
          ))}
        </ul>
      </Modal>
    </>
  )
}

export default NotificationDropdown
