import { SearchOutlined } from '@ant-design/icons'
import type { InputRef, TableColumnType, TableColumnsType } from 'antd'
import { Button, Input, Space, Table } from 'antd'
import type { FilterDropdownProps } from 'antd/es/table/interface'
import { useRef, useState } from 'react'

interface DataType {
  key: string
  imeiNumber: string
  ram: string
  rom: string
  purchaseRate: string
  sellingPrice: string
  color: string
}

const ProductVariants = ({ variant }: any) => {
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: keyof DataType
  ) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  const handleReset = (clearFilters: () => void) => {
    clearFilters()
    setSearchText('')
  }

  const getColumnSearchProps = (
    dataIndex: keyof DataType
  ): TableColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false })
              setSearchText((selectedKeys as string[])[0])
              setSearchedColumn(dataIndex)
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close()
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
  })

  const columns: TableColumnsType<DataType> = [
    {
      title: 'Imei Number',
      dataIndex: 'imeiNumber',
      key: 'imeiNumber',
      width: '16.67%',
      ...getColumnSearchProps('imeiNumber'),
    },
    {
      title: 'Ram',
      dataIndex: 'ram',
      key: 'ram',
      width: '16.67%',
      ...getColumnSearchProps('ram'),
    },
    {
      title: 'Rom',
      dataIndex: 'rom',
      key: 'rom',
      width: '16.67%',
      ...getColumnSearchProps('rom'),
    },

    {
      title: 'Color',
      dataIndex: 'color',
      key: 'color',
      width: '16.67%',
      ...getColumnSearchProps('color'),
    },
  ]

  return <Table columns={columns} dataSource={variant} bordered />
}

export default ProductVariants
