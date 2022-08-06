import { Box, Flex, Input, Button } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { FC, useState } from 'react'
// import { useSWRConfig } from 'swr'
import NextImage from 'next/image'
import { auth } from '../lib/mutations'

// This component toggles what mode you are in for sign in page or sign up page and authenticates it
// (client side, making an API call)

// Up until this point we haven't had to touch the router because next.js handles the routing for us based off the folder structure and the file naming.
// But you can access the router to do programmatic routing and you do that be getting the useRouter from next router

// SWR(Still While Revalidate) which is from next.js and useSWRConfig package will handle caching, optimistic updates, refetching and revalidating the cache for you based off the different scenarios

// FC(Function Component) will type check over the props for you

// This auth form will take in a mode, which will be a string of signin or signup
// set up state to keep track of in this form(email, password, if we're loading or not)
const AuthForm: FC<{ mode: 'signin' | 'signup' }> = ({ mode }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // handles for sigin in/sigin up button when submitted
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Make the API call
    // Auth method - takes in a mode and takes in a body(email, password)
    await auth(mode, { email, password })
    setIsLoading(false)
    // navigate us to the home page
    router.push('/')
  }

  // (JSX) for styling our box(div)
  return (
    // container layout
    <Box height="100vh" width="100vw" bg="black" color="white">
      <Flex
        justify="center"
        align="center"
        height="100px"
        borderBottom="white 1px solid"
      >
        {/* logo */}
        <NextImage src="/logo.svg" height={60} width={120} />
      </Flex>
      {/* auth form fields container */}
      <Flex justify="center" align="center" height="calc(100vh - 100px)">
        <Box padding="50px" bg="gray.900" borderRadius="6px">
          <form onSubmit={handleSubmit}>
            {/* email field for auth form */}
            <Input
              placeholder="email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            {/* password field for auth form */}
            <Input
              placeholder="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* submit button on auth form (sigin or signup) */}
            <Button
              type="submit"
              bg="green.500"
              isLoading={isLoading}
              sx={{
                '&:hover': {
                  bg: 'green.300',
                },
              }}
            >
              {/* mode: either sign in or sign up */}
              {mode}
            </Button>
            <Button
              bg="green.500"
              type="submit"
              onClick={() => {
                console.log('Sign up was clicked')
              }}
            >
              signup
            </Button>
          </form>
        </Box>
      </Flex>
    </Box>
  )
}

export default AuthForm
