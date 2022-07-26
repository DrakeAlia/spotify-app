import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'

// These functions here are handlers(its a function that takes a request and a response)
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password } = req.body

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
