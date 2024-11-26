export const getBaseUrl = (): string => {
  // return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:7000/api/v1/'
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'http://148.135.136.221:8085/api/v1/'
  )
}
