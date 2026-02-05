import { PrismaClient } from "@prisma/client";

function prismaInstance() {
    return new PrismaClient();
}

const globalForPrisma = global as unknown as {prisma : PrismaClient | undefined};

const prisma = globalForPrisma.prisma ?? prismaInstance();

export default prisma;
if(process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;