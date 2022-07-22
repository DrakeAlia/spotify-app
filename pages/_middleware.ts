import { NextResponse } from 'next/server'

// You can make your response handler more type safe by importing NextResponse
// Edge function that checks the cookie to see if you an access token

// This is where the token being checked and the user being redirected to following pages with the valid token
// You can put a middleware on any level inside the pages
// First thing is we need to create a list of pages that we want to protect

// This middleware is going to run on every single route and we don't want to block every single route, like sign in, sign up.
const signedinPages = ['/', '/playlist', '/library']

export default function middleware(req) {
  if (signedinPages.find((p) => p === req.nextUrl.pathname)) {
    const token = req.cookies.TRAX_ACCESS_TOKEN
    if (!token) {
      // if you don't have a token then we're not even going to go to the server to render the page
      // and will redirect you to the sign in page
      return NextResponse.redirect('/signin')
    }
  }
}
