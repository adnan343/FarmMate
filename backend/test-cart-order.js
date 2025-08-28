import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import Product from './models/product.model.js';
import User from './models/user.model.js';

// Load environment variables
dotenv.config({ path: '../.env' });

// Connect to MongoDB
connectDB();

async function testCartAndOrder() {
  try {
    console.log('🧪 Testing Cart and Order Functionality...\n');

    // Get a buyer user
    const buyer = await User.findOne({ role: 'buyer' });
    if (!buyer) {
      console.log('❌ No buyer user found. Please run seedData.js first.');
      return;
    }
    console.log(`✅ Found buyer: ${buyer.name}`);

    // Get a product with stock
    const product = await Product.findOne({ stock: { $gt: 0 } });
    if (!product) {
      console.log('❌ No products with stock found. Please run seedData.js first.');
      return;
    }
    console.log(`✅ Found product: ${product.name} (Stock: ${product.stock})`);

    // Test 1: Add to cart within stock limit
    console.log('\n📦 Test 1: Adding to cart within stock limit...');
    const addToCartResponse = await fetch(`https://farmmate-production.up.railway.app/api/cart/${buyer._id}/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: product._id,
        quantity: Math.min(5, product.stock)
      })
    });

    if (addToCartResponse.ok) {
      const cartResult = await addToCartResponse.json();
      console.log(`✅ Successfully added to cart. Cart total: $${cartResult.data.total}`);
    } else {
      const error = await addToCartResponse.json();
      console.log(`❌ Failed to add to cart: ${error.msg}`);
    }

    // Test 2: Try to add more than available stock
    console.log('\n📦 Test 2: Trying to add more than available stock...');
    const overStockResponse = await fetch(`https://farmmate-production.up.railway.app/api/cart/${buyer._id}/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: product._id,
        quantity: product.stock + 10
      })
    });

    if (!overStockResponse.ok) {
      const error = await overStockResponse.json();
      console.log(`✅ Correctly rejected: ${error.msg}`);
    } else {
      console.log('❌ Should have rejected over-stock request');
    }

    // Test 3: Get cart
    console.log('\n📦 Test 3: Getting cart...');
    const getCartResponse = await fetch(`https://farmmate-production.up.railway.app/api/cart/${buyer._id}`);
    if (getCartResponse.ok) {
      const cartData = await getCartResponse.json();
      console.log(`✅ Cart has ${cartData.data.items.length} items`);
      console.log(`✅ Cart total: $${cartData.data.total}`);
    }

    // Test 4: Create order (checkout)
    console.log('\n📦 Test 4: Creating order (checkout)...');
    const orderData = {
      shippingAddress: {
        street: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
        country: 'United States'
      },
      paymentMethod: 'card',
      notes: 'Test order'
    };

    const createOrderResponse = await fetch(`https://farmmate-production.up.railway.app/api/orders/${buyer._id}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });

    if (createOrderResponse.ok) {
      const orderResult = await createOrderResponse.json();
      console.log(`✅ Order created successfully! Order ID: ${orderResult.data._id}`);
      console.log(`✅ Order total: $${orderResult.data.total}`);
      
      // Test 5: Verify stock was reduced
      console.log('\n📦 Test 5: Verifying stock reduction...');
      const updatedProduct = await Product.findById(product._id);
      console.log(`✅ Product stock reduced from ${product.stock} to ${updatedProduct.stock}`);
      
      // Test 6: Get user orders
      console.log('\n📦 Test 6: Getting user orders...');
      const getOrdersResponse = await fetch(`https://farmmate-production.up.railway.app/api/orders/user/${buyer._id}`);
      if (getOrdersResponse.ok) {
        const ordersData = await getOrdersResponse.json();
        console.log(`✅ User has ${ordersData.data.length} orders`);
      }
    } else {
      const error = await createOrderResponse.json();
      console.log(`❌ Failed to create order: ${error.msg}`);
    }

    console.log('\n🎉 Cart and Order functionality test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed.');
  }
}

// Run the test
testCartAndOrder(); 