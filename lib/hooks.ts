import useSWR from 'swr'
import fetcher from './fetcher'

export const useMe = () => {
  const { data, error } = useSWR('/me', fetcher)

  return {
    user: data,
    isLoading: !data && !error,
    isError: error,
  }
}

export const usePlayList = () => {
  const { data, error } = useSWR('/playlist', fetcher)

  return {
    playlist: data || [],
    isLoading: !data && !error,
    isError: error,
  }
}
