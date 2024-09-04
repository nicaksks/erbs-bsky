import { SlashCommandBuilder } from "discord.js";

export default [
    new SlashCommandBuilder()
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
        )
        .toJSON()
]
