// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

declare global {

  var prisma: PrismaClient | undefined;
}


export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['warn', 'error'],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
