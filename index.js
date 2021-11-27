import Config from './src/Config.js'

import mongoose from 'mongoose'
import { Client } from 'discord.js'

import ChannelController from './src/Controller/ChannelController.js'

const Bot = new Client({ intents: [ 'GUILDS', 'GUILD_MESSAGES', 'DIRECT_MESSAGES', 'GUILD_VOICE_STATES' ] });

Bot.on('ready', ChannelController.onReady);
Bot.on('voiceStateUpdate', ChannelController.voiceStateUpdate);
Bot.on('messageCreate', ChannelController.messageCreate);
Bot.on('interactionCreate', ChannelController.interactionCreate);

async function Start() {
    try {
        await mongoose.connect(`${Config.DB_URL}`, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => console.log(`DB Connected to ${Config.DB_URL.replace(/(mongodb\:\/\/).+\@(.+)\/.+/gi, '$1$2')}`));

        Bot.login(Config.BOT_TOKEN);
    } catch (e) {
        console.error(e);
    }
}

Start();

export { Bot };
