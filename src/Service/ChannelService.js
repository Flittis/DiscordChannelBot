import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js'
import { Bot } from '../../index.js'
import Config from '../Config.js';

let ChannelService = {
    editChannel: async (msg, _Channel) => {
        var Channel = await msg.guild?.channels?.fetch(_Channel.channel_id);

        await Channel.edit({ 
            name: `${_Channel.isPublic ? '' : Config.ICONS.CLOSED_CHANNEL}${Config.ICONS.VOICE_CHANNEL} ┆ ${_Channel.title}`,
            userLimit: _Channel.userLimit,
            permissionOverwrites: [
                {
                    id: Bot.EveryoneRole.id,
                    [ _Channel.isPublic ? 'allow' : 'deny' ]: ['VIEW_CHANNEL']
                }
            ]
        })
        .then(resp => console.log(resp))
        .catch(err => console.error(err));
    }
}

export default ChannelService;