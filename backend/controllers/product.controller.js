import Product from '../models/product.model.js';

// Get all available products
export const getAllProducts = async (req, res) => {
    const { category } = req.query;
    
    try {
        let query = { isAvailable: true };
        
        // Add category filter if provided
        if (category && category !== 'all') {
            query.category = category;
        }
        
        const products = await Product.find(query)
            .populate('farmer', 'name')
            .populate('farm', 'name');
        
        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
};

// Get marketplace products (only products available in marketplace)
export const getMarketplaceProducts = async (req, res) => {
    const { category, organic, delivery } = req.query;
    
    try {
        let query = { 
            isInMarketplace: true
        };
        
        // Add category filter if provided
        if (category && category !== 'all') {
            query.category = category;
        }
        
        // Add organic filter if provided
        if (organic === 'true') {
            query.isOrganic = true;
        }
        
        // Add delivery filter if provided
        if (delivery === 'true') {
            query.deliveryAvailable = true;
        }
        
        const products = await Product.find(query)
            .populate('farmer', 'name')
            .populate('farm', 'name location');
        
        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error('Error fetching marketplace products:', error);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
};

// Get products by category
export const getProductsByCategory = async (req, res) => {
    const { category } = req.params;
    
    try {
        const products = await Product.find({ 
            category: category,
            isAvailable: true 
        })
        .populate('farmer', 'name')
        .populate('farm', 'name');
        
        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error('Error fetching products by category:', error);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
};

// Get single product
export const getProductById = async (req, res) => {
    const { id } = req.params;
    
    try {
        const product = await Product.findById(id)
            .populate('farmer', 'name email phone')
            .populate('farm', 'name location');
        
        if (!product) {
            return res.status(404).json({ success: false, msg: 'Product not found' });
        }
        
        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
};

// Create new product (for farmers)
export const createProduct = async (req, res) => {
    const productData = req.body;
    
    try {
        const newProduct = new Product(productData);
        await newProduct.save();
        
        res.status(201).json({
            success: true,
            msg: 'Product created successfully',
            data: newProduct
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
};

// Create harvested product (from current crops)
export const createHarvestedProduct = async (req, res) => {
    const productData = req.body;
    
    try {
        // Set default values for harvested products
        const harvestedProduct = new Product({
            ...productData,
            status: 'harvested',
            harvestDate: new Date(),
            isInMarketplace: false
        });
        
        await harvestedProduct.save();
        
        res.status(201).json({
            success: true,
            msg: 'Harvested product created successfully',
            data: harvestedProduct
        });
    } catch (error) {
        console.error('Error creating harvested product:', error);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
};

// Add product to marketplace
export const addToMarketplace = async (req, res) => {
    const { id } = req.params;
    const marketplaceData = req.body;
    
    try {
        const product = await Product.findById(id);
        
        if (!product) {
            return res.status(404).json({ success: false, msg: 'Product not found' });
        }
        
        // Update product with marketplace information
        const updatedProduct = await Product.findByIdAndUpdate(id, {
            ...marketplaceData,
            isInMarketplace: true,
            status: 'in_marketplace',
            isAvailable: true
        }, {
            new: true,
            runValidators: true
        });
        
        res.status(200).json({
            success: true,
            msg: 'Product added to marketplace successfully',
            data: updatedProduct
        });
    } catch (error) {
        console.error('Error adding product to marketplace:', error);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
};

// Remove product from marketplace
export const removeFromMarketplace = async (req, res) => {
    const { id } = req.params;
    
    try {
        const product = await Product.findByIdAndUpdate(id, {
            isInMarketplace: false,
            status: 'harvested'
        }, {
            new: true
        });
        
        if (!product) {
            return res.status(404).json({ success: false, msg: 'Product not found' });
        }
        
        res.status(200).json({
            success: true,
            msg: 'Product removed from marketplace successfully',
            data: product
        });
    } catch (error) {
        console.error('Error removing product from marketplace:', error);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
};

// Update product
export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    
    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true
        });
        
        if (!updatedProduct) {
            return res.status(404).json({ success: false, msg: 'Product not found' });
        }
        
        res.status(200).json({
            success: true,
            msg: 'Product updated successfully',
            data: updatedProduct
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
};

// Delete product
export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    
    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        
        if (!deletedProduct) {
            return res.status(404).json({ success: false, msg: 'Product not found' });
        }
        
        res.status(200).json({
            success: true,
            msg: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
};

// Get products by farmer (for marketplace - only published products)
export const getProductsByFarmer = async (req, res) => {
    const { farmerId } = req.params;
    const { category, status } = req.query;
    
    try {
        let query = { farmer: farmerId };
        
        // Add category filter if provided
        if (category && category !== 'all') {
            query.category = category;
        }
        
        // Add status filter if provided
        if (status && status !== 'all') {
            query.status = status;
        }
        
        const products = await Product.find(query)
            .populate('farm', 'name location');
        
        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error('Error fetching farmer products:', error);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
};

// Get farmer's own products (including unpublished ones)
export const getFarmerOwnProducts = async (req, res) => {
    const { farmerId } = req.params;
    const { category } = req.query;
    
    try {
        let query = { 
            farmer: farmerId
        };
        
        // Add category filter if provided
        if (category && category !== 'all') {
            query.category = category;
        }
        
        const products = await Product.find(query)
            .populate('farm', 'name location')
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error('Error fetching farmer own products:', error);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
};

// Publish/unpublish product
export const toggleProductAvailability = async (req, res) => {
    const { id } = req.params;
    const { isAvailable } = req.body;
    
    try {
        const product = await Product.findById(id);
        
        if (!product) {
            return res.status(404).json({ success: false, msg: 'Product not found' });
        }
        
        // Check if product has a price set before publishing
        if (isAvailable && product.price <= 0) {
            return res.status(400).json({ 
                success: false, 
                msg: 'Please set a price before publishing the product' 
            });
        }
        
        product.isAvailable = isAvailable;
        await product.save();
        
        res.status(200).json({
            success: true,
            msg: `Product ${isAvailable ? 'published' : 'unpublished'} successfully`,
            data: product
        });
    } catch (error) {
        console.error('Error toggling product availability:', error);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
};

// Get harvested products by farmer (My Products section)
export const getHarvestedProductsByFarmer = async (req, res) => {
    const { farmerId } = req.params;
    
    try {
        const products = await Product.find({ 
            farmer: farmerId,
            status: 'harvested'
        })
        .populate('farm', 'name location');
        
        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error('Error fetching harvested products:', error);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
};

// Get marketplace products by farmer
export const getMarketplaceProductsByFarmer = async (req, res) => {
    const { farmerId } = req.params;
    
    try {
        const products = await Product.find({ 
            farmer: farmerId,
            isInMarketplace: true,
            status: 'in_marketplace'
        })
        .populate('farm', 'name location');
        
        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error('Error fetching marketplace products:', error);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
}; 