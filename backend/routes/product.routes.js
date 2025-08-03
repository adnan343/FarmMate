import express from 'express';
import { 
    getAllProducts, 
    getProductsByCategory, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct,
    getProductsByFarmer
} from '../controllers/product.controller.js';

const router = express.Router();

// Get all products
router.get('/', getAllProducts);

// Get products by category
router.get('/category/:category', getProductsByCategory);

// Get products by farmer
router.get('/farmer/:farmerId', getProductsByFarmer);

// Get single product
router.get('/:id', getProductById);

// Create new product
router.post('/', createProduct);

// Update product
router.put('/:id', updateProduct);

// Delete product
router.delete('/:id', deleteProduct);

export default router; 