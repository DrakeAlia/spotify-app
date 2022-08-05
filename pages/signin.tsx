import AuthForm from '../components/authForm'

// This route is simple because AuthForm is doing the heavylifting 

const Signin = () => {
  return <AuthForm mode="signin" />
}

// sign in on authPage is true on the component
Signin.authPage = true

export default Signin
