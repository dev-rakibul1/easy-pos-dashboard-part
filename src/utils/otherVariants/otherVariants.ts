// other stock or cover and glass and so on feature develop
export const OtherVariants = (
  stock: number = 0,
  ram: string,
  rom: string,
  color: string,
  productId: string
) => {
  let arr: any[] = []
  for (let i = 0; i < stock; i++) {
    arr.push(i)
  }
  const otherVariants = arr?.map(variant => ({
    imeiNumber: 'N/A',
    ram: ram,
    rom: rom,
    color: color,
    productId,
  }))
  return otherVariants
}
