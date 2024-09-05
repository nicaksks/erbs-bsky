import { Client, Events, GatewayIntentBits } from 'discord.js';
import env from './env';
import DeployCommands from './DeployCommands';
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

const execute = new DeployCommands();

client.once('ready', async () => {
    console.log('(੭˃ᴗ˂)੭ ➜ Homura Online!')
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isCommand()) return;
    try {
        await execute.command(interaction.commandName, interaction);
    } catch (e: unknown) {

        if (e instanceof CloudError || e instanceof PrismaError) {
            return await interaction.editReply({ content: e.message })
        }

        console.error(`⭑｡𖦹°‧ » ${e}`);
        await interaction.editReply({ content: 'Ocorreu um erro desconhecido.' });
    }

})

client.login(Bun.env.TOKEN!)
