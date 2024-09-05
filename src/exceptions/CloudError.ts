import errorMessage from "./errorMessage"

export default class CloudError extends Error {

    private _errors: Record<number, string> = {
        1004: 'Subdomínio inválido.',
        10000: 'Permissão negada.',
        81044: 'Não possui nenhum DNS vinculado ao seu perfil',
        81058: 'Esse subdomínio já está sendo usado.'
    }

    constructor(public code: number) {
        super(code.toString())
        this.message = errorMessage(this._errors[this.code], code)
    }
}