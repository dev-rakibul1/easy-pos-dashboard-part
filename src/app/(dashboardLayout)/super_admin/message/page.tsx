'use client'

import { getUserInfo } from '@/services/auth.services'
import { ITokenObj } from '@/types'
import { placeholderImage } from '@/utils/placeholderImage/placeholderImage'
import { MessageOutlined } from '@ant-design/icons'
import { Badge, Dropdown, Menu, Space } from 'antd'
import Image from 'next/image'
import Link from 'next/link'

// Mock data for messages
const Messages = [
  { name: 'Md Fazle Rabbi', text: 'Yes, I am', image: placeholderImage, id: 1 },
  {
    name: 'Noushed Ahmed Jholok',
    text: 'ami jani web develop korte aponi j',
    image: placeholderImage,
    id: 2,
  },
  {
    name: 'Md Nazrul Islam',
    text: 'Today I had a little bit of a discussion',
    image: placeholderImage,
    id: 3,
  },
]

// Dropdown menu component
const Message = () => {
  const { role } = getUserInfo() as ITokenObj
  const dropdownMenu = (
    <Menu>
      <ul
        style={{ padding: 0, margin: 0, listStyle: 'none', cursor: 'pointer' }}
      >
        {Messages.slice(0, 10).map((item, index) => (
          <Link
            href={`/${role}/message/communicate/${item?.id}`}
            key={index}
            passHref
          >
            <li
              style={{
                display: 'flex',
                justifyContent: 'start',
                alignItems: 'start',
                borderTop: index !== 0 ? '1px solid #ddd' : 'none',
                padding: '7px',
              }}
            >
              <div style={{ marginRight: '10px' }}>
                <Image
                  style={{ borderRadius: '50%' }}
                  src={item.image}
                  width={40}
                  height={40}
                  alt="customer"
                />
              </div>
              <div>
                <h5 style={{ margin: '0 0 -5px 0' }}>{item.name}</h5>
                <p
                  style={{
                    fontSize: '11px',
                    margin: '0',
                    fontWeight: '300',
                  }}
                >
                  1 minute ago
                </p>
                <p style={{ margin: '0' }}>
                  {item.text.length > 20
                    ? `${item.text.substring(0, 20)}...`
                    : item.text}
                </p>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </Menu>
  )

  return (
    <Dropdown
      overlay={dropdownMenu}
      trigger={['click']}
      overlayStyle={{
        maxWidth: '250px',
      }}
    >
      <Space wrap size={16}>
        <Badge count={Messages.length} overflowCount={99}>
          <MessageOutlined
            style={{ fontSize: '24px', color: '#1890ff', cursor: 'pointer' }}
          />
        </Badge>
      </Space>
    </Dropdown>
  )
}

export default Message
