import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from './store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

type IDebounced = {
  searchQuery: string
  delay: number
}

export const useDebounced = ({ searchQuery, delay }: IDebounced) => {
  const [debouncedValue, setDebouncedValue] = useState<string>(searchQuery)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(searchQuery)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [searchQuery, delay])

  return debouncedValue
}
