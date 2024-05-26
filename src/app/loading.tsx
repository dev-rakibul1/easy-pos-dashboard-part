import { Spin } from 'antd'

const LoadingPage = () => {
  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
      <Spin size="small" />
    </div>
  )
}

export default LoadingPage
