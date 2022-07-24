import NextImage from 'next/image'
import NextLink from 'next/link'
import {
  Box,
  List,
  ListItem,
  ListIcon,
  Divider,
  LinkBox,
  LinkOverlay,
} from '@chakra-ui/layout'
import {
  MdHome,
  MdSearch,
  MdLibraryMusic,
  MdPlaylistAdd,
  MdFavorite,
} from 'react-icons/md'
import { usePlaylist } from '../lib/hooks'

// LinkOverlay and LinkBox allows us to make a click target which is bascially a word but have a bigger surface which is the size of a whole link item
// This component renders the sidebar and everything inside the Sidebar container(playlists, menus, etc.)

// Make some data and create the menus and then we can map over these menus and just write one component
// And our menus will be arrays
const navMenu = [
  {
    name: 'Home',
    icon: MdHome,
    route: '/',
  },
  {
    name: 'Search',
    icon: MdSearch,
    route: '/search',
  },
  {
    name: 'Your Library',
    icon: MdLibraryMusic,
    route: '/library',
  },
]

const musicMenu = [
  {
    name: 'Create Playlist',
    icon: MdPlaylistAdd,
    route: '/',
  },
  {
    name: 'Favorites',
    icon: MdFavorite,
    route: '/favorites',
  },
]

// Static data for playlist:
// const playlists = new Array(30).fill(1).map((_, i) => `Playlist ${i + 1}`)

const Sidebar = () => {
  const { playlists } = usePlaylist()
  // Be 100% of your parent because there's already a box around the sidebar component which already has a width in Playerlayout
  // height=calc(100vh - 100px) - calculate this being 100vh minus the 100px of the player bar
  // paddingX - padding for the left and right
  // paddingY - padding for top and bottom
  return (
    <Box
      width="100%"
      height="calc(100vh - 100px)"
      bg="black"
      paddingX="5px"
      color="gray"
    >
      {/* Content Container */}
      <Box paddingY="20px" height="100%">
        {/* Logo Container */}
        <Box width="120px" marginBottom="20px" paddingX="20px">
          {/* Put logo into the public folder on the root of the project */}
          <NextImage src="/logo.svg" height={60} width={120} />
        </Box>
        {/* First list of menus */}
        {/* Nav Menu Container */}
        <Box marginBottom="20px">
          {/* List spacing keeps items spaced from each other */}
          <List spacing={2}>
            {navMenu.map((menu) => (
              <ListItem paddingX="20px" fontSize="16px" key={menu.name}>
                <LinkBox>
                  {/* NextLink will make it so client side rendering after the inital server render */}
                  <NextLink href={menu.route} passHref>
                    {/* The href will be passed over to the LinkOverlay */}
                    {/* LinkOverlay is a semantic component used to wrap elements
                    (cards, blog post, articles, etc.) in a link. */}
                    <LinkOverlay>
                      <ListIcon
                        as={menu.icon}
                        color="white"
                        marginRight="20px"
                      />
                      {menu.name}
                    </LinkOverlay>
                  </NextLink>
                </LinkBox>
              </ListItem>
            ))}
          </List>
        </Box>
        {/* Music Menu Container */}
        <Box marginTop="30px">
          <List spacing={2}>
            {musicMenu.map((menu) => (
              <ListItem paddingX="20px" fontSize="16px" key={menu.name}>
                <LinkBox>
                  <NextLink href={menu.route} passHref>
                    <LinkOverlay>
                      <ListIcon
                        as={menu.icon}
                        color="white"
                        marginRight="20px"
                      />
                      {menu.name}
                    </LinkOverlay>
                  </NextLink>
                </LinkBox>
              </ListItem>
            ))}
          </List>
        </Box>
        {/* This will put a space between our sections of menus and playlist  */}
        <Divider marginTop="12px" color="gray.800" />
        {/* Second list of menus */}
        {/* Playlist Container */}
        {/* overflowY="auto" - is going to allow scrolling in the sidebar */}
        <Box height="66%" overflowY="auto" paddingY="20px">
          <List spacing={2}>
            {playlists.map((playlist) => (
              <ListItem paddingX="20px" key={playlist.id}>
                <LinkBox>
                  <NextLink
                    href={{
                      pathname: '/playlist/[id]',
                      query: { id: playlist.id },
                    }}
                    passHref
                  >
                    <LinkOverlay>{playlist.name}</LinkOverlay>
                  </NextLink>
                </LinkBox>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </Box>
  )
}

export default Sidebar
