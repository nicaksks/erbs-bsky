export default (errors: string | undefined, code: string | number): string => {
    if (errors) return errors;
    console.debug(`⭑｡𖦹°‧ » Código do erro: ${code} `)
    return 'Error desconhecido.'
}