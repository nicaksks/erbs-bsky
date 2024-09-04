import { PrismaClient } from "@prisma/client";
import type { Domain } from '../services/Cloudflare';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import PrismaError from "../exceptions/PrismaError";

const client = new PrismaClient();

export default {
    create: async (domain: Domain): Promise<string> => {
        try {
            delete domain.content;
            await client.user.create({ data: { ...domain } })
            return `Subdominio adicionado com sucesso! Clique em "Verificar registro de DNS" para atualizar.`
        } catch (e: unknown) {

            if (e instanceof PrismaClientKnownRequestError) {
                throw new PrismaError(e.code)
            }

            console.error(`⭑｡𖦹°‧ » ${e}`);
            return "Ocorreu um erro desconhecido."
        }
    },
    read: async (subdomain: string): Promise<boolean> => {
        return Boolean(await client.user.findUnique({
            where: {
                subdomain
            }
        }))
    }
}