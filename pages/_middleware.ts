import { NextResponse } from 'next/server'

// You can make your response handler more type safe by importing NextResponse
// Edge function that checks the cookie to see if you an access token

// This is where the token being checked and the user being redirected to
// following pages with a valid token, You can put a middleware on any level inside the pages
// (__app.tsx will not run before the middleware because app is runtime whereas the middleware is happening on the network layer)

// This middleware is going to get executed before any one of these requests happen,
// It's going to handle every single request coming in

// First thing is we need to create a list of pages that we want to protect,
// This middleware is going to run on every single route and we DON'T want to block every single route,
// (sign in, sign up).

// An array of all the pages we want to protect on the edge(function)
const signedinPages = ['/', '/playlist', '/library']

// All this will do is take in a request, doesn't take in a response
// because it's in a different environment
// (This isn't in a node environment, the API functions are in a node environment,
// and it's not in a front end environment. It's also not in a node
// environment like our seed script. It's in a web worker environment,
// that's the environment that edge fuctions run in)
export default function middleware(req) {
  // we'll get the page and if that page equals anything in our array, that means it should be protected
  if (signedinPages.find((p) => p === req.nextUrl.pathname)) {
    // request the our cookie(TRAX_ACCESS_TOKEN)
    const token = req.cookies.TRAX_ACCESS_TOKEN
    // if you don't have a token then we're not even going to go to the
    // server to render the page and will redirect you to the sign in page
    if (!token) {
      // if you try to go any of the pages and you're not authorized
      return NextResponse.redirect('/signin')
    }
    // All of this happens on an edge
  }
}
