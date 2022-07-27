import { PrismaClient } from '@prisma/client'

// All this component is going do is make a PrismaClient, which we can always import to other files

export default new PrismaClient()
