import { useState } from 'react'

const useApi = (apiFunc: any) => {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<any>(null)
  const [loading, setLoading] = useState<any>(false)
  const [loaded, setLoaded] = useState<any>(false)

  const request = async (...args: any[]) => {
    setLoading(true)
    try {
      const result = await apiFunc(...args)
      setData(result.data)
    } catch (err) {
      setError(err || 'Unexpected Error!')
    } finally {
      setLoading(false)
      setLoaded(true)
    }
  }

  return {
    data,
    error,
    loading,
    loaded,
    request,
  }
}

export default useApi
