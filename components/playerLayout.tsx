import { Box } from '@chakra-ui/layout'
import Sidebar from './sidebar'
import PlayerBar from './playerBar'

// This component renders the sidebar, the music bar at the bottom,
// and houses the actual page which we want to be consistent

// In chakra-ui it uses Box which is the equivalent of a div
// With chakra we can just write css properties as props on these components

// Most layout components do have to render out their children somewhere
// (in this case, the child will be this page that sits to the right of the sidebar and above the music bar)
const PlayerLayout = ({ children }) => {
  return (
    // Main page container - this will keep our main page from scrolling
    <Box width="100vw" height="100vh">
      {/* Sidebar container(on the left of the page) - typically give sidebar a fixed width no matter what screen size you're on */}
      <Box position="absolute" top="0" width="250px" left="0">
        <Sidebar />
      </Box>
      {/* Main content container(right of the side bar) */}
      <Box marginLeft="250px" marginBottom="100px">
        <Box height="calc(100vh - 100px)">{children}</Box>
      </Box>
      {/* Playerbar container */}
      <Box position="absolute" left="0" bottom="0">
        <PlayerBar />
      </Box>
    </Box>
  )
}

export default PlayerLayout
