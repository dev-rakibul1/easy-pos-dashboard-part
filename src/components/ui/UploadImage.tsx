import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import type { GetProp, UploadProps } from 'antd'
import { Flex, Upload, message } from 'antd'
import Image from 'next/image'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result as string))
  reader.readAsDataURL(img)
}

const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!')
  }
  return isJpgOrPng && isLt2M
}

type IImageUpload = {
  name: string
  label?: string
}

const UploadImage = ({ name, label }: IImageUpload) => {
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>()
  const { setValue } = useFormContext()

  const handleChange: UploadProps['onChange'] = info => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return
    }
    if (info.file.status === 'done') {
      setValue(name, info.file.originFileObj)
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as FileType, url => {
        setLoading(false)
        setImageUrl(url)
      })
    }
  }

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  )

  return (
    <>
      {label ? label : null}
      <Flex
        gap="middle"
        wrap
        style={{ border: '1px solid #ddd', padding: '10px' }}
      >
        <Upload
          name={name}
          style={{ width: '100%' }}
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          action="/api/file"
          beforeUpload={beforeUpload}
          onChange={handleChange}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="avatar"
              width={100}
              height={100}
              style={{ width: '100%' }}
            />
          ) : (
            uploadButton
          )}
        </Upload>
      </Flex>
    </>
  )
}

export default UploadImage
