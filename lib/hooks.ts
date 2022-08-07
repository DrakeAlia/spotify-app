import useSWR from 'swr'
import fetcher from './fetcher'

// “SWR”(stale-while-revalidate) - is a strategy to first return the
// data from cache (stale), then send the fetch request (revalidate),
// and finally come with the up-to-date data.

// This component will have custom hooks that will get all the user's
// information and playlists will be filled out from our db on the home page

// The first hook we're going to make is going to be a hook that
// gets the user

export const useMe = () => {
  // use the swr hook inside of our custom hook and the first arg of swr is the cache key(API route) of where you want to store
  // the cache keys usually just use a route, we as users know this was for the "/me", this was for the "/playlist", etc. That is where this is stored and
  // it'll pass whatever is in here into our fetcher with the second arg "/me"
  // So we wanna use SWR to go to "/me", it's gonna take this arg "/me", pass it to fetcher.
  const { data, error } = useSWR('/me', fetcher)
  // return an object that has the user on it
  // loading state and if there's not data and there's not an error that means we're still loading(loading is true, both of those are false)
  // and the last one is if there's an error
  return {
    user: data,
    isLoading: !data && !error,
    isError: error,
  }
  // And that's a custom hook, so now anywhere in our app where we need to make an API call to get the user '/me', we've got use this hook
  // Whenever the user gets updated, we'll update this cache at '/me and every component in the app will automatically get that update without having to make that API call
}
// The second hook will get all playlists, so we can populate the
// sidebar(we're going to use the real playlist that we seated in the db and pull those down)

export const usePlaylist = () => {
  const { data, error } = useSWR('/playlist', fetcher)

  // return the data or if the data didn't come back we'll make an array
  return {
    playlists: (data as any) || [],
    isLoading: !data && !error,
    isError: error,
  }
}

// Our fetcher can do anything(make a GraphQL call, it could not even make an API call at all so along as it's some function that returns some data)