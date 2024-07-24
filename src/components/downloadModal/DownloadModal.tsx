import { Modal } from 'antd'

interface DownloadModalProps {
  isModalVisible: boolean
  handleDownloadOk: () => void
  handleDownloadCancel: () => void
  title: string
  handlePrint: () => void
  body: string
}

const DownloadModal: React.FC<DownloadModalProps> = ({
  isModalVisible,
  handleDownloadOk,
  handleDownloadCancel,
  title,
  handlePrint,
  body,
}) => {
  const onOk = () => {
    handlePrint() // Call the print function
    handleDownloadOk() // Then close the modal
  }

  return (
    <Modal
      title={title}
      visible={isModalVisible}
      onOk={onOk}
      onCancel={handleDownloadCancel}
      okText="Yes, it"
      cancelText="No"
    >
      <p>{body ? body : 'N/A'}</p>
    </Modal>
  )
}

export default DownloadModal
