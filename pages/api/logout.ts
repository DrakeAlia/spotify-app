// import bcrypt from 'bcrypt'
// import jwt from 'jsonwebtoken'
import cookie from 'cookie'
import { NextApiRequest, NextApiResponse } from 'next'
// import prisma from '../../lib/prisma'

// GOAL - To render out the logout route and to see if it actually works or not

// These functions here are handlers(its a function that takes a request and a response)

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   res.status(200).json({ name: 'Logout route' })
// }

// export default async (req: NextApiRequest, res: NextApiResponse) => {
//   console.log('Is logout working?')
//   res.status(200).json({ name: 'Logout route' })
// }

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Setting that token on the header and the header we're gonna use it Set-Cookie
  // a cookie on the server side in http response
  res.setHeader(
    'Set-Cookie',
    // serialize is a function that take several args and wants to know the name of the cookie
    cookie.serialize('TRAX_ACCESS_TOKEN', '', {
      // No js running in the broswer will be able to read this cookie at all
      httpOnly: true,
      // The cookie has expired in 1970
      expires: new Date(0),
      // What path this cookie will be available on
      path: '/',
      // sameSite controls which sites have access to this cookie
      sameSite: 'lax',
      // Only send this cookie over https connection(should it be encrpyted, only in production becuase we're not using https on localhost)
      secure: process.env.NODE_ENV !== 'production',
    })
  )
  res.statusCode = 200
  res.json({ success: true })
}

// EXAMPLES:
// Using Prisma inside of Next.js API Routes
// You can use Prisma inside of Next.js API routes to
// send queries to your database –
// both with REST and GraphQL. Here is an example for a
// REST API with a sample /api/posts route:

// Fetch all posts (in /pages/api/posts.ts)
// const prisma = new PrismaClient()

// export default async function handle(req, res) {
//   const posts = await prisma.post.findMany()
//   res.json(posts)
// }

// Any file inside the folder pages/api is mapped to /api/* and will be treated as
// an API endpoint instead of a page. They are server-side only bundles and
// won't increase your client-side bundle size.
