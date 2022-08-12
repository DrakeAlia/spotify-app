import GradientLayout from '../../components/gradientLayout'
import SongTable from '../../components/songsTable'
import { validateToken } from '../../lib/auth'
import prisma from '../../lib/prisma'

// This route is for the playlist pages(a route that has a index in it) and displays there individual

// this function takes in a playlist id and creates random colors for different pages for the playlist
const getBGColor = (id) => {
  const colors = [
    'red',
    'green',
    'blue',
    'orange',
    'purple',
    'gray',
    'teal',
    'yellow',
  ]
  // minus 1 because no ID starts with 0 but the array starts with 0(Ex: we'll never see red in this case unless we do minus 1)
  // or if the ID is greater than anything in here and this is where the randomness comes in
  // Just give us a random color if the ID doesn't exist(a deterministic color for our playlists)
  return colors[id - 1] || colors[Math.floor(Math.random() * colors.length)]
}

// When we go to /playlist/some id, it renders this page
// injected our playlist inside our playlist function
const Playlist = ({ playlist }) => {
  const color = getBGColor(playlist.id)

  // playlist content info - client side
  return (
    <GradientLayout
      color={color}
      roundImage={false}
      title={playlist.name}
      subtitle="playlist"
      description={`${playlist.songs.length} songs`}
      image={`https://picsum.photos/400?random=${playlist.id}`}
    >
      {/* pass in our songs from songsTable */}
      <SongTable songs={playlist.songs} />
    </GradientLayout>
  )
}
// We're going to destructure the query property off the context object that comes in here
export const getServerSideProps = async ({ query, req }) => {
  let user

  // this will handle error if valid token error is out
  try {
    user = validateToken(req.cookies.TRAX_ACCESS_TOKEN)
  } catch (e) {
    return {
      // you don't have a token, redirect to signin page
      redirect: {
        permanent: false,
        destination: '/signin',
      },
    }
  }
  // return an array for the playlist that is associated with a user who has a unique id for that playlist
  const [playlist] = await prisma.playlist.findMany({
    where: {
      // A bug will have here is that the query string is always going to be a value type of string where all ids are numbers
      // So to fix that we have to convert this to a number, to that we just put a plus sign in the front of it
      id: +query.id,
      userId: user.id,
    },
    // include - basically saying playlist has a relation for songs, we want to include the songs on the playlist query because we're about to populate the songs table on this playlist page
    // So instead of making another db query to get the songs after we get the playlist, we can do the all in one by saying we want to include a bunch of things
    // songs, artists of those songs, etc.
    include: {
      songs: {
        include: {
          artist: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      },
    },
  })
  // return an object with some props, in this case our playlist
  return {
    props: { playlist },
  }
}
export default Playlist

// What do you think is the appropriate way to get the data for this playlist page?
// Should we fetch it on the client after the page is loaded up?
// Or should we fetch it on a server so when it does load up, it's already there?

// Both are correct but in this example we will have it where everything is there when
// it loads up every single time and then if you had the ability to add songs to the
// playlist while still looking at this page then you can use client side for that
