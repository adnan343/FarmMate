import mongoose from 'mongoose';
import * as string_decoder from "node:string_decoder";

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
    userType: {
        type: String,
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