import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../lib/prisma'

// export default async () => {
// console.log('test')
// }

const logout = () => {
  console.log('test')
}

export default logout

// This component logs out the user and clear(expires/delete) their cookie, redirecting the user back to the signin page
// Logging out steps:
// 1. Set the value of the cookie to an empty string
// 2. Get rid of maxAge and replace with expires

// // Setting a cookie on the server side in http response
// res.setHeader(
//   'Set-Cookie',
//   // serialize wants to know the name of the cookie
//   cookie.serialize('', token, {
//     // No js running in the broswer will be able to read this cookie at all
//     httpOnly: true,
//     // This means 0 seconds start date bascially this cookie expired in 1970 so when the browser picks that up it's going to delete it
//     expires: new Date(0),
//     // What path this cookie will be available on
//     path: '/',
//     // sameSite controls which sites have access to this cookie
//     sameSite: 'lax',
//     // Only send this cookie over a https connection
//     secure: process.env.NODE_ENV === 'production',
//   })
// )
// Success status response that the request has succeeded
// res.statusCode = 200
// // Sends a JSON response composed of the specified data
// res.json({ success: true })
// }
// }
