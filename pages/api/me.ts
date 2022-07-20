import { validateRoute } from '../../lib/auth'
import prisma from '../../lib/prisma'

// This is used to get the user

// The validateRoute function gets the user, so all we have to do is send it back here
// The validateRoute wraps our handler and won't call thishandler unless you've authticated
// This function never runs unless it's guaranteed to know that you've been validated
export default validateRoute(async (req, res, user) => {
  const playlistsCount = await prisma.playlist.count({
    where: {
      userId: user.id,
    },
  })

  console.log(playlistsCount)
  res.json({ ...user, playlistsCount })
})
