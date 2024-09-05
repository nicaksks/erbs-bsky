import client from "../database/client";
import CloudError from "../exceptions/CloudError";

interface User {
    userId: string;
    content?: string;
    subdomain: string;
}

export interface Domain extends User {
    hasSubDomain: boolean,
    domain: string
}

enum Version {
    V1 = 1,
    V2,
    V3,
    V4
}

export default class Cloudflare {

    private readonly _host: string = '_atproto';

    private readonly _baseURL: string = `https://api.cloudflare.com/client/v${Version.V4}`;
    private readonly _token: string = `Bearer ${Bun.env.API_TOKEN?.replace('Bearer', '')}`

    private readonly _zone: string = Bun.env.ZONE!;
    private readonly _domain: string = Bun.env.DOMAIN!;

    constructor(private user: User) {
        this.user.subdomain = this.user.subdomain.trim().toLowerCase().replace(Bun.env.Domain!, "");
    }

    public async addSubDomain(): Promise<string> {
        try {

            const checkSub = await client.read(this.user.subdomain);

            if (checkSub) return 'Esse subdomínio já está sendo usado por outra pessoa.';

            const response = await fetch(`${this._baseURL}/zones/${this._zone}/dns_records`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this._token
                },
                body: JSON.stringify({
                    comment: "",
                    content: this.user.content,
                    name: `${this._host}.${this.user.subdomain}.${this._domain}`,
                    type: 'TXT'
                })
            })

            const data = await response.json();
            if (data.errors.length >= 1) throw new CloudError(data?.errors[0].code);

            return await client.create({
                ...this.user,
                hasSubDomain: true,
                domain: `${this.user.subdomain}.${this._domain}`
            })

        } catch (e) {
            throw e
        }
    }

    /*
    public async getAllDNS(): Promise<void> {
        const response = await fetch(`${this._baseURL}/zones/${this._zone}/dns_records`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this._token
            }
        })

        const data = await response.json();
        console.log(data.result)
    }
    */
}