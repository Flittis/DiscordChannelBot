import mongoose from 'mongoose'

const User = mongoose.model('User', new mongoose.Schema({
    user_id: { type: String, required: true },
    username: { type: String },
    usertag: { type: Number },
    channel: {
        channel_id: String,
        title: String,
        isPublic: Boolean,
        userLimit: Number
    },
    state: { type: String },
    stateMessageId: { type: String },
    lastTitleEdit: { type: Number }
}));

export default User;
