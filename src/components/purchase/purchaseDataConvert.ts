type Variant = {
  imeiNumber: string
  ram: string
  rom: string
  color: string
  productId: string
}

type Purchase = {
  purchaseRate: number
  sellingPrice: number
  productStock: number
  userId: string
  supplierId: string
  productId: string
  totalPrice: number
  color: string
  othersStock: number
  vats: number
  discounts: number
  productName: string
  brandName: string
}

type ApiResponse = {
  variants: Variant[]
  purchase: Purchase[]
}

type TransformedProduct = {
  productName: string
  variants: Variant[]
  othersStock: number
  productStock: number
  purchaseRate: number
  sellingPrice: number
  vats: number
  discounts: number
  totalPrice: number
  productId: string
  supplierId: string
}

export function TransformPurchaseApiResponse(
  apiResponse: ApiResponse
): TransformedProduct[] {
  const { variants, purchase } = apiResponse

  return purchase?.map(purchaseItem => {
    const associatedVariants = variants?.filter(
      variant => variant.productId === purchaseItem.productId
    )

    return {
      productName: purchaseItem.productName,
      variants: associatedVariants,
      othersStock: purchaseItem.othersStock,
      productStock: purchaseItem.productStock,
      purchaseRate: purchaseItem.purchaseRate,
      sellingPrice: purchaseItem.sellingPrice,
      vats: purchaseItem.vats,
      discounts: purchaseItem.discounts,
      totalPrice: purchaseItem.totalPrice,
      productId: purchaseItem.productId,
      supplierId: purchaseItem.supplierId,
    }
  })
}
