import { Box } from '@chakra-ui/layout'
import { Table, Thead, Td, Tr, Tbody, Th, IconButton } from '@chakra-ui/react'
import { BsFillPlayFill } from 'react-icons/bs'
import { AiOutlineClockCircle } from 'react-icons/ai'
import { useStoreActions } from 'easy-peasy'
import { formatDate, formatTime } from '../lib/formatters'

// This component displays the songs/list of songs which we will bring into the playlist page

const SongTable = ({ songs }) => {
  // setting active songs
  const playSongs = useStoreActions((store: any) => store.changeActiveSongs)
  // setting active song
  const setActiveSong = useStoreActions((store: any) => store.changeActiveSong)

  // This function handles when you click the play button or
  // you click a song its going to run the handlePlay function
  // it's going to set the active song and the active songs, so the playlist
  // Optional if you pass an active song or not
  const handlePlay = (activeSong?) => {
    // set the active song so whatever song you passed in if you did
    // if you did not, we're going to set it to the songs that we get in our props, zero
    setActiveSong(activeSong || songs[0])
    // set the active songs to all songs(the entire playlist)
    playSongs(songs)
  }
  // container for the song table layout
  return (
    <Box bg="transparent" color="white">
      <Box padding="10px" marginBottom="20px">
        <Box marginBottom="30px">
          {/* click on play button */}
          <IconButton
            icon={<BsFillPlayFill fontSize="30px" />}
            aria-label="play"
            colorScheme="green"
            size="lg"
            isRound
            // callback then call it without any arg
            onClick={() => handlePlay()}
          />
        </Box>
        {/* table container */}
        <Table variant="unstyled">
          {/* labels at the top of the table */}
          <Thead
            borderBottom="1px solid"
            borderColor="rgba(255, 255,255, 0.2 )"
          >
            <Tr>
              <Th>#</Th>
              <Th>Title</Th>
              <Th>Date Added</Th>
              {/* clock icon */}
              <Th>
                <AiOutlineClockCircle />
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {/* table row */}
            {songs.map((song, i) => (
              <Tr
                // table highlights when you hover over it
                // sx - lets you add custom styles
                sx={{
                  transition: 'all .3s',
                  // and on hover -  the bg to be slightly lighter then what it is now
                  '&:hover': {
                    bg: 'rgba(225, 225, 255, 0.1)',
                  },
                }}
                // because this is a map, we need a key property
                key={song.id}
                cursor="pointer"
                // For each Tr we're going to add onClick with anoymous function here with handlePlay
                // and pass in the current song that we're iterating over, so that means you clicked on a song
                onClick={() => handlePlay(song)}
              >
                {/* Td which each single coloumn, we're going to add the theme for the song */}
                {/* The first one will be the number(the index) and adding plus 1 everything because it starts with 0 */}
                <Td>{i + 1}</Td>
                <Td>{song.name}</Td>
                {/* format for time/day ago */}
                <Td>{formatDate(song.createdAt)}</Td>
                <Td>{formatTime(song.duration)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  )
}

export default SongTable
