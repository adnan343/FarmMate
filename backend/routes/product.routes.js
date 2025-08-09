import express from 'express';
import auth from '../middleware/auth.js';
import { 
    getAllProducts, 
    getProductsByCategory, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct,
    getProductsByFarmer,
    getFarmerOwnProducts,
    toggleProductAvailability
} from '../controllers/product.controller.js';

const router = express.Router();

// Get all products
router.get('/', getAllProducts);

// Get products by category
router.get('/category/:category', getProductsByCategory);

// Get products by farmer (for marketplace)
router.get('/farmer/:farmerId', getProductsByFarmer);

// Get farmer's own products (including unpublished)
router.get('/farmer/:farmerId/own', auth, getFarmerOwnProducts);

// Get single product
router.get('/:id', getProductById);

// Create new product
router.post('/', auth, createProduct);

// Update product
router.put('/:id', auth, updateProduct);

// Toggle product availability (publish/unpublish)
router.patch('/:id/availability', auth, toggleProductAvailability);

// Delete product
router.delete('/:id', auth, deleteProduct);

export default router; 