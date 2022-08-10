import { validateRoute } from '../../lib/auth'
import prisma from '../../lib/prisma'

// This is route used to get the user

// Any file inside a pages/API folder is actually going to be a API route

// Instead of creating a server that's constantly running and it's constantly on and you're maintanining all this stuff,
// You just create a function, that gets executed off of some event. Usually that event is tied into a URL(in this case, the URLs is whatever the folder is, so /api/me, that is the URL)
// When that URL gets executed, this function runs, that's it

// The validateRoute function gets the user, so all we have to do is send it back here
// The validateRoute wraps our handler and won't call thishandler unless you've authticated
// This function never runs unless it's guaranteed to know that you've been validated
export default validateRoute(async (req, res, user) => {
  // get the playlist count - return the count
  const playlistsCount = await prisma.playlist.count({
    where: {
      userId: user.id,
    },
  })

  // console.log(playlistsCount)
  res.json({ ...user, playlistsCount })
})
