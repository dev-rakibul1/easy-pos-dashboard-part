'use client'

import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import Form from '@/components/form/Form'
import FormInput from '@/components/form/FormInput'
import InputSelect from '@/components/form/InputSelect'
import ActionBar from '@/components/ui/ActionBar'
import UploadImage from '@/components/ui/UploadImage'
import { brandName, category } from '@/constants/global'
import BrandModal from '@/modals/brand/Brand'
import CategoryModals from '@/modals/category/CategoryModals'
import UnitModals from '@/modals/unit/UnitModals'
import { useGetAllUnitQuery } from '@/redux/api/unitApi/unitApi'
import { createProductYupValidation } from '@/schemas/productSchema/productSchema'
import { getUserInfo } from '@/services/auth.services'
import { IUnitDataResponse } from '@/types'
import CustomButton from '@/utils/Button'
import { PlusOutlined } from '@ant-design/icons'
import { yupResolver } from '@hookform/resolvers/yup'
import { Col, Row } from 'antd'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from 'react-hook-form'
import 'suneditor/dist/css/suneditor.min.css'

const SunEditor = dynamic(() => import('suneditor-react'), { ssr: false })

const FormSunEditor = ({ name, label }: any) => {
  const { control } = useFormContext()

  return (
    <div style={{ marginBottom: '24px' }}>
      {label && <label>{label}</label>}
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <SunEditor
            defaultValue={value}
            onChange={onChange}
            setOptions={{
              buttonList: [
                ['undo', 'redo', 'bold', 'italic', 'underline', 'list'],
                ['link', 'image', 'video'],
                ['font', 'fontSize', 'formatBlock'],
              ],
            }}
            height="200px"
          />
        )}
      />
    </div>
  )
}

const AddProduct = () => {
  const { role } = getUserInfo() as any
  const methods = useForm()

  const onSubmit = async (data: any) => {
    try {
      console.log('from login page', data)
    } catch (error: any) {
      console.error(error.message)
    }
  }

  // Unit options
  const { data } = useGetAllUnitQuery({ limit: 100, page: 1 })
  // @ts-ignore
  const units: IUnitDataResponse[] = data?.units

  const unitOptions = units?.map((unit: IUnitDataResponse) => {
    return {
      label: unit?.unitName,
      value: unit?.unitName,
    }
  })

  console.log(unitOptions)

  // -----------Brand modal-----------
  const [isBrandModal, setIsBrandModal] = useState(false)
  const showBrandModal = () => {
    setIsBrandModal(true)
  }

  const handleBrandOk = () => {
    setIsBrandModal(false)
  }

  const handleBrandCancel = () => {
    setIsBrandModal(false)
  }

  // -----------Unit modal-----------
  const [isUnitModal, setIsUnitModal] = useState(false)
  const showUnitModal = () => {
    setIsUnitModal(true)
  }

  const handleUnitOk = () => {
    setIsUnitModal(false)
  }

  const handleUnitCancel = () => {
    setIsUnitModal(false)
  }

  // -----------Category modal-----------
  const [isCategoryModal, setIsCategoryModal] = useState(false)
  const showCategoryModal = () => {
    setIsCategoryModal(true)
  }

  const handleCategoryOk = () => {
    setIsCategoryModal(false)
  }

  const handleCategoryCancel = () => {
    setIsCategoryModal(false)
  }

  return (
    <FormProvider {...methods}>
      <div>
        <PosBreadcrumb
          items={[
            {
              label: `${role}`,
              link: `/${role}`,
            },
            {
              label: `Product`,
              link: `/${role}/add-product`,
            },
          ]}
        />

        {/* Start Crate a brand */}
        <BrandModal
          handleBrandOk={handleBrandOk}
          showBrandModal={showBrandModal}
          handleBrandCancel={handleBrandCancel}
          isBrandModal={isBrandModal}
          setIsBrandModal={setIsBrandModal}
        />

        {/* Start Crate a Unit */}
        <UnitModals
          handleUnitOk={handleUnitOk}
          showUnitModal={showUnitModal}
          handleUnitCancel={handleUnitCancel}
          isUnitModal={isUnitModal}
          setIsUnitModal={setIsUnitModal}
        />

        {/* Start Create a category */}
        <CategoryModals
          handleCategoryOk={handleCategoryOk}
          showCategoryModal={showCategoryModal}
          handleCategoryCancel={handleCategoryCancel}
          isCategoryModal={isCategoryModal}
          setIsCategoryModal={setIsCategoryModal}
        />

        <ActionBar title="Create a new product" />
        <div style={{ border: '1px solid #ddd', padding: '15px' }}>
          <Form
            submitHandler={onSubmit}
            resolver={yupResolver(createProductYupValidation)}
          >
            <Row gutter={{ xs: 24, sm: 16, md: 24, lg: 24 }}>
              <Col
                style={{ marginTop: '15px' }}
                className="gutter-row"
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 8 }}
                lg={{ span: 6 }}
              >
                <FormInput
                  type="text"
                  name="productName"
                  size="large"
                  label="Product name"
                />
              </Col>
              <Col
                style={{ marginTop: '15px' }}
                className="gutter-row"
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 8 }}
                lg={{ span: 6 }}
              >
                <InputSelect
                  name="brandName"
                  label="Brand name"
                  options={brandName}
                  size="large"
                  addonAfter={<PlusOutlined onClick={showBrandModal} />}
                />
              </Col>
              <Col
                style={{ marginTop: '15px' }}
                className="gutter-row"
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 8 }}
                lg={{ span: 6 }}
              >
                <FormInput
                  type="text"
                  name="modelName"
                  size="large"
                  label="Model name"
                />
              </Col>
              <Col
                style={{ marginTop: '15px' }}
                className="gutter-row"
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 8 }}
                lg={{ span: 6 }}
              >
                <FormInput
                  type="text"
                  name="processor"
                  size="large"
                  label="Processor"
                />
              </Col>
              <Col
                style={{ marginTop: '15px' }}
                className="gutter-row"
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 8 }}
                lg={{ span: 6 }}
              >
                <InputSelect
                  name="unit"
                  label="Unit"
                  options={unitOptions}
                  size="large"
                  addonAfter={<PlusOutlined onClick={showUnitModal} />}
                />
              </Col>
              <Col
                style={{ marginTop: '15px' }}
                className="gutter-row"
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 8 }}
                lg={{ span: 6 }}
              >
                <InputSelect
                  name="category"
                  label="Category"
                  options={category}
                  size="large"
                  addonAfter={<PlusOutlined onClick={showCategoryModal} />}
                />
              </Col>
              <Col
                style={{ marginTop: '15px' }}
                className="gutter-row"
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 8 }}
                lg={{ span: 6 }}
              >
                <FormInput
                  type="number"
                  name="reOrderAlert"
                  size="large"
                  label="Re-order alert"
                />
              </Col>

              <Col
                style={{ marginTop: '15px' }}
                className="gutter-row"
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 8 }}
                lg={{ span: 6 }}
              >
                <UploadImage />
              </Col>
              <Col
                style={{ marginTop: '15px' }}
                className="gutter-row"
                xs={{ span: 24 }}
                sm={{ span: 24 }}
                md={{ span: 24 }}
                lg={{ span: 24 }}
              >
                <FormSunEditor name="description" label="Description" />
              </Col>
            </Row>
            <CustomButton type="primary" htmlType="submit">
              Submit
            </CustomButton>
          </Form>
        </div>
      </div>
    </FormProvider>
  )
}

export default AddProduct
