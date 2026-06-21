import express from 'express';
import auth from '../middleware/auth.js';
import { requireRole, requireAdmin } from '../middleware/rbac.js';
import { 
    getAllProducts, 
    getMarketplaceProducts,
    getProductsByCategory, 
    getProductById, 
    createProduct, 
    createHarvestedProduct,
    addToMarketplace,
    removeFromMarketplace,
    updateProduct, 
    deleteProduct,
    getProductsByFarmer,
    getFarmerOwnProducts,
    toggleProductAvailability,
    getHarvestedProductsByFarmer,
    getMarketplaceProductsByFarmer
} from '../controllers/product.controller.js';

const router = express.Router();

// Public routes (browse products)
router.get('/', getAllProducts);
router.get('/marketplace', getMarketplaceProducts);
router.get('/category/:category', getProductsByCategory);

// Protected farmer-specific routes must be declared before /farmer/:farmerId and /:id.
router.get('/farmer/:farmerId/own', auth, requireRole('farmer', 'admin'), getFarmerOwnProducts);
router.get('/farmer/:farmerId/harvested', auth, requireRole('farmer', 'admin'), getHarvestedProductsByFarmer);
router.get('/farmer/:farmerId/marketplace', auth, requireRole('farmer', 'admin'), getMarketplaceProductsByFarmer);
router.post('/harvested', auth, requireRole('farmer'), createHarvestedProduct);

router.get('/farmer/:farmerId', getProductsByFarmer);

// Single product (public for browsing)
router.get('/:id', getProductById);

// Create new product (farmer only)
router.post('/', auth, requireRole('farmer'), createProduct);

// Update product (farmer owner or admin)
router.put('/:id', auth, requireRole('farmer', 'admin'), updateProduct);

// Marketplace operations (farmer only)
router.put('/:id/marketplace', auth, requireRole('farmer'), addToMarketplace);
router.put('/:id/remove-marketplace', auth, requireRole('farmer'), removeFromMarketplace);

// Toggle product availability (farmer only)
router.patch('/:id/availability', auth, requireRole('farmer'), toggleProductAvailability);

// Delete product (farmer owner or admin)
router.delete('/:id', auth, requireRole('farmer', 'admin'), deleteProduct);

export default router;
