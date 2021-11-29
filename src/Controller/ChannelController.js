import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js'
import { Bot } from '../../index.js'    

import Config from '../Config.js';
import UserController from './UserController.js';

let ChannelController = {
    onReady: async () => {
        console.log(`Logged in as ${Bot.user.tag}!`);

        Bot.EveryoneRole = (await Bot.guilds?.fetch(Config.SERVER_ID)).roles.everyone;
        ChannelController.createButtons();
    },
    voiceStateUpdate: async (oldState, newState) => {
        try {
            if (!oldState.channelId && newState.channelId == Config.CHANNEL_CREATE_ID) {
                let User = await Bot.users.fetch(newState.id),
                    Member = await newState.guild.members.fetch(User),
                    Self = await UserController.get(User);

                let Channel = await newState.guild.channels.create(`${Config.ICONS.VOICE_CHANNEL} ┆ ${User.username}`, {
                    type: 'GUILD_VOICE',
                    parent: Config.CATEGORY_CREATE_ID,
                    userLimit: 1,
                    lockPermissions: 1
                })

                await Channel.permissionOverwrites.edit( User.id, { 'VIEW_CHANNEL': true })
                await Channel.permissionOverwrites.edit( Bot.EveryoneRole.id, { 'VIEW_CHANNEL': false })
                
                Self.channel = { channel_id: Channel.id, title: User.username, isPublic: false, userLimit: 1 }
                await Self.save();

                Member.voice.setChannel(Channel);
            } else if (!newState.channel && oldState.id != Config.CHANNEL_CREATE_ID) {
                let Self = await UserController.get({ id: oldState.id });

                if (oldState.channelId == Self.channel.channel_id) {
                    oldState.channel.delete();
                    
                    Self.channel = undefined;
                    Self.save();
                } 
            }
        } catch (e) {
            console.error(e);
        }
    },
    createButtons: async () => {
        try {
            const embed = new MessageEmbed()
                .setColor('#4f545c')
                .setTitle(Config.COMMANDS_MESSAGE_TITLE)
                .setDescription(Config.COMMANDS_MESSAGE)
                .setFooter(Config.COMMANDS_MESSAGE_FOOTER)


            let _row1 = new MessageActionRow().addComponents( Config.BUTTONS[0].map((el) => new MessageButton().setCustomId(el.id).setEmoji(el.emoji).setStyle('SECONDARY')) );
            let _row2 = new MessageActionRow().addComponents( Config.BUTTONS[1].map((el) => new MessageButton().setCustomId(el.id).setEmoji(el.emoji).setStyle('SECONDARY')) );

            (await (await Bot.guilds.fetch(Config.SERVER_ID)).channels.fetch(Config.CHANNEL_COMMANDS_ID)).send({ embeds: [embed], components: [_row1, _row2] });
        } catch(e) {
            console.error(e);
        }
    },
    messageCreate: async msg => {
        if (msg?.channelId != Config.CHANNEL_COMMANDS_ID) return;
        if (msg.author.id == Config.BOT_ID) return;

        try {
            let Self = await UserController.get(msg.author);

            if (!Self || !Self.channel?.channel_id || Self.state == '') return msg.delete();

            let embed;

            switch(Self.state) {
                case 'editTitle':
                    if (!msg.content) return msg.delete();
                    if (msg.content.length > 40) return msg.delete();

                    var Channel = await msg.guild?.channels?.fetch(Self.channel.channel_id);
                    await Channel.edit({ name: `${Config.ICONS.VOICE_CHANNEL} ┆ ${msg.content}` });

                    embed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setDescription('Название канала успешно изменено');

                    break;
                case 'editLimit':
                    if (parseInt(msg.content) === undefined) return msg.delete();
                    if (parseInt(msg.content) > 99) msg.content = '0';

                    var Channel = await msg.guild?.channels?.fetch(Self.channel.channel_id);
                    let Edit = await Channel.edit({ userLimit: parseInt(msg.content) });

                    embed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setDescription('Лимит пользователей успешно изменен');

                    break;
                case 'editUserBlock':
                    if (!msg.mentions?.users?.first()) return msg.delete();

                    var Channel = await msg.guild?.channels?.fetch(Self.channel.channel_id);

                    Channel.members.filter(usr => usr.id == msg.mentions.users.first().id)?.first()?.voice?.setChannel('911395605048352845')
                    await Channel.permissionOverwrites.edit(msg.mentions.users.first().id, { 'VIEW_CHANNEL': false })

                    embed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setDescription(`Вы заблокировали пользователя **${msg.mentions.users.first().username}** в канале`);

                    break;
                case 'editUserUnblock':
                    if (!msg.mentions?.users?.first()) return msg.delete();

                    var Channel = await msg.guild?.channels?.fetch(Self.channel.channel_id);

                    await Channel.permissionOverwrites.edit(msg.mentions.users.first().id, { 'VIEW_CHANNEL': true })

                    embed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setDescription(`Вы разблокировали пользователя **${msg.mentions.users.first().username}** в канале`);

                    break;
            }    

            msg.delete();
            
            if(!embed) return;

            let MSGID = Self.stateMessageId;

            (await msg.channel.messages.fetch(MSGID)).edit({ embeds: [ embed ] })
            Self.state = '';
            Self.stateMessageId = 0;
            await Self.save();
            
            setTimeout(async () => {
                (await msg.channel.messages.fetch()).forEach((_msg) => {
                    if (_msg.id != Config.COMMANDS_MESSAGE_ID) _msg.delete().catch(() => { console.error(`Unable to delete ${_msg.id}`) })
                })
            }, 3000)
        } catch(e) {
            console.error(e);
        }
    },
    interactionCreate: async msg => {
        if (!msg.isButton() || !msg.customId || msg?.channelId != Config.CHANNEL_COMMANDS_ID) return;

        await msg.deferReply()
        
        try {
            let Self = await UserController.get(msg.user);

            if (!Self || !Self.channel) return;

            let embed;

            switch(msg.customId) {
                case 'editTitle':
                    embed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setDescription(`<@${msg.user.id}>, введите новое название канала в диапазоне от 1 до 40 символов`);

                    break;
                case 'editLimit':
                    embed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setDescription(`<@${msg.user.id}>, введите новый лимит пользователей в диапазоне от 1 до 90 пользователей.\n0 - без ограничений`);

                    break;
                case 'editClose':
                    var Channel = await msg.guild?.channels?.fetch(Self.channel.channel_id);

                    await Channel.permissionOverwrites.edit(Bot.EveryoneRole.id, { 'VIEW_CHANNEL': false })

                    embed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setDescription(`<@${msg.user.id}>, вы сделали комнату закрытой`);

                    break;
                case 'editOpen':
                    var Channel = await msg.guild?.channels?.fetch(Self.channel.channel_id);

                    await Channel.permissionOverwrites.edit(Bot.EveryoneRole.id, { 'VIEW_CHANNEL': true })

                    embed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setDescription(`<@${msg.user.id}>, вы сделали комнату открытой`);

                    break;
                case 'editUserBlock':
                    embed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setDescription(`<@${msg.user.id}>, тегните пользователя, которого хотите заблокировать`);

                    break;
                case 'editUserUnblock':
                    embed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setDescription(`<@${msg.user.id}>, тегните пользователя, которого хотите разблокировать`);

                    break;
            }

            await msg.deleteReply();

            if(!embed) return;

            let _msg = await msg.channel.send({ embeds: [embed] });

            if(['editOpen', 'editClose'].includes(msg.customId)) 
                return setTimeout(async () => _msg.delete().catch(() => { console.error(`Unable to delete ${_msg.id}`) }), 3000)

            Self.state = msg.customId;
            Self.stateMessageId = _msg.id;
            await Self.save();
        } catch (e) {
            console.error(e);
        }
    }
}

export default ChannelController;