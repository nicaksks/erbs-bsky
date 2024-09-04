import errorMessage from "./errorMessage"

export default class PrismaError extends Error {

    private _errors: Record<string, string> = {
        'P2002': 'Você já possui um subdomínio.'
    }

    constructor(public code: string) {
        super(code)
        this.message = errorMessage(this._errors[this.code], code)
    }
}