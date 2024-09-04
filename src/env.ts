const { DOMAIN, ZONE, API_TOKEN, TOKEN } = Bun.env;

export default {
    load: () => {
        if (!DOMAIN || !ZONE || !API_TOKEN || !TOKEN) {
            console.warn('૮๑ˊᯅˋ๑ა Missing information in .ENV file ૮๑ˊᯅˋ๑ა')
            process.exit(1)
        }
    }
}