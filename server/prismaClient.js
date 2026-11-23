const { PrismaClient } = require('@prisma/client');

let prisma = null;

function getPrisma() {
  if (!process.env.DATABASE_URL) {
    return null;
  }
  if (!prisma) {
    try {
      prisma = new PrismaClient();
    } catch (err) {
      console.warn('[Prisma] Failed to instantiate PrismaClient:', err.message);
      return null;
    }
  }
  return prisma;
}

module.exports = {
  getPrisma
};
