import { SlashCommandBuilder, type CommandInteraction } from "discord.js";
import Cloudflare from "../services/Cloudflare";

export default {
    data: new SlashCommandBuilder()
        .setName('set')
        .setDescription('Adicione um domínio em sua conta do BSKY')
        .addStringOption(s => s
            .setName('subdomain')
            .setDescription('Seleciona a TAG que vai na frente do domínio')
            .setMinLength(1)
            .setMaxLength(63)
            .setRequired(true)
        )
        .addStringOption(c => c
            .setName('content')
            .setDescription('Copie o Conteúdo que o Bsky forneceu e cole aqui.')
            .setMaxLength(255)
            .setRequired(true)
        ),
    execute: async (interaction: CommandInteraction) => {

        await interaction.deferReply({ ephemeral: true })

        const subdomain = interaction.options.get('subdomain')?.value as string;
        const content = interaction.options.get('content')?.value as string;

        const message = await Cloudflare.addSubDomain({
            userId: interaction.user.id,
            subdomain,
            content
        });

        await interaction.editReply({ content: message });
    }
}