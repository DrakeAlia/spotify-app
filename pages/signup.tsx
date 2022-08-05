import AuthForm from '../components/authForm'

// This route is simple because AuthForm is doing the heavylifting

const Signup = () => {
  return <AuthForm mode="signup" />
}

// sign up on authPage is true on the component
Signup.authPage = true

export default Signup
