import type { CommandInteraction } from "discord.js";
import Cloudflare from "../services/Cloudflare";

export default async (interaction: CommandInteraction) => {

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