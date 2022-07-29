import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'
import { route } from 'next/dist/server/router'

// The signin route checks for the user's resquest for signing in once the user's credentials it checked

// We're going to expect an email and password to be sent up to the API, we're gonna check that we email to see if there's a user in the db by that email
// if there is then we're gonna comapre the hash passwords and see if they are the same, if they are, this person is who they say thay are, they are a valid user
// generate them a token, set it in the cookie. If they are NOT we are gonna to 401 given the wrong credentials

// These functions here are handlers(its a function that takes a request and a response)
// typecheck the req and res
export default async (req: NextApiRequest, res: NextApiResponse) => {
  // You must send me an email and password on the body
  const { email, password } = req.body

  // Find this user with this email
  // findUnique is find one
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        time: Date.now(),
      },
      'hello',
      {
        expiresIn: '8h',
      }
    )
    // Setting a cookie on the server side in http response
    res.setHeader(
      'Set-Cookie',
      // serialize wants to know the name of the cookie
      cookie.serialize('TRAX_ACCESS_TOKEN', token, {
        // No js running in the broswer will be able to read this cookie at all
        httpOnly: true,
        // How long does this cookie lasts for
        maxAge: 8 * 60 * 60,
        // What path this cookie will be available on
        path: '/',
        // sameSite controls which sites have access to this cookie
        sameSite: 'lax',
        // Only send this cookie over https connection
        secure: process.env.NODE_ENV === 'production',
      })
    )

    res.json(user)
  } else {
    res.status(401)
    res.json({ error: 'Email or Password is incorrect' })
  }
}
