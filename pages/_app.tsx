import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { StoreProvider } from 'easy-peasy'
import PlayerLayout from '../components/playerLayout'
import 'reset-css'
import { store } from '../lib/store'

// This is our root of our application, the entry point to every point to every page on the component/every page on your app

// Normally you have to bootstrapped your react app to the DOM, except you don't have to do that because Next.js does that for you
// and the undercore of _app.tsx just means don't make a route for this
// If we got rid of the underscore, Next.js would make a route called slash app and it will load that component, which is not what we want here

// Easy Peasy is an abstraction of Redux, providing a reimagined API that focuses on developer experience. It allows you to quickly and easily manage your state, whilst leveraging the strong architectural guarantees and extensive eco-system that Redux has to offer.
// reset css - all this going to do is reset the CSS be the same in every single broswer (all broswers apply default CSS differently)

// This changes the gray to an actual gray color due to the fact
// chakra's gray can be a bit more blue-ish
const theme = extendTheme({
  colors: {
    gray: {
      100: '#F5f5f5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
  },
  // components - allows to extend any of the components
  // variants - is like the type of button(ex: big button, small button, a success button, link button)
  components: {
    Button: {
      variants: {
        link: {
          ':focus': {
            outline: 'none',
            boxShadow: 'none',
          },
        },
      },
    },
  },
})

const MyApp = ({ Component, pageProps }) => {
  // A provider is just like a component that provides context for your whole app
  // Context is state that can be shared and accessed at any component
  // A provider just gives every component rendered inside of it access to that context

  // Wrap our component inside the ChakraProvider and pass the theme which is called theme
  // Wrap the component with Playerlayout not the ChakraProvider, we want to stay in the ChakraProvider
  // otherwise our layout would have access to any of our theme primitives

  // Component.authPage - is asking if this a authPage component, if so then we only want to put the component in here
  // (if this a component with authPage property DO NOT wrap it in the layout)
  // if it's not then we still want to wrap our component inside of a layout(if it doesn't have the authPage property, it should be protected, it should have the playerlayout)
  return (
    <ChakraProvider theme={theme}>
      <StoreProvider store={store}>
        {Component.authPage ? (
          <Component {...pageProps} />
        ) : (
          <PlayerLayout>
            <Component {...pageProps} />
          </PlayerLayout>
        )}
      </StoreProvider>
    </ChakraProvider>
  )
}

export default MyApp
