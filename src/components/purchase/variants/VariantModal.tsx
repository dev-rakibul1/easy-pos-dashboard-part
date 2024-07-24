import { Modal } from 'antd'
import DynamicForm from './VariantsForm'

const VariantModal = ({
  openVariantModal,
  setOpenVariantModal,
  count,
  productId,
  onFormSubmit,
}: any) => {
  return (
    <>
      <Modal
        title="Add variants"
        centered
        visible={openVariantModal}
        onCancel={() => setOpenVariantModal(false)}
        width={960}
        footer={null}
      >
        <DynamicForm
          count={count}
          setOpenVariantModal={setOpenVariantModal}
          productId={productId}
          onFormSubmit={onFormSubmit}
        />
      </Modal>
    </>
  )
}

export default VariantModal
