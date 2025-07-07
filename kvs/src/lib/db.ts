import { PrismaClient } from '../../generated/prisma/client'

/**
 * PrismaClient is attached to the `global` object in development to prevent
 * exhausting your database connection limit.
 * 
 * Learn more: 
 * https://pris.ly/d/help/next-js-best-practices
 */

// Define a global type to extend the NodeJS.Global interface
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

// Configure Prisma Client with error logging
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['error', 'warn'],
  })
}

// Create or reuse the Prisma Client instance
export const db = global.prisma || prismaClientSingleton()

// Assign the instance to the global object in non-production environments
if (process.env.NODE_ENV !== 'production') global.prisma = db