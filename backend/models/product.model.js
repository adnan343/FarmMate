import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        enum: ['vegetables', 'fruits', 'grains', 'dairy', 'meat', 'other']
    },
    image: {
        type: String,
        default: ''
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    unit: {
        type: String,
        required: true,
        enum: ['kg', 'lb', 'piece', 'dozen', 'bundle']
    },
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    farm: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farm'
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    // New fields for harvested products
    status: {
        type: String,
        enum: ['harvested', 'in_marketplace', 'sold_out'],
        default: 'harvested'
    },
    harvestDate: {
        type: Date,
        default: Date.now
    },
    harvestQuantity: {
        type: Number,
        default: 0
    },
    // Marketplace specific fields
    isInMarketplace: {
        type: Boolean,
        default: false
    },
    marketplacePrice: {
        type: Number,
        min: 0
    },
    marketplaceDescription: {
        type: String,
        default: ''
    },
    marketplaceImage: {
        type: String,
        default: ''
    },
    // Product quality and certification
    isOrganic: {
        type: Boolean,
        default: false
    },
    certification: {
        type: String,
        default: ''
    },
    // Shipping and delivery
    minOrderQuantity: {
        type: Number,
        default: 1
    },
    maxOrderQuantity: {
        type: Number
    },
    deliveryAvailable: {
        type: Boolean,
        default: true
    },
    pickupAvailable: {
        type: Boolean,
        default: true
    },
    // Product specifications
    weight: {
        type: Number,
        default: 0
    },
    dimensions: {
        length: Number,
        width: Number,
        height: Number
    },
    expiryDate: {
        type: Date
    },
    storageInstructions: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', ProductSchema);

export default Product; 