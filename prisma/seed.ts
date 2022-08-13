import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { artistsData } from './songsData'

// This component allows to get some data in the db(specifically some playlists, etc. and populate our sidebar with some playlists,
// we can do some authentication)
// The seed file is not actually part of the app, it's a one-off script. Typically one-off scripts, you want to avoid importing other files from your app because
// your scripts might have a different configuration and runtime then your apps might(Except for the prisma client that was created here).

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

// Create a function called run that is async function for our seed script and the first thing we wanna seed is we wanna insert the artist and
// the songs into the db followed by a user and then followed by some playlists that have all those songs
// that belong to the user
// That way we can log in with a user that already has playlists, that already has songs in it, that belong to an artist
const run = async () => {
  // Promise.all - Takes an iterable of promises as an input, and returns a single Promise that resolves to an array of the
  // results of the input promises.
  await Promise.all(
    artistsData.map(async (artist) => {
      // upsert means to update or create(if it exist, then update it to this and if it doesn't exist then create it with this)
      // You can only upsert if you can query for something unique
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
  // Encryption is like a reversible, it's like if you could make food but also undo it but the only way you
  // could do it is if you knew the special key to the oven and salt is a specific ingredient that makes the food taste a
  // certain way and you need that ingredient in there or otherwise, it won't taste a certain way
  const salt = bcrypt.genSaltSync()
  // Make a user which goung to be await = prisma.user.upsert
  const user = await prisma.user.upsert({
    // Find the user where we go by email
    where: { email: 'user@test.com' },
    // If you find that user, do an update of nothing because we don't want to update this user if you find them
    update: {},
    // But we do want to create them if they don't exist
    create: {
      email: 'user@test.com',
      password: bcrypt.hashSync('password', salt),
      firstName: 'Drake',
      lastName: 'Alia',
    },
  })

  const createMany = await prisma.user.createMany({
    data: [
      { name: 'Bob', email: 'bob@prisma.io' },
      { name: 'Bobo', email: 'bob@prisma.io' }, // Duplicate unique key!
      { name: 'Yewande', email: 'yewande@prisma.io' },
      { name: 'Angelique', email: 'angelique@prisma.io' },
    ],
    skipDuplicates: true, // Skip 'Bobo'
  })


  // Give the user a playlist and we want those playlist to have songs
  // This is saying, create 10 playlist whose names are playlist number that has a user whose id is this one,
  // connect those two together and then it has an array of songs whose values are an array of the song ids,
  // connect those
  const songs = await prisma.song.findMany({})
  // Get all the songs
  await Promise.all(
    // Create 10 playlists(doesn't matter what you put in for fill).
    // map over that(don't care about the first arg because that's always going to be number one, only care about the index)
    // This will be async function in the map callback
    new Array(10).fill(1).map(async (_, i) => {
      // create a playlist(for create, you don't have to put the where clause just the data)
      return prisma.playlist.create({
        data: {
          // Give it the name playlist and its starting at 1
          name: `Playlist #${i + 1}`,
          user: {
            // make sure that prisma connects the user with this id to the user on this playlist
            connect: { id: user.id },
          },
          songs: {
            // connect all these songs and for each song put their ids
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

// npx prisma db seed - you decide when to invoke the seed command. It can be useful for a test setup or
// to prepare a new development environment, for example.
