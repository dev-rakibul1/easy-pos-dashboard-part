'use client'

import PosBreadcrumb from '@/components/breadcrumb/PosBreadcrumb'
import Form from '@/components/form/Form'
import FormInput from '@/components/form/FormInput'
import InputSelect from '@/components/form/InputSelect'
import ActionBar from '@/components/ui/ActionBar'
import { useGetAllBrandQuery } from '@/redux/api/brandApi/brandApi'
import { useGetAllCategoryQuery } from '@/redux/api/categoryApi/categoryApi'
import {
  useGetSingleProductQuery,
  useUpdateProductMutation,
} from '@/redux/api/productApi/productApi'
import { useGetAllUnitQuery } from '@/redux/api/unitApi/unitApi'
import { getUserInfo } from '@/services/auth.services'
import { IBrandResponse, ICategoryResponse, IUnitDataResponse } from '@/types'
import { Button, Col, Row, message } from 'antd'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
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

const ProductEditPage = ({ params }: any) => {
  const { role } = getUserInfo() as any
  const methods = useForm()

  const { id } = params
  const { data } = useGetSingleProductQuery(id)
  const [updateProduct] = useUpdateProductMutation()
  const router = useRouter()

  const onSubmit = async (values: any) => {
    console.log(values)
    message.loading({ content: 'Updating product...', key: 'updating' })
    try {
      const res = await updateProduct({ id, body: values })

      if (res.data) {
        message.success('Product updated success!')
        router.push(`/${role}/product-list`)
      }
    } catch (error: any) {
      message.error(error.message)
    }
  }

  // Unit options
  const { data: getUnits } = useGetAllUnitQuery({ limit: 100, page: 1 })
  // @ts-ignore
  const units: IUnitDataResponse[] = getUnits?.units

  const unitOptions = units?.map((unit: IUnitDataResponse) => {
    return {
      label: unit?.unitName,
      value: unit?.unitName,
    }
  })

  // Brand options
  const { data: brandData } = useGetAllBrandQuery({ limit: 100, page: 1 })
  // @ts-ignore
  const brands: IBrandResponse[] = brandData?.brands

  const brandOptions = brands?.map((brand: IBrandResponse) => {
    return {
      label: brand?.brandName,
      value: brand?.brandName,
    }
  })

  // Category options
  const { data: categoryData } = useGetAllCategoryQuery({ limit: 100, page: 1 })
  // @ts-ignore
  const categories: ICategoryResponse[] = categoryData?.categories

  const catagoriesOption = categories?.map((category: ICategoryResponse) => {
    return {
      label: category?.categoryName,
      value: category?.categoryName,
    }
  })

  // Default value
  const defaultValue = {
    productName: data?.productName || '',
    brandName: data?.brandName || '',
    modelName: data?.modelName || '',
    processor: data?.processor || '',
    unit: data?.unit || '',
    category: data?.category || '',
    reOrderAlert: data?.reOrderAlert || 0,
    description: data?.description || '',
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

        <ActionBar title="Create a new product" />
        <div style={{ border: '1px solid #ddd', padding: '15px' }}>
          <Form submitHandler={onSubmit} defaultValues={defaultValue}>
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
                  options={brandOptions}
                  size="large"
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
                {/* <FormInput type="text" name="unit" size="large" label="Unit" /> */}
                <InputSelect
                  name="unit"
                  label="Unit"
                  options={unitOptions}
                  size="large"
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
                  options={catagoriesOption}
                  size="large"
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
            </Row>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginTop: '10px' }}
            >
              Updated
            </Button>
          </Form>
        </div>
      </div>
    </FormProvider>
  )
}

export default ProductEditPage
