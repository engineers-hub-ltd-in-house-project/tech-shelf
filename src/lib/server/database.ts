import { PrismaClient } from '@prisma/client';
import { dev } from '$app/environment';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (dev) {
  global.prisma = prisma;
}
