import jwt from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from './prisma'

// This is where the token is validated at

// You can make your response handlers more type-safe by importing the NextApiRequest and NextApiResponse types from next
// This were all of our helpers that we use to help us with authorization and authentication live

// A higher order function that will use as middleware to protect our api routes
// so whatever api routes we want to be protected, will wrap in this higher order function

// Pass handler function as a arg, this function will check to make sure that you have a token in your cookie and that it is a valid token, a valid user
// and if it's all true then we'll call the handler
// if one of those things is not true then we'll 401
// return our own handler that has a request and response
export const validateRoute = (handler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.cookies.TRAX_ACCESS_TOKEN

    // first check, if you have a token
    if (token) {
      let user
      // try to verfiy the token
      try {
        // decode that jwt, turn it back into an object, grab the id property from that
        const { id } = jwt.verify(token, 'hello')
        // find the user in the db with that id
        user = await prisma.user.findUnique({
          where: { id },
        })
        // if not a real user
        if (!user) {
          throw new Error('Not a real user')
        }
        // if there is an error for whatever reason
      } catch (error) {
        res.status(401)
        res.json({ error: 'Not Authorizied ' })
        return
      }
      return handler(req, res, user)
    }
    // if you don't have a token to begin with
    res.status(401)
    res.json({ error: 'Not Authorizied ' })
  }
}

export const validateToken = (token) => {
  const user = jwt.verify(token, 'hello')
  return user
}
