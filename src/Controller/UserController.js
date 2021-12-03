import User from '../Model/UserModel.js'

let UserController = {
    get: userData => { return new Promise(async (resolve, reject) => {
        if (!userData || !userData.id) reject(null);

        let Self = await User.findOne({ user_id: userData.id }).exec();

        if (!Self) {
            let _User = new User({ user_id: userData.id, username: userData.username || undefined, usertag: userData.discriminator || undefined, channel: 0, state: '' });
            await _User.save();

            Self = _User;
        }

        resolve(Self);
    })},
    getChannel: channel_id => { return new Promise(async (resolve, reject) => {
        if (!channel_id) reject(null);

        let Self = await User.findOne({ 'channel.channel_id': channel_id }).exec();

        if(!Self) reject(null);

        resolve(Self);
    })}
} 

export default UserController;
