import { PrismaClient } from "@prisma/client";
var prisma;
if (!global.__db) {
    global.__db = new PrismaClient();
}
prisma = global.__db;
export { prisma };
