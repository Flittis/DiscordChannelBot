import mongoose from 'mongoose'

const User = mongoose.model('User', new mongoose.Schema({
    user_id: { type: String, required: true },
    username: { type: String, required: true },
    usertag: { type: Number, required: true },
    channel: { 
        channel_id: String,
        title: String,
        isPublic: Boolean,
        userLimit: Number
    },
    state: { type: String },
    stateMessageId: { type: String }
}));

export default User;

