import { NextResponse } from 'next/server'

// This is where the token being checked and the user being redirected to following pages with the valid token

const signedinPages = ['/', '/playlist', '/library']

export default function middleware(req) {
  if (signedinPages.find((p) => p === req.nextUrl.pathname)) {
    const token = req.cookies.TRAX_ACCESS_TOKEN
    if (!token) {
      return NextResponse.redirect('/signin')
    }
  }
}

// export default function middleware(req: NextRequest) {
//   if (signedinPages.find((p) => p === req.nextUrl.pathname)) {
//     const token = req.cookies.TRAX_ACCESS_TOKEN
//     const url = req.nextUrl.clone()
//     url.pathname = '/signin'
//     if (!token) {
//       return NextResponse.redirect(url)
//     }
//   }
// }
