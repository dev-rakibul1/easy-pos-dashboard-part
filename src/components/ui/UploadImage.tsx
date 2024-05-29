import { UploadOutlined } from '@ant-design/icons'
import { Button, Space, Upload } from 'antd'

const UploadImage = () => (
  <Space direction="vertical" style={{ width: '100%' }} size="large">
    <Upload
      action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
      listType="picture"
      maxCount={3}
      multiple
    >
      <Button size="large" style={{ width: '100%' }} icon={<UploadOutlined />}>
        Upload (Max: 3)
      </Button>
    </Upload>
  </Space>
)

export default UploadImage
