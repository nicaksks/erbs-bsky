import type { CommandInteraction } from "discord.js";
import Cloudflare from "../services/Cloudflare";

export default async (interaction: CommandInteraction): Promise<void> => {
    await interaction.deferReply({ ephemeral: true })

    const userId = interaction.user.id;
    const del = await Cloudflare.deleteDNS(userId);

    await interaction.editReply({ content: del });
}