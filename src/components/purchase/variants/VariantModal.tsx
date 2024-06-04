import { Modal } from 'antd'
import DynamicForm from './VariantsForm'

const VariantModal = ({
  openVariantModal,
  setOpenVariantModal,
  count,
  variants,
  setVariants,
}: any) => {
  return (
    <>
      <Modal
        title="Add variants"
        centered
        visible={openVariantModal}
        onCancel={() => setOpenVariantModal(false)}
        width={1000}
        footer={null}
      >
        <DynamicForm
          count={count}
          setOpenVariantModal={setOpenVariantModal}
          setVariants={setVariants}
          variants={variants}
        />
      </Modal>
    </>
  )
}

export default VariantModal
