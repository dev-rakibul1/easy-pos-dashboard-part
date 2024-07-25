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

type SupplierPayment = {
  totalPay: number
  supplierId: string
  userId: string
  productId: string
}

export type IPurchaseApiResponse = {
  variants: Variant[]
  purchase: Purchase[]
  supplierPayment: SupplierPayment
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
  apiResponse: IPurchaseApiResponse
): TransformedProduct[] {
  const { variants, purchase } = apiResponse
  let previousData: TransformedProduct[] = []

  if (!purchase || purchase.length === 0) {
    // If there are no new purchases, return the previous data as is
    return previousData
  }

  const newData: TransformedProduct[] = purchase.map(purchaseItem => {
    const associatedVariants = variants.filter(
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

  // Merge new data with previous data
  previousData = [...previousData, ...newData]

  // Return the updated data
  return previousData
}
