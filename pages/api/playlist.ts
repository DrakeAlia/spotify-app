import prisma from '../../lib/prisma'
import { validateRoute } from '../../lib/auth'

// This route displays the user's playlist once they've been validated at "/"

export default validateRoute(async (req, res, user) => {
  // We just want to get all the playlists for the user
  const playlists = await prisma.playlist.findMany({
    // Give us all the playlists where user id = user.id
    where: {
      userId: user.id,
    },
    // order by name in ascending order
    orderBy: {
      name: 'asc',
    },
  })
  // send the playlists back
  res.json(playlists)
})

// We're not on edge function anymore so we can access prisma
