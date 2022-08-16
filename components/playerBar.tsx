import { Box, Flex, Text } from '@chakra-ui/layout'
import { useStoreState } from 'easy-peasy'
import Player from './player'

// useStoreState - we wanna get the states for the song and songs
// we want to be able to toggle wheather or not we show the player controls

// This component is the styling for the player bar container

// get the state for the song and songs
const PlayerBar = () => {
  const songs = useStoreState((state: any) => state.activeSongs)
  const activeSong = useStoreState((state: any) => state.activeSong)

  return (
    <Box height="100px" width="100vw" bg="gray.900" padding="10px">
      <Flex align="center">
        {/* is there an active song or not? if so then render the song info */}
        {activeSong ? (
          <Box padding="20px" color="white" width="30%">
            <Text fontSize="large">{activeSong.name}</Text>
            <Text fontSize="small">{activeSong.artist.name}</Text>
          </Box>
        ) : // if not then don't render anything
        null}
        {/* player controls container */}
        <Box width="40%">
          {/* is there an active song? if so render and if not don't render */}
          {activeSong ? <Player songs={songs} activeSong={activeSong} /> : null}
        </Box>
      </Flex>
    </Box>
  )
}

export default PlayerBar
