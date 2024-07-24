'use client'

import { useGetSellByCurrentMonthQuery } from '@/redux/api/sells/sellsApi'

const CurrentMonthlyVat = () => {
  const { data, isLoading } = useGetSellByCurrentMonthQuery({
    limit: 1200,
  })

  return <div>page {data?.length}</div>
}

export default CurrentMonthlyVat
