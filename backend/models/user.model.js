import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'farmer', 'buyer'],
        default: 'farmer',
        required: true,
    },
    farms: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Farm'
        }
    ]

}, {
    timestamps: true
})

const User = mongoose.model('User', UserSchema);

export default User;