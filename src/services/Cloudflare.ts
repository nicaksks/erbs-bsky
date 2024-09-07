import db from "../database/db";
import CloudError from "../exceptions/CloudError";

interface User {
    userId: string;
    content?: string;
    subdomain: string;
}

export interface Domain extends User {
    recordId: string,
    domain: string
}

enum Version {
    V1 = 1,
    V2,
    V3,
    V4
}

class Cloudflare {

    private readonly _baseURL: string = `https://api.cloudflare.com/client/v${Version.V4}`;
    private readonly _token: string = `Bearer ${Bun.env.API_TOKEN?.replace('Bearer', '')}`

    private readonly _zone: string = Bun.env.ZONE!;
    private readonly _domain: string = Bun.env.DOMAIN!;

    public async addSubDomain(user: User): Promise<string> {
        try {

            const getUsers = await db.getAll();
            const validate = getUsers?.some((i: Domain) => i.userId === user.userId || i.subdomain === user.subdomain);
            
            if (validate) return 'Você já possui um subdomínio ou esse dominio já está sendo usado por outra pessoa.';

            const response = await fetch(`${this._baseURL}/zones/${this._zone}/dns_records`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this._token
                },
                body: JSON.stringify({
                    comment: "",
                    content: user.content,
                    name: `_atproto.${user.subdomain}.${this._domain}`,
                    type: 'TXT'
                })
            })

            const data = await response.json();
            if (data.errors.length >= 1) throw new CloudError(data?.errors[0].code);

            await db.create({
                ...user,
                recordId: data.result.id,
                domain: `${user.subdomain}.${this._domain}`
            })

            return 'Subdominio adicionado com sucesso! Volte no site e clique em **"Verificar registro de DNS"** para atualizar.'

        } catch (e) {
            throw e
        }
    }

    public async deleteDNS(userId: string): Promise<string> {

        const user = await db.getByUserId(userId);
        if (!user) return 'Você não possui um subdomínio vinculado ao seu Id.';

        const response = await fetch(`${this._baseURL}/zones/${this._zone}/dns_records/${user?.recordId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this._token
            },
        })

        const data = await response.json();
        if (data.errors?.length >= 1) throw new CloudError(data?.errors[0].code);

        await db.deleteDNS(userId);
        return 'Pronto! Agora você pode adicionar um novo subdominio na sua conta.'
    }
}

export default new Cloudflare();
