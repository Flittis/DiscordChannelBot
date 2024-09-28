let Variables = {
    VARS: {
        'playerrole': '<@&909848776477396993>',
        'obschchannel': '<#909128709246709851>',
        'plus': '<:plus:911626350387945553>',
        'thread-1': '<:thread~1:911626350446645358>',
        'slash': '<:slash:911975946616209408>',
        'activity': '<:activity:911978379778072616>',
        'community_name': '<:community_name:914875641680261150>',
        'community_limit': '<:community_limit:917138492113448970>',
        'community_hide': '<:community_hide:914875641843810314>',
        'community_unlock': '<:community_unlock:914875641688637482>',
        'community_ban': '<:community_ban:914875641692839936>',
        'community_invite': '<:community_invite:914875641793478717>',
        'community_voice': '<:community_voice:917136967555244042>'
    },
    EMBED_COLOR: '#0099ff',
    ICONS: {
        VOICE_CHANNEL: '🔊'
    },
}

Variables = {
    ...Variables,
    COMMANDS_MESSAGE_TITLE: 'Управление приватным каналом',
    COMMANDS_MESSAGE:
        `Для создания личного голосового канала, у вас должна быть роль ${Variables.VARS['playerrole']}, которую можно получить, подключив учетную запись Discord в настройках профиля. Для выдачи роли, в вашем CYBERSHOKE профиле должно быть 50+ часов игрового времени.` +
        `\n\n** Запуск мини- игры или YouTube в голосовом канале:**` +
        `\n— Вам потребуется нажать ${Variables.VARS['plus']} в чате ${Variables.VARS['obschchannel']}, и выбрать ${Variables.VARS['slash']} \`Использовать слэш-команду\`, ${Variables.VARS['activity']} \`/activity\`` +
        `\n\n** Настройка через кнопки:**` +
        `\nᅠ
        > ${Variables.VARS['community_name']} — \`изменить название канала\`
        > ${Variables.VARS['community_limit']} — \`изменить лимит пользователей\`
        > ${Variables.VARS['community_hide']} — \`скрыть канал от всех (включено по умолчанию)\`
        > ${Variables.VARS['community_unlock']} — \`сделать канал видимым\`
        > ${Variables.VARS['community_ban']} — \`выгнать и заблокировать пользователя\`
        > ${Variables.VARS['community_invite']} — \`выдать/вернуть доступ в канал пользователю\`
        > ${Variables.VARS['community_voice']} — \`изменить битрейт в канале\`
        ᅠ`,
    COMMANDS_MESSAGE_FOOTER: 'Нажмите на кнопки ниже, чтобы поменять настройки канала. Кнопки активны, когда вы находитесь в своём приватном канале.',
    BUTTONS: [
        [
            { id: 'editTitle', emoji: Variables.VARS['community_name'] },
            { id: 'editLimit', emoji: Variables.VARS['community_limit'] },
            { id: 'editClose', emoji: Variables.VARS['community_hide'] },
            { id: 'editOpen', emoji: Variables.VARS['community_unlock'] },
        ],
        [
            { id: 'editUserBlock', emoji: Variables.VARS['community_ban'] },
            { id: 'editUserUnblock', emoji: Variables.VARS['community_invite'] },
            { id: 'editBitrate', emoji: Variables.VARS['community_voice'] }
        ]
    ],
}

export default Variables;


