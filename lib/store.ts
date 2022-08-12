import { createStore, action } from 'easy-peasy'

// easy-peasy is an abstraction of Redux, providing a reimagined API that focuses
// on developer experience. It allows you to quickly and easily manage
// your state, whilst leveraging the strong architectural guarantees and
// extensive eco-system that Redux has to offer.

// This component is for putting state and actions for player controls

export const store = createStore({
  // keep track of the active songs which is going to be an array
  activeSongs: [],
  // keep track of active song which is going to start off as null
  activeSong: null,
  // actions to change those things, to modify those things
  // set to the action import that we have, which is a function, that just takes a callback.
  // So it'll take the state and then it'll take the payload
  changeActiveSongs: action((state: any, payload) => {
    // you can do a mutable operation here (whatever the payload is)
    state.activeSongs = payload
  }),
  // This one is just another action to change the act of song
  changeActiveSong: action((state: any, payload) => {
    state.activeSong = payload
  }),
})
