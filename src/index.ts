import { Client, Events, GatewayIntentBits } from 'discord.js';
import env from './env';
import Deploy from './Deploy';
import set from './commands/set';
import unlink from './commands/unlink';
import PrismaError from './exceptions/PrismaError';
import CloudError from './exceptions/CloudError';

env.load()

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
    ]
})

client.once('ready', async () => {
    console.log('(੭˃ᴗ˂)੭ ➜ Homura Online!')
    new Deploy()
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isCommand()) return;
    try {
        switch(interaction.commandName) {
            case 'set': return await set(interaction)
            case 'unlink': return await unlink(interaction)
        }
    } catch(e: unknown) {

        if (e instanceof CloudError || e instanceof PrismaError) {
            await interaction.editReply({ content: e.message })
            return
        }

        console.error(`⭑｡𖦹°‧ » ${e}`);
        await interaction.editReply({ content: 'Ocorreu um erro desconhecido.' });
    }

})

client.login(Bun.env.TOKEN!)
