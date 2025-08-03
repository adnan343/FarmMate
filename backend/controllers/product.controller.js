import Product from '../models/product.model.js';

// Get all available products
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({ isAvailable: true })
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

// Get products by farmer
export const getProductsByFarmer = async (req, res) => {
    const { farmerId } = req.params;
    
    try {
        const products = await Product.find({ 
            farmer: farmerId,
            isAvailable: true 
        })
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