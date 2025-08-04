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
    phone: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },
    farms: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Farm'
        }
    ],
    cart: {
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product'
                },
                name: String,
                price: Number,
                quantity: {
                    type: Number,
                    default: 1,
                    min: 1
                },
                image: String,
                farmer: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                }
            }
        ],
        total: {
            type: Number,
            default: 0
        },
        itemCount: {
            type: Number,
            default: 0
        }
    },
    favorites: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]

}, {
    timestamps: true
})

const User = mongoose.model('User', UserSchema);

export default User;