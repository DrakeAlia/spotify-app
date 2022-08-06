import jwt from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from './prisma'

// This is where all our helpers that we use help us with authorization and authentication, token is validated

// You can make your response handlers more type-safe by importing the NextApiRequest and NextApiResponse types from next
// This were all of our helpers that we use to help us with authorization and authentication live

// The first function is going to be a higher order function that will use as middleware to protect our api routes
// so whatever api routes we want to be protected, will wrap in this higher order function

// Pass handler function as a arg, this function will check to make sure that you have a token in your cookie and that it is a valid token, a valid user
// and if it's all true then we'll call the handler
// if one of those things is not true then we'll 401
// return our own handler that has a request and response

// Return our own handler that has a request and a response but not before we check the token
// This function is bascially going to check to make sure you have a
// token in your cookie, it is a valid token, its a valid user
// and if all that is true, then we'll call the handler
// if none of that or one of the things is not true then we'll 401(you're not valid)
// and that's how we're protect our routes
export const validateRoute = (handler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // first thing is get acess to that token via the cookie
    const token = req.cookies.TRAX_ACCESS_TOKEN

    // first check, if you have a token
    if (token) {
      // get a user from that token
      let user
      // try to verfiy this token
      try {
        // decode that jwt, turn it back into an object, grab the id property from that
        // pass in the same key(secret = 'hello')
        const { id } = jwt.verify(token, 'hello')
        // find the user in the db with that id
        // this will tell us if your real or not
        user = await prisma.user.findUnique({
          // this will give us a user or it won't
          where: { id },
        })
        // if not a real user
        if (!user) {
          // throw an error that lands in our catch
          throw new Error('Not a real user')
        }
        // if there is an error for whatever reason
      } catch (error) {
        // you are not allowed
        res.status(401)
        res.json({ error: 'Not Authorizied ' })
        return
      }
      // return handler with the request, response, and we'll pass in on to user
      return handler(req, res, user)
    }
    // outside the if statement, if you don't have a token to begin with
    res.status(401)
    res.json({ error: 'Not Authorizied ' })
  }
}

export const validateToken = (token) => {
  const user = jwt.verify(token, 'hello')
  return user
}
