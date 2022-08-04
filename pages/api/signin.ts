import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'

// The signin route checks for the user's resquest for signing in once the user's credentials are checked

// We're going to expect an email and password to be sent up to the API, we're gonna check that we email to see if there's a user in the db by that email
// if there is then we're gonna comapre the hash passwords and see if they are the same, if they are, this person is who they say thay are, they are a valid user
// generate them a token, set it in the cookie. If they are NOT we are gonna to 401 given the wrong credentials

// These functions here are handlers(its a function that takes a request and a response)
// typecheck the req and res
export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log('hello signin')
  // You must send me an email and password on the body
  const { email, password } = req.body

  // Find this user with this email
  // findUnique is find one
  const user = await prisma.user.findUnique({
    where: {
      // find this user where email is email
      email,
    },
  })

  // check - if we get a user, and we're gonna check that user's password and verus the password hash
  if (user && bcrypt.compareSync(password, user.password)) {
    // We're gonna to create a jwt, set it to the cookie, and then send that cookie back
    // And send the user back to use on the front end
    // jwt.sign will take a couple args, the first one is gonna be the payload that we want to create, in this case an object with an ID(the user's ID so we can verify that user)
    // As well as the email because it is unique and have a time property of Date.now() as when we created this
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        time: Date.now(),
      },
      // The secret for our jwt(usually you want to put this in a environment variable as to not have in plain text and reuse it)
      'hello',
      {
        expiresIn: '8h',
      }
    )
    // Setting that token on the header and the header we're gonna use it Set-Cookie
    // a cookie on the server side in http response
    res.setHeader(
      'Set-Cookie',
      // serialize is a function that take several args and wants to know the name of the cookie
      cookie.serialize('TRAX_ACCESS_TOKEN', token, {
        // No js running in the broswer will be able to read this cookie at all
        httpOnly: true,
        // How long does this cookie lasts for
        maxAge: 8 * 60 * 60,
        // What path this cookie will be available on
        path: '/',
        // sameSite controls which sites have access to this cookie
        sameSite: 'lax',
        // Only send this cookie over https connection(should it be encrpyted, only in production becuase we're not using https on localhost)
        secure: process.env.NODE_ENV === 'production',
      })
    )
    // Once that is all done, send the user back (if all the conditions are true)
    res.json(user)
  } else {
    // if these conditions are NOT true - send back a 401 and a error
    res.status(401)
    res.json({ error: 'Email or Password is incorrect' })
  }
}
