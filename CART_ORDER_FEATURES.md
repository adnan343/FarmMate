# Cart and Order Management Features

## Overview
This implementation provides a comprehensive cart and order management system with stock validation and order tracking.

## Features Implemented

### 1. Stock Validation
- **Maximum Quantity Enforcement**: Users cannot add more items than available stock
- **Real-time Validation**: Stock is checked every time items are added to cart or quantity is updated
- **Clear Error Messages**: Users receive specific feedback when trying to exceed stock limits

### 2. Cart Management
- **Add to Cart**: Add products with quantity validation
- **Update Quantity**: Modify cart item quantities with stock checks
- **Remove Items**: Remove individual items from cart
- **Clear Cart**: Remove all items from cart
- **Stock Display**: Shows available stock for each product in cart

### 3. Order Processing (Checkout)
- **Order Creation**: Creates orders with shipping and payment information
- **Stock Reduction**: Automatically reduces product stock when orders are placed
- **Cart Clearing**: Clears user's cart after successful order placement
- **Order Storage**: Stores complete order information for future reference

### 4. Order Management
- **Order History**: View all user orders
- **Order Details**: Get detailed information about specific orders
- **Order Status**: Track order status (pending, confirmed, shipped, delivered, cancelled)
- **Admin Functions**: Admin can view all orders and update status

## API Endpoints

### Cart Endpoints
- `GET /api/cart/:userId` - Get user's cart
- `POST /api/cart/:userId/add` - Add item to cart
- `PUT /api/cart/:userId/items/:itemId` - Update cart item quantity
- `DELETE /api/cart/:userId/items/:itemId` - Remove item from cart
- `DELETE /api/cart/:userId/clear` - Clear entire cart

### Order Endpoints
- `POST /api/orders/:userId/checkout` - Create new order (checkout)
- `GET /api/orders/user/:userId` - Get user's orders
- `GET /api/orders/:orderId` - Get specific order details
- `PATCH /api/orders/:orderId/status` - Update order status
- `GET /api/orders` - Get all orders (admin)

## Database Models

### Order Model
```javascript
{
  buyer: ObjectId,           // Reference to User
  items: [{
    productId: ObjectId,     // Reference to Product
    name: String,
    price: Number,
    quantity: Number,
    image: String,
    farmer: ObjectId         // Reference to User (farmer)
  }],
  total: Number,
  status: String,            // pending, confirmed, shipped, delivered, cancelled
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  paymentMethod: String,     // cash, card, online
  paymentStatus: String,     // pending, paid, failed
  orderDate: Date,
  deliveryDate: Date,
  notes: String
}
```

## Frontend Features

### Cart Page
- Display cart items with stock information
- Quantity controls with stock validation
- Real-time total calculation
- Error handling for stock limitations
- Proceed to checkout button

### Checkout Page
- Shipping information form
- Payment information form
- Order summary with item details
- Stock validation before order placement
- Order confirmation with order ID

### Marketplace Page
- Stock-aware quantity selector
- Add to cart with stock validation
- Error messages for stock limitations
- Product modal with stock information

## Stock Validation Logic

1. **Adding to Cart**: Checks if requested quantity + existing cart quantity ≤ available stock
2. **Updating Quantity**: Checks if new quantity ≤ available stock
3. **Checkout**: Validates all cart items have sufficient stock before creating order
4. **Stock Reduction**: Reduces stock by ordered quantity after successful order creation

## Error Handling

- **Insufficient Stock**: Clear error messages showing available vs requested quantity
- **Product Unavailable**: Notifies when product is no longer available
- **Network Errors**: Graceful handling of API failures
- **Validation Errors**: Form validation with user-friendly messages

## Testing

Run the test script to verify functionality:
```bash
cd backend
node test-cart-order.js
```

This will test:
- Adding items to cart within stock limits
- Rejecting requests that exceed stock
- Creating orders and verifying stock reduction
- Order retrieval and management

## Usage Examples

### Adding to Cart
```javascript
// Success case
const response = await fetch('/api/cart/userId/add', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    productId: 'productId',
    quantity: 5  // Must be ≤ available stock
  })
});

// Error case - insufficient stock
// Response: { success: false, msg: "Cannot add more than available stock. Available: 3, Requested: 5" }
```

### Creating Order
```javascript
const orderData = {
  shippingAddress: {
    street: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zipCode: '12345',
    country: 'United States'
  },
  paymentMethod: 'card',
  notes: 'Special delivery instructions'
};

const response = await fetch('/api/orders/userId/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(orderData)
});
```

## Security Features

- **Stock Validation**: Prevents overselling through server-side validation
- **Transaction Safety**: Stock reduction only happens after order creation
- **Data Integrity**: Maintains referential integrity between orders, products, and users
- **Error Recovery**: Graceful handling of partial failures

## Future Enhancements

- **Inventory Alerts**: Notify farmers when stock is low
- **Order Notifications**: Email/SMS notifications for order status changes
- **Payment Integration**: Real payment processing integration
- **Order Tracking**: Real-time delivery tracking
- **Returns/Refunds**: Handle product returns and refunds
- **Bulk Operations**: Admin tools for bulk order management 