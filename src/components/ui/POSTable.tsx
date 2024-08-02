'use client'
import { Table } from 'antd'

type IPosTable = {
  loading?: boolean
  columns?: any
  dataSource?: any
  pageSize?: number
  totalPages?: number
  showSizeChanger?: boolean
  onPaginationChange?: (page: number, pageSize: number) => void
  onTableChange?: (pagination: any, filter: any, sorter: any) => void
  showPagination?: boolean
  summary?: (data: readonly any[]) => React.ReactNode
}

const POSTable = ({
  loading,
  columns,
  dataSource,
  pageSize,
  showPagination = true,
  showSizeChanger = true,
  totalPages,
  onPaginationChange,
  onTableChange,
  summary,
}: IPosTable) => {
  const paginationConfig = showPagination
    ? {
        pageSize: pageSize,
        total: totalPages,
        pageSizeOptions: [5, 10, 20, 50, 100],
        showSizeChanger: showSizeChanger,
        onChange: onPaginationChange,
      }
    : false

  return (
    <Table
      loading={loading}
      columns={columns}
      dataSource={dataSource}
      pagination={paginationConfig}
      onChange={onTableChange}
      bordered
      summary={summary}
    />
  )
}

export default POSTable
