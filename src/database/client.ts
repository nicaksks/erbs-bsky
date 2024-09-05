import { PrismaClient } from "@prisma/client";
import type { Domain } from '../services/Cloudflare';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import PrismaError from "../exceptions/PrismaError";

const client = new PrismaClient();

export default {
    create: async (domain: Domain): Promise<Domain> => {
        try {
            delete domain.content;
            return await client.user.create({ data: { ...domain } })
        } catch (e: unknown) {

            if (e instanceof PrismaClientKnownRequestError) {
                throw new PrismaError(e.code)
            }

            console.error(`⭑｡𖦹°‧ » ${e}`);
            throw new Error('Ocorreu um erro desconhecido.')
        }
    },
    getBySubDomain: async (subdomain: string): Promise<Domain | null> => {
        return await client.user.findUnique({ where: { subdomain } })
    },
    getByUserId: async (userId: string): Promise<Domain | null> => {
        return await client.user.findUnique({ where: { userId } })
    },
    deleteDNS: async (userId: string): Promise<void> => {
        await client.user.delete({ where: { userId } })
    }
}