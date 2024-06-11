export interface IMeta {
  limit: string
  page: string
  total: string
}

export type IResponseSuccessType = {
  data: any
  meta?: IMeta
}

export type IGenericErrorMessage = {
  path: string | number
  message: string
}

export type IGenericErrorResponse = {
  statusCode: number
  message: string
  errorMessages: IGenericErrorMessage[]
}

export type IUnitDataResponse = {
  id: string
  unitName: string
  createdAt: string
  updatedAt: string
}

export interface IBrandResponse {
  id: string
  brandName: string
  description?: string
  uniqueId: string
  createdAt: string
  updatedAt: string
}

export type ICategoryResponse = {
  id: string
  categoryName: string
  createdAt: string
  updatedAt: string
}

export type IVariant = {
  id: string
  imeiNumber: string
  ram: string
  rom: string
  color: string
  purchaseRate: number
  sellingPrice: number
  vats: number
  discounts: number
  productId: string
  product: IProduct
  status: string
  createdAt: Date
  updatedAt: Date
}

export type IPurchase = {
  id: string
  purchaseRate: number
  sellingPrice: number
  discounts: number
  vats: number
  totalPrice: number
  totalStock: number
  color: string
  uniqueId: string
  supplierId: string
  suppliers: ISupplier
  userId: string
  users: IUser
  productId: string
  products: IProduct
  additionalPurchaseId?: string | null
  additionalPurchase?: IAdditionalProductPurchase | null
  createdAt: Date
  updatedAt: Date
}

export type IProduct = {
  id: string
  productName: string
  brandName: string
  modelName: string
  processor?: string | null
  unit: string
  category: string
  reOrderAlert: number
  productImage?: string | null
  description?: string | null
  uniqueId?: string | null
  productStock?: number | null
  othersStock?: number | null
  variants?: IVariant[]
  purchases?: IPurchase[]
  createdAt: Date
  updatedAt: Date
}

export type IAdditionalProductPurchase = {
  id: string
  additionalPurchase: IPurchase[]
  createdAt: Date
  updatedAt: Date
}

export type IUser = {
  id: string
  firstName: string
  middleName?: string | null
  lastName: string
  email: string
  phoneNo: string
  gender?: string | null
  nid?: string | null
  presentAddress?: string | null
  permanentAddress?: string | null
  profileImage?: string | null
  role: UserRole
  password: string
  uniqueId: string
  purchases: IPurchase[]
  sells: ISell[]
  supplierPayment: ISupplierPayment[]
  customerPayment: ICustomerPayment[]
  createdAt: Date
  updatedAt: Date
}

export type ICustomerPayment = {
  id: string
  totalPay: number
  totalDue: number
  totalSellPrice: number
  uniqueId: string
  customerId: string
  customer: ICustomer
  userId: string
  user: IUser
  createdAt: Date
  updatedAt: Date
}

export type ICustomer = {
  id: string
  firstName: string
  middleName?: string | null
  lastName: string
  email: string
  phoneNo: string
  nid?: string | null
  presentAddress?: string | null
  permanentAddress?: string | null
  profileImage?: string | null
  uniqueId: string
  purchaseHistory: ISell[]
  payments: ICustomerPayment[]

  createdAt: Date
  updatedAt: Date
}

export type ISupplier = {
  id: string
  firstName: string
  middleName?: string | null
  lastName: string
  email: string
  phoneNo: string
  gender?: string | null
  nid?: string | null
  presentAddress?: string | null
  permanentAddress?: string | null
  profileImage?: string | null
  uniqueId: string
  status?: boolean | null
  payments: ISupplierPayment[]
  purchase: IPurchase[]
  returnHistory: IReturn[]
  createdAt: Date
  updatedAt: Date
}

export type IReturn = {
  id: string
  productName: string
  modelName: string
  uniqueId: string
  imeiNumber: string
  ram: string
  rom: string
  color: string
  purchaseRate: number
  sellingPrice: number
  vats: number
  discounts: number
  variantId: string
  userId: string
  productId: string
  supplierId: string
  supplier: ISupplier
  createdAt: Date
  updatedAt: Date
}

enum UserRole {
  SuperAdmin = 'super_admin',
  Admin = 'admin',
  User = 'user',
  Moderator = 'moderator',
  ContentManager = 'content_manager',
  MarketingManager = 'marketing_manager',
}

export type ISell = {
  id: string
  productName: string
  modelName: string
  vats: number
  discounts: number
  sellingPrice: number
  paymentMethod: string
  totalPay: number
  totalSellPrice: number
  uniqueId: string
  variantId: string
  sellVariantId: string
  sellVariant: ISellVariant
  userId: string
  user: IUser
  customerId: string
  customer: ICustomer
  createdAt: Date
  updatedAt: Date
}

export type ISellVariant = {
  id: string
  imeiNumber: string
  ram: string
  rom: string
  color: string
  purchaseRate: number
  sellingPrice: number
  vats: number
  discounts: number
  sells: ISell[]

  createdAt: Date
  updatedAt: Date
}

export type ISupplierPayment = {
  id: string
  totalPay: number
  totalDue: number
  totalSellPrice: number
  uniqueId: string
  supplierId: string
  supplier: ISupplier
  userId: string
  user: IUser
  createdAt: Date
  updatedAt: Date
}

export type IGenericVariant = {
  concat(values: IGenericVariant): IGenericVariant[]
  imeiNumber: string
  ram?: string
  rom?: string
  color?: string
  productId: string
}

export type IPurchaseFormData = {
  supplierId: string
  userId: string
  productId: string
  purchaseRate: number
  sellingPrice: number
  discounts?: number
  vats?: number
  totalPrice: number
  color: string
  productStock?: number
  othersStock?: number
  ram: string
  room: string
}

export interface IVats {
  id: string
  name: string
  vatType: string
  vatValue: number
  uniqueId: string
  createdAt: string
  updatedAt: string
}
export interface IDiscounts {
  id: string
  name: string
  discountType: string
  discountValue: number
  uniqueId: string
  createdAt: string
  updatedAt: string
}
export interface IColor {
  id: string
  name: string
  colorCode: string
  createdAt: string
  updatedAt: string
}

export interface ISupplierSells {
  id: string
  quantity: number
  totalSellAmounts: number
  totalDue: number
  totalPay: number
  supplierId: string
  userId: string
  productId: string
  createdAt: string // You can use Date if you prefer handling dates as Date objects
  updatedAt: string // You can use Date if you prefer handling dates as Date objects
}
