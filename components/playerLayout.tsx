import { Box } from '@chakra-ui/layout'
import Sidebar from './sidebar'
import PlayerBar from './playerBar'

// This component renders the sidebar, the music bar at the bottom,
// and houses the actual page

// Most layout components do have to render out their children somewhere
// (in this case, the child will be this page that sits to the right of the sideba and above the music bar)
const PlayerLayout = ({ children }) => {
  return (
    // Main page container
    <Box width="100vw" height="100vh">
      <Box position="absolute" top="0" width="250px" left="0">
        <Sidebar />
      </Box>
      {/* Side bar container */}
      <Box marginLeft="250px" marginBottom="100px">
        <Box height="calc(100vh - 100px)">{children}</Box>
      </Box>
      {/* Player bar container */}
      <Box position="absolute" left="0" bottom="0">
        <PlayerBar />
      </Box>
    </Box>
  )
}

export default PlayerLayout
