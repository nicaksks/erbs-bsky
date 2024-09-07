import { CommandInteraction, REST, Routes } from "discord.js";
import fs from 'node:fs';

class DeployCommands extends REST {

    private readonly _clientId: string = '1280994598558367815';
    private readonly _guildId: string = '948849592169013268';
    private _commands: Array<any>;

    constructor() {
        super({ version: '10' })
        this.setToken(Bun.env.TOKEN!)
        this.loadCommands()
        this._commands = [];
    }

    private async loadCommands(): Promise<void> {
        try {
            await this.commands()

            const commands = this._commands.map(i => i.data);

            await this.put(Routes.applicationGuildCommands(this._clientId, this._guildId), {
                body: commands
            })

        } catch (e: any) {
            console.error(`⭑｡𖦹°‧ » ${e}`);
        }
    }

    private async commands(): Promise<void> {
        for (const file of this.commandsFolder) {
            const command = await this.commandData(file);

            if ('data' in command && 'execute' in command) {
                this._commands.push(command)
            }
        }
    }

    public async command(commandName: string, interaction: CommandInteraction): Promise<void> {
        for (const command of this._commands) {
            if (command.data.name === commandName) {
                await command.execute(interaction);
            }
        }
    }

    private get commandsFolder(): Array<String> {
        return fs
            .readdirSync(__dirname + '/commands')
            .filter(file => file.endsWith('.ts'));
    }

    private async commandData(file: String): Promise<any> {
        const commandDefault = await import(__dirname + `/commands/${file}`);
        return commandDefault.default
    }
}

export default new DeployCommands();