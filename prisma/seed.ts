import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { artistsData } from './songsData'

// This component allows to get some data in the db(specifically some playlists, etc. and populate our sidebar with some playlists, we can do some authentication)

// Next.js allows you write back end code inside the front end components(fullstack framework that does both)
// It comes with an api folder that has serverless functions in every one of those files
// We can also use the db directly inside the components without going through the api
// Making so it so that there's just less overhead and that we can deploy to one platform versus two different platforms and all the code lives together
// And with prisma, we get type checks
// During production, this you would put prisma here in this file

// PrismaClient is an auto-generated and type-safe query builder that's tailored to your data.

// bcyrpt is a library that helps you hash passwords

// Prisma handles the db connection for us
const prisma = new PrismaClient()

// Create a function called run that is async function for our seed script and the first thing we wanna seed is we wanna insert the artist and the songs into the db followed by a user and then followed by some playlists that have all those songs that belong to the user
// That way we can log in with a user that already has playlists, that already has songs in it, that belong to an artist
const run = async () => {
  await Promise.all(
    artistsData.map(async (artist) => {
      // upsert means to update or create(if it exist, then update it to this and if it doesn't exist then create it with this)
      return prisma.artist.upsert({
        // where - find any artists whose name equals artist.name
        where: { name: artist.name },
        // update - if you find the artist, then update it with nothing(this is a seed script not trying to update anything)
        update: {},
        // create - if you don't find the artist, then create this artist
        create: {
          // artist has a name
          name: artist.name,
          // artist has a song(s) - has a song array
          songs: {
            create: artist.songs.map((song) => ({
              name: song.name,
              duration: song.duration,
              url: song.url,
            })),
          },
        },
      })
    })
  )

  // Create user, we need a password but we're gonna hash the password before we do that and in order to do that we're gonna generate a salt
  // Encryption is like a reversible, it's like if you could make food but also undo it but the only way you could do it is if you knew the special key to the oven and salt is a specific ingredient that makes the food taste a certain way and you need that ingredient in there or otherwise, it won't taste a certain way
  const salt = bcrypt.genSaltSync()
  // Make a user which goung to be await = prisma.user.upsert
  const user = await prisma.user.upsert({
    // find the user where we go by email
    where: { email: 'user@test.com' },
    // if you find that user, do an update of nothing because we don't want to update this user if you find them
    update: {},
    // But we do want to create them if they don't exist
    create: {
      email: 'user@test.com',
      password: bcrypt.hashSync('password', salt),
      firstName: 'Drake',
      lastName: 'Alia',
    },
  })

  const songs = await prisma.song.findMany({})
  await Promise.all(
    new Array(10).fill(1).map(async (_, i) => {
      return prisma.playlist.create({
        data: {
          name: `Playlist #${i + 1}`,
          user: {
            connect: { id: user.id },
          },
          songs: {
            connect: songs.map((song) => ({
              id: song.id,
            })),
          },
        },
      })
    })
  )
}

run()
  // if there is an error, just exit this process
  .catch((e) => {
    console.error(e)
    // exit 1 - means error in the terminal, 0 means non error
    process.exit(1)
  })
  .finally(async () => {
    // disconnects the db so it's not just some lingering db connection going around
    await prisma.$disconnect()
  })
