'use client'

export const GetErrorMessageByPropertyName = (errors: any, name: string) => {
  const properties = name.split('.')
  let value = errors

  for (let prop of properties) {
    if (value[prop]) {
      value = value[prop]
    } else {
      return undefined
    }
  }

  return value.message
}
