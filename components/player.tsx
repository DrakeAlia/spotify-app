import {
  ButtonGroup,
  Box,
  IconButton,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderTrack,
  RangeSliderThumb,
  Center,
  Flex,
  Text,
} from '@chakra-ui/react'
import ReactHowler from 'react-howler'
import { useEffect, useRef, useState } from 'react'
import {
  MdShuffle,
  MdSkipPrevious,
  MdSkipNext,
  MdOutlinePlayCircleFilled,
  MdOutlinePauseCircleFilled,
  MdOutlineRepeat,
} from 'react-icons/md'
import { useStoreActions } from 'easy-peasy'
import { formatTime } from '../lib/formatters'

// A React.js wrapper for howler.js (audio player). ReactHowler has no UI,
// you have to provide your own UI. Props can be passed to control
// playback and react to events such as end, load, play, ...

// This component handles the functionality of the player bar

// takes a list of songs(playlist) and also takes an active song
const Player = ({ songs, activeSong }) => {
  // keep track of wheather you're playing or not, which is going to default to true so when this
  // component loads up, its automatically going to start playing
  const [playing, setPlaying] = useState(true)
  // keep track of what song is currently playing in the list of songs that we got
  const [index, setIndex] = useState(
    songs.findIndex((s) => s.id === activeSong.id)
  )
  // keep track of seek if you are seeking or not(the ablility to grab the thumb and seek) and defaulting at zero
  const [seek, setSeek] = useState(0.0)
  const [isSeeking, setIsSeeking] = useState(false)
  // keep track if we're repeating or not, by default we will not be repeating
  const [repeat, setRepeat] = useState(false)
  // same thing for shuffle
  const [shuffle, setShuffle] = useState(false)
  // keep track of the duration of a song
  const [duration, setDuration] = useState(0.0)
  const repeatRef = useRef(repeat)
  // We need to make a reference object using the use ref hook inside of react and attach that reference to the React.Howler
  const soundRef = useRef(null)
  const setActiveSong = useStoreActions((state: any) => state.changeActiveSong)

  useEffect(() => {
    let timerId

    if (playing && !isSeeking) {
      const f = () => {
        setSeek(soundRef.current.seek())
        timerId = requestAnimationFrame(f)
      }

      timerId = requestAnimationFrame(f)
      return () => cancelAnimationFrame(timerId)
    }

    cancelAnimationFrame(timerId)
  }, [playing, isSeeking])

  useEffect(() => {
    setActiveSong(songs[index])
  }, [index, setActiveSong, songs])

  useEffect(() => {
    repeatRef.current = repeat
  }, [repeat])

  // this function sets the toggle for playing or not(whatever the value is)
  const setPlayState = (value) => {
    setPlaying(value)
  }

  const onShuffle = () => {
    // give us the current state and give us the not state of that
    setShuffle((state) => !state)
  }

  const onRepeat = () => {
    setRepeat((state) => !state)
  }

  // We need the current index to set the next index we're going do a call back in this set call
  const prevSong = () => {
    setIndex((state) => {
      // is the current index greater than 0? if it is, then subtract 1 from it
      // if it is 0, then go back to the end of the playlist and play the song at the end, so it loops back over
      return state ? state - 1 : songs.length - 1
    })
  }

  const nextSong = () => {
    setIndex((state) => {
      if (shuffle) {
        // give us a random number between 0 and whatever the length of the array is
        const next = Math.floor(Math.random() * songs.length)
        // if the next equals the current one then you need to do this again
        if (next === state) {
          // call next song again
          return nextSong()
        }
        // at the end return next
        return next
      }
      // if state equals the last thing in the array, then we want to reset back to 0
      // if not then return that index + 1, so just go up by 1
      return state === songs.length - 1 ? 0 : state + 1
    })
  }

  // When a songs ends, it goes to the next song automatically
  const onEnd = () => {
    if (repeatRef.current) {
      setSeek(0)
      soundRef.current.seek(0)
    } else {
      nextSong()
    }
  }

  const onLoad = () => {
    const songDuration = soundRef.current.duration()
    setDuration(songDuration)
  }

  const onSeek = (e) => {
    setSeek(parseFloat(e[0]))
    soundRef.current.seek(e[0])
  }

  // container for everything where the controls are held in for the player
  return (
    <Box>
      <Box>
        <ReactHowler
          // pass whether it's playing or not
          playing={playing}
          // if we have the song url
          src={activeSong?.url}
          // access the native ReactHowler instance using the soundRef objects
          ref={soundRef}
          onLoad={onLoad}
          onEnd={onEnd}
        />
      </Box>
      <Center color="gray.600">
        <ButtonGroup>
          <IconButton
            outline="none"
            variant="link"
            aria-label="shuffle"
            fontSize="24px"
            // if it's shuffle it's true then make it white otherwise it'll be gray
            color={shuffle ? 'white' : 'gray.600'}
            // toggle wheather or not you're shuffling
            onClick={onShuffle}
            icon={<MdShuffle />}
          />
          <IconButton
            outline="none"
            variant="link"
            aria-label="skip"
            fontSize="24px"
            icon={<MdSkipPrevious />}
            // Go back to a previous song based off the list of songs that we had
            onClick={prevSong}
          />
          {/* if playing is true, then we want to show the pause button */}
          {playing ? (
            <IconButton
              outline="none"
              variant="link"
              aria-label="pause"
              fontSize="40px"
              color="white"
              icon={<MdOutlinePauseCircleFilled />}
              onClick={() => setPlayState(false)}
            />
          ) : (
            // if not playing, then we want to show the play button
            <IconButton
              outline="none"
              variant="link"
              aria-label="play"
              fontSize="40px"
              color="white"
              icon={<MdOutlinePlayCircleFilled />}
              onClick={() => setPlayState(true)}
            />
          )}
          <IconButton
            outline="none"
            variant="link"
            aria-label="next"
            fontSize="24px"
            icon={<MdSkipNext />}
            onClick={nextSong}
          />
          <IconButton
            outline="none"
            variant="link"
            aria-label="repeat"
            fontSize="24px"
            // if it's repeat it's true then make it white otherwise it'll be gray
            color={repeat ? 'white' : 'gray.600'}
            // toggle wheather or not you're repeating
            onClick={onRepeat}
            icon={<MdOutlineRepeat />}
          />
        </ButtonGroup>
      </Center>

      <Box color="gray.600">
        <Flex justify="center" align="center">
          <Box width="10%">
            <Text fontSize="xs">{formatTime(seek)}</Text>
          </Box>
          <Box width="80%">
            {/* slider controls */}
            {/* RangeSlider takes a child */}
            <RangeSlider
              // left to right
              aria-label={['min', 'max']}
              step={0.1}
              min={0}
              id="player-range"
              max={duration ? (duration.toFixed(2) as unknown as number) : 0}
              onChange={onSeek}
              value={[seek]}
              onChangeStart={() => setIsSeeking(true)}
              onChangeEnd={() => setIsSeeking(false)}
            >
              <RangeSliderTrack bg="gray.800">
                <RangeSliderFilledTrack bg="gray.600" />
              </RangeSliderTrack>
              <RangeSliderThumb index={0} />
            </RangeSlider>
          </Box>
          <Box width="10%" textAlign="right">
            <Text fontSize="xs">{formatTime(duration)}</Text>
          </Box>
        </Flex>
      </Box>
    </Box>
  )
}

export default Player
