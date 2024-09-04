import { Client, Events, GatewayIntentBits } from 'discord.js';
import env from './env';
import Deploy from './Deploy';
import Cloudflare from './services/Cloudflare';
import CloudError from './exceptions/CloudError';
import PrismaError from './exceptions/PrismaError';

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
    if (interaction.commandName === 'set') {

        await interaction.deferReply({ ephemeral: true })

        const subdomain = interaction.options.get('subdomain')?.value as string;
        const content = interaction.options.get('content')?.value as string;

        try {

            const cf = new Cloudflare({
                userId: interaction.user.id,
                subdomain: subdomain.trim().toLowerCase(),
                content
            })

            const message = await cf.addSubDomain();
            await interaction.editReply({ content: message });
        } catch (e: unknown) {

            if (e instanceof CloudError || e instanceof PrismaError) {
                await interaction.editReply({ content: e.message })
            }

            console.error(`⭑｡𖦹°‧ » ${e}`);
            await interaction.editReply({ content: 'Ocorreu um erro desconhecido.' });
        }
    }
})

client.login(Bun.env.TOKEN!)
