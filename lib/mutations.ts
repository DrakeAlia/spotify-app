import fetcher from './fetcher'

// this file will make a api call either signin or signup using fetcher

// this auth fucntion is going to take in two things using mode
export const auth = (
  // mode will either be signin or signup, one of those because they're literally the same payload
  mode: 'signin' | 'signup',
  // body - is a type object, email and password which are both strings
  body: { email: string; password: string }
) => {
  // return the fetcher, the URL will be slash and pass in the body
  // body because the api requirments in signin/signup have email and pssword in there bodies(req.body)
  return fetcher(`/${mode}`, body)
}
