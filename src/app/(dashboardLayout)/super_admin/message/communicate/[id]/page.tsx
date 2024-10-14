'use client'

import {
  PaperClipOutlined,
  PictureOutlined,
  SmileOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Avatar, Button, Input, Layout, List, Menu } from 'antd'

const { Sider, Content } = Layout
const { TextArea } = Input

const messages = [
  { name: 'Md Fazle Rabbi', text: 'Yes, I am', sender: 'customer' },
  {
    name: 'Noushed Ahmed Jholok',
    text: 'ami jani web develop korte aponi j',
    sender: 'user',
  },
  {
    name: 'Md Nazrul Islam',
    text: 'Today I had a little bit of a discussion',
    sender: 'customer',
  },
]

const customerProfile = {
  name: 'Rakibul Islam',
  email: 'rakibul@example.com',
  phone: '+8801234567890',
}

const ChatbotDesign = () => {
  return (
    <Layout style={{ height: '100vh', overflow: 'hidden' }}>
      {/* First Column: Previous/Present Customer List */}
      <Sider
        width={240}
        theme="light"
        style={{
          backgroundColor: '#f0f2f5',
          borderRight: '1px solid #ddd',
          padding: '16px',
          overflowY: 'auto', // Enable scrolling
        }}
      >
        <Menu mode="inline" style={{ height: '100%' }}>
          <List
            itemLayout="horizontal"
            dataSource={messages}
            renderItem={item => (
              <List.Item style={{ padding: '10px 0' }}>
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={item.name}
                  description={
                    <div>
                      <p
                        style={{
                          fontSize: '11px',
                          margin: '0',
                          fontWeight: '300',
                          marginTop: '-10px',
                        }}
                      >
                        1 minute ago
                      </p>
                      <div>
                        {item.text.length > 20
                          ? `${item.text.substring(0, 20)}...`
                          : item.text}
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Menu>
      </Sider>

      {/* Second Column: Chatbot */}
      <Layout style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Content
          style={{
            padding: '24px',
            backgroundColor: '#fff',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto', // Enable scrolling
          }}
        >
          <h3 style={{ marginBottom: '16px' }}>
            Chat with Noushed Ahmed Jholok
          </h3>
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              paddingRight: '8px',
              marginBottom: '16px',
              borderRadius: '4px',
              border: '1px solid #f0f0f0',
              padding: '16px',
              backgroundColor: '#f9f9f9',
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent:
                    msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '10px',
                }}
              >
                <div
                  style={{
                    maxWidth: '60%',
                    padding: '10px',
                    borderRadius: '15px',
                    backgroundColor:
                      msg.sender === 'user' ? '#1890ff' : '#e4e6eb',
                    color: msg.sender === 'user' ? '#fff' : '#000',
                    wordWrap: 'break-word',
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px',
              backgroundColor: '#f0f2f5',
              borderTop: '1px solid #ddd',
            }}
          >
            {/* Icon Buttons (Image, GIF, Emoji) */}
            <div style={{ display: 'flex', gap: '8px', marginRight: '8px' }}>
              <Button
                icon={<PictureOutlined />}
                type="text"
                style={{
                  color: '#888',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '8px',
                }}
              />
              <Button
                icon={<PaperClipOutlined />}
                type="text"
                style={{
                  color: '#888',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '8px',
                }}
              />
              <Button
                icon={<SmileOutlined />}
                type="text"
                style={{
                  color: '#888',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '8px',
                }}
              />
            </div>

            {/* TextArea */}
            <TextArea
              rows={1}
              placeholder="Write a message..."
              style={{
                flex: 1,
                borderRadius: '16px',
                padding: '10px',
                borderColor: '#ddd',
                resize: 'none',
                backgroundColor: '#f5f5f5',
              }}
            />

            {/* Send Button */}
            <Button
              disabled={true}
              style={{
                marginLeft: '8px',
                borderRadius: '16px',
                backgroundColor: '#f5f5f5',
                border: '1px solid #ddd',
                color: '#888',
                height: '40px',
                padding: '0 24px',
              }}
            >
              Send
            </Button>
          </div>
        </Content>
      </Layout>

      {/* Third Column: Current Customer Profile Details */}
      <Sider
        width={240}
        theme="light"
        style={{
          backgroundColor: '#f0f2f5',
          borderLeft: '1px solid #ddd',
          padding: '16px',
          overflowY: 'auto', // Enable scrolling
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <Avatar size={80} icon={<UserOutlined />} />
          <h3 style={{ marginTop: '16px' }}>{customerProfile.name}</h3>
          <p style={{ color: '#888', marginBottom: '8px' }}>
            {customerProfile.email}
          </p>
          <p style={{ color: '#888', marginBottom: '16px' }}>
            {customerProfile.phone}
          </p>
          <Button type="primary" block>
            Contact Customer
          </Button>
        </div>
      </Sider>
    </Layout>
  )
}

export default ChatbotDesign
