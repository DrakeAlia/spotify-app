import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'

// This is where the user signs up... creating a cookie for that user

export default async (req: NextApiRequest, res: NextApiResponse) => {
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
    cookie.serialize('TRAX_ACCESS_TOKEN', token, {
      // No js running in the broswer will be able to read this cookie at all
      httpOnly: true,
      // how  does this cookie lasts for
      maxAge: 8 * 60 * 60,
      // what path this cookie will be available on
      path: '/',
      // sameSite controls which sites have access to this cookie
      sameSite: 'lax',
      // only send this cookie over https connection
      secure: process.env.NODE_ENV === 'production',
    })
  )

  res.json(user)
}
