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
