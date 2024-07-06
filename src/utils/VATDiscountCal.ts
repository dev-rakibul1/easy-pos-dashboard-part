// // Function to calculate VAT
// export function calculateVAT(basePrice: number, vatRate: number) {
//   if (basePrice <= 0 || vatRate <= 0) {
//     return { vatAmount: 0, totalPrice: basePrice }
//   }

//   const vatAmount = basePrice * (vatRate / 100)
//   const totalPrice = basePrice + vatAmount

//   return {
//     vatAmount: vatAmount.toFixed(2),
//     totalPrice: totalPrice.toFixed(2),
//   }
// }

// Function to calculate VAT and apply discount
export function calculatePriceWithVAT(
  basePrice: number,
  vatRate: number,
  discountRate: number
) {
  if (basePrice <= 0 || vatRate < 0 || discountRate < 0) {
    return { vatAmount: 0, discountAmount: 0, totalPrice: basePrice }
  }

  const discountAmount = basePrice * (discountRate / 100)
  const discountedPrice = basePrice - discountAmount
  const vatAmount = discountedPrice * (vatRate / 100)
  const totalPrice = discountedPrice + vatAmount

  return {
    discountAmount: discountAmount.toFixed(2),
    vatAmount: vatAmount.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  }
}
