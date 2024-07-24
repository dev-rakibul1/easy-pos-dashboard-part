'use client'

import { flexCenter } from '@/components/styles/style'
import { useGetSingleSellGroupByOwnIdQuery } from '@/redux/api/sellGroups/sellGroupApi'

const SellDetailsPage = ({ params }: any) => {
  const id = params?.id
  const { data, isLoading } = useGetSingleSellGroupByOwnIdQuery(id)
  //   console.log(data)
  return (
    <div style={flexCenter}>
      <h2>The page is under develop processing...</h2>
    </div>
  )
}

export default SellDetailsPage
