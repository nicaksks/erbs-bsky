import { REST, Routes } from "discord.js";
import commands from "./commandBuilder/commands";

export default class Deploy extends REST {

    private readonly _clientId: string = '1280994598558367815';
    private readonly _guildId: string = '948849592169013268';

    constructor() {
        super({ version: '10' })
        this.setToken(Bun.env.TOKEN!)
        this.commands()
    }

    private async commands(): Promise<void> {
        try {
            await this.put(Routes.applicationGuildCommands(this._clientId, this._guildId), {
                body: commands
            })
        } catch (e: any) {
            console.error(`⭑｡𖦹°‧ » ${e}`);
        }
    }
}