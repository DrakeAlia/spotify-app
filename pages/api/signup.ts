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
  // Because emails are unique its either gonna create you because you don't exist or it's gonna say sorry this  already exist and it's gonna throw an error(That's all sign up is gonna do)
  // And then if that is successful, we'll generate a JSON Web Token and we'll save it as a cookie, so it'll be set in your browser
  // And then that cookie will be sent on every other requests that we can use to verify that is you(That is how we gonna sign you up)

  // create user
  const salt = bcrypt.genSaltSync()
  // Get the  and password(backend: making the function saying if you want to sign in, you must pass the email and password up - req.body)
  console.log('hello signup')
  const { email, password } = req.body

  let user
  // async await, so do some try catches here
  try {
    // We're going to attempt to create the this user here
    user = await prisma.user.create({
      data: {
        email,
        // for the password we want to hash it, takes in the password that they set up and the salt we created
        password: bcrypt.hashSync(password, salt),
      },
    })
    // catch error just in case
  } catch (e) {
    // error for email that already exist most likely
    res.status(401)
    // send back an error property
    res.json({ error: 'User already exists' })
    return
  }

  // Assuming that the user was created, we need to make a token now
  // sign a token - this token is gonna be a long unique string
  const token = jwt.sign(
    // hash an object that has an email, which is the email the user gave me
    // pass the id of ther user
    // put time of when this was created
    {
      email: user.email,
      id: user.id,
      time: Date.now(),
    },
    // key (secret) - this how we know that our server created this thing
    'hello',
    { expiresIn: '8h' }
  )
  // Set this JWT in a cookie, if you set a cookie on a request, before you send it back, it's gonna get added to the browser
  // So if we set the cookie here and we send a response back, this cookie that we're setting will get set into the person's browser that requested us
  // local storage is fine but it can be accessed by js
  // If we set it as a cookie and do HTTP only it cannot be accessed by js, it can only be accessed by HTTP
  // And then you don't have to write any code on the frontend to send it up because cookies are sent up automatically anyway

  // Cookie is created
  res.setHeader(
    'Set-Cookie',
    // serialize wants to know the name of the cookie
    // The name of the cookie('TRAX_ACCESS_TOKEN') and the other arg is the token that we just created
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
  // Send the user back
  res.json(user)
}
