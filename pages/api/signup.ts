import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'

// This is where the user signs up, creating a cookie for that user after successfully signing up

// A JSON web token is just an object that gets turned into some generic string, but it's deterministic. You can undo that string and get back the same object
// We can check to see one, is this server the issuer of this token? Two even if this is a right token, is it expired? Or three, even if it's not expired, is this a valid user ID?

// Every serverless function takes two args, it takes a request object and a response object
export default async (req: NextApiRequest, res: NextApiResponse) => {
  // You send us some credentials(email and password)
  // We're going to attempt to create a new user with that email and a hashed password
  // Because emails are unique its either gonna create you because you don't exist or it's gonna say sorry this email already exist and it's gonna throw an error(That's all sign up is gonna do)
  // And then if that is successful, we'll generate a JSON Web Token and we'll save it as a cookie, so it'll be set in your browser
  // And then that cookie will be sent on every other requests that we can use to verify that is you(That is how we gonna sign you up)
  const salt = bcrypt.genSaltSync()
  const { email, password } = req.body

  let user

  try {
    user = await prisma.user.create({
      data: {
        email,
        password: bcrypt.hashSync(password, salt),
      },
    })
  } catch (e) {
    res.status(401)
    res.json({ error: 'User already exists' })
    return
  }

  const token = jwt.sign(
    {
      email: user.email,
      id: user.id,
      time: Date.now(),
    },
    // key (secret)
    'hello',
    { expiresIn: '8h' }
  )
  // Cookie is created
  res.setHeader(
    'Set-Cookie',
    // serialize wants to know the name of the cookie
    cookie.serialize('TRAX_ACCESS_TOKEN', token, {
      // No js running in the broswer will be able to read this cookie at all
      httpOnly: true,
      // how long does this cookie lasts for
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
}
