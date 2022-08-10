import { Box, Text, Flex } from '@chakra-ui/layout'
import { Image, Button } from '@chakra-ui/react'
import GradientLayout from '../components/gradientLayout'
import { useMe } from '../lib/hooks'
import prisma from '../lib/prisma'

// library prisma - we only have once instance of prisma
// (one connection to the db instead of multiple connections we would have to make on the client every single time)

// This component renders out the user's profile (their name, public playlists) and their top artists of the month

// access to artists
const Home = ({ artists }) => {
  // useMe hook
  const { user } = useMe()

  // GradientLayout - fills out the styling, user info, user's image, and their playlist inside the home page
  return (
    <GradientLayout
      roundImage
      color="gray"
      subtitle="profile"
      title={`${user?.firstName} ${user?.lastName}`}
      description={`${user?.playlistsCount} public playlists`}
      image="https://tinted-gym-f99.notion.site/image/https%3A%2F%2Fdl.dropboxusercontent.com%2Fs%2Fbgiv0ssz3xpotz9%2Fpeep.png%3Fdl%3D0?table=block&id=33f9771b-0e6f-4a72-832c-69ed2d41f290&spaceId=511cd811-5561-4a61-b550-c4086b4afafb&width=2000&userId=&cache=v2"
      // image="https://media-exp2.licdn.com/dms/image/C5603AQGL5eIcDgi8Rw/profile-displayphoto-shrink_800_800/0/1579064270982?e=1663200000&v=beta&t=IdwwEW4DTIF8Sv3ypT93Ll5Y28C_icvCgsr7l2tj9f0"
    >
      <Box color="white" paddingX="40px">
        <Button
          bg="green.500"
          type="submit"
          onClick={() => {
            console.log('Logout Clicked')
            fetch('/api/logout', {
              method: 'post',
              // HTTP header that is used to indicate the media type of the
              // resource and in the case of responses, it tells the browser
              // about what actually content type of the returned content is.
              // In case of any POST or PUT requests, the client tells
              // the server about the kind of data sent.
              headers: {
                'Content-Type': 'application/json',
              },
              // While developing an application using JavaScript, many times it is
              // needed to serialize the data to strings for storing the data into
              // a database or for sending the data to an API or web server. The
              // data has to be in the form of strings.
              body: JSON.stringify({}),
            })
          }}
        >
          Logout
        </Button>
        {/* artists content container */}
        <Box marginBottom="40px">
          <Text fontSize="2xl" fontWeight="bold">
            Top artist this month
          </Text>
          <Text fontSize="md">only visiable to you</Text>
        </Box>
        <Flex>
          {/* artist container/cards */}
          {artists.map((artist) => (
            <Box paddingX="10px" width="20%">
              <Box bg="gray.900" borderRadius="4px" padding="15px" width="100%">
                {/* artists card imgs(cats) */}
                <Image
                  src="https://placekitten.com/300/300"
                  borderRadius="100%"
                />
                {/* artist's card content container */}
                <Box marginTop="20px">
                  <Text fontSize="large">{artist.name}</Text>
                  <Text fontSize="x-small">Artist</Text>
                </Box>
              </Box>
            </Box>
          ))}
        </Flex>
      </Box>
    </GradientLayout>
  )
}

// This function will get the props that will inject into this homepage,
// so whatever props you return in this function will be injected into the homepage because this
// function is going to be ran on the server side,
// Bascially this function will only run when someone requests this page,
// it's going to be ran everytime they request a page but only when they request a page
// on the server and NOT on the client
export const getServerSideProps = async () => {
  // get the artists
  // findMany({}) - get all the artists
  const artists = await prisma.artist.findMany({})
  // console.log(artists)
  // return an object that has a props property on it
  return {
    // whatever props we pass in here is what's going to get injected into the homepage
    props: { artists },
  }
}

export default Home

// Any dependencies that we use inside to getServerSideProps also gets stripped out of
// the dependency graph does not get bundled with the client
// When we import prisma, that doesn't mean prisma is going to be on the client that's going to be stripped out too

// What's the difference between getStaticProps and getServerSideProps?
// getStaticProps is another function that's also ran at a non client time except it's ran at build time. It's only going to excute when you do a static build of your site
// getServerSideProps is ran at runtime on the server. It excutes every single time you request, in this example this homepage
