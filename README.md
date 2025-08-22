# FarmMate 🌾

A comprehensive digital farming platform that connects farmers and buyers, providing tools for farm management, marketplace operations, and community engagement.

## 🚀 Overview

FarmMate is a full-stack web application designed to modernize agricultural commerce and farm management. The platform serves two main user types: **Farmers** and **Buyers**, each with specialized dashboards and features.

## ✨ Features

### 🌱 For Farmers
- **Farm Profile Management**: Create and manage detailed farm profiles
- **Product Management**: List, update, and track inventory of agricultural products
- **Order Management**: Process and track incoming orders from buyers
- **Analytics Dashboard**: View sales performance and farm metrics
- **Crop Suggestions**: AI-powered recommendations for optimal crop selection
- **Pest Detection**: Identify and manage crop pests
- **Planting Calendar**: Plan and schedule planting activities
- **Task Management**: Organize daily farming tasks
- **Community Forum**: Engage with other farmers
- **Q&A System**: Get answers to farming questions

### 🛒 For Buyers
- **Marketplace**: Browse and purchase fresh produce directly from farmers
- **Farmer Discovery**: Find and connect with local farmers
- **Shopping Cart**: Add products with real-time stock validation
- **Order Tracking**: Monitor order status and delivery
- **Favorites**: Save preferred farmers and products
- **Order History**: View past purchases

### 🔧 For Administrators
- **User Management**: Manage farmer and buyer accounts
- **Order Oversight**: Monitor all platform transactions
- **Q&A Moderation**: Manage community questions and answers
- **Analytics**: Platform-wide performance metrics

## 🛠️ Technology Stack

### Backend
- **Node.js** with **Express.js** framework
- **MongoDB** with **Mongoose** ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- **Google Generative AI** for crop suggestions
- **CORS** enabled for cross-origin requests

### Frontend
- **Next.js 15** with **React 19**
- **Tailwind CSS** for styling
- **Chart.js** with **react-chartjs-2** for analytics
- **Lucide React** for icons
- **js-cookie** for cookie management

### Development Tools
- **ESLint** for code linting
- **Nodemon** for backend development
- **PostCSS** and **Autoprefixer** for CSS processing

## 📁 Project Structure

```
FarmMate/
├── backend/                 # Backend API server
│   ├── config/             # Database configuration
│   ├── controllers/        # API route controllers
│   ├── middleware/         # Authentication middleware
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API route definitions
│   ├── server.js          # Main server file
│   └── seedData.js        # Database seeding
├── frontend/              # Next.js frontend application
│   ├── app/              # Next.js app directory
│   │   ├── components/   # Reusable React components
│   │   ├── dashboard/    # User dashboard pages
│   │   │   ├── admin/    # Admin dashboard
│   │   │   ├── buyer/    # Buyer dashboard
│   │   │   └── farmer/   # Farmer dashboard
│   │   ├── login/        # Authentication pages
│   │   └── profile/      # User profile management
│   ├── lib/              # Utility functions and API config
│   └── public/           # Static assets
└── package.json          # Root package configuration
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/adnan343/FarmMate.git
   cd FarmMate
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

4. **Environment Setup**
   
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb:your_mongo_uri_here
   JWT_SECRET=your_jwt_secret_here
   GOOGLE_AI_API_KEY=your_google_ai_api_key_here
   ```

5. **Start the development servers**

   **Backend (Terminal 1):**
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5000`

   **Frontend (Terminal 2):**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

## 📊 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `POST /api/users/logout` - User logout

### Farms
- `GET /api/farms` - Get all farms
- `POST /api/farms` - Create farm profile
- `GET /api/farms/:id` - Get specific farm
- `PUT /api/farms/:id` - Update farm profile

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product listing
- `GET /api/products/:id` - Get specific product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Cart & Orders
- `GET /api/cart/:userId` - Get user's cart
- `POST /api/cart/:userId/add` - Add item to cart
- `PUT /api/cart/:userId/items/:itemId` - Update cart item
- `DELETE /api/cart/:userId/items/:itemId` - Remove item from cart
- `POST /api/orders/:userId/checkout` - Create order
- `GET /api/orders/user/:userId` - Get user's orders

### Community
- `GET /api/forum` - Get forum posts
- `POST /api/forum` - Create forum post
- `GET /api/qa` - Get Q&A posts
- `POST /api/qa` - Create Q&A post

### Analytics
- `GET /api/analytics/farmer/:farmerId` - Get farmer analytics
- `GET /api/analytics/admin` - Get admin analytics

## 🔐 Authentication & Security

- **JWT-based authentication** with secure token storage
- **Password hashing** using bcrypt
- **CORS protection** for cross-origin requests
- **Input validation** and sanitization
- **Stock validation** to prevent overselling

## 🛒 Cart & Order System

The platform includes a robust cart and order management system with:

- **Real-time stock validation** to prevent overselling
- **Shopping cart persistence** across sessions
- **Order status tracking** (pending, confirmed, shipped, delivered, cancelled)
- **Automatic stock reduction** upon order placement
- **Comprehensive order history** for users

## 🤖 AI Features

- **Crop Suggestions**: AI-powered recommendations based on farm conditions
- **Pest Detection**: Identify common agricultural pests
- **Smart Analytics**: Data-driven insights for farm optimization

## 🧪 Testing

Run the cart and order system tests:
```bash
cd backend
node test-cart-order.js
```

## 📈 Deployment

### Backend Deployment
1. Set up environment variables on your hosting platform
2. Ensure MongoDB connection is configured
3. Deploy to platforms like Heroku, Railway, or AWS

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or similar platforms
3. Configure environment variables for API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation in the codebase
- Review the API endpoints and models

## 🔮 Future Enhancements

- **Mobile Application**: Native iOS and Android apps
- **Payment Integration**: Stripe, PayPal, or other payment gateways
- **Real-time Chat**: Direct messaging between farmers and buyers
- **Weather Integration**: Real-time weather data for farming decisions
- **IoT Integration**: Sensor data integration for smart farming
- **Blockchain**: Transparent supply chain tracking
- **Machine Learning**: Advanced crop disease detection
- **Multi-language Support**: Internationalization for global markets

---

**FarmMate** - Connecting farmers and buyers in the digital age 🌾
