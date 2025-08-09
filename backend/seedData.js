import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import Crop from './models/crop.model.js';
import Farm from './models/farm.model.js';
import Product from './models/product.model.js';
import User from './models/user.model.js';

// Load environment variables
dotenv.config({ path: '../.env' });

// Connect to MongoDB
connectDB();

// Dummy farmers data
const dummyFarmers = [
  {
    name: 'Azmain Adib',
    email: 'azmain@gmial.com',
    password: '123456',
    role: 'farmer',
    phone: '+1-555-0101',
    location: 'Springfield, IL',
    bio: 'Organic farmer with 15 years of experience growing vegetables and fruits.'
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@farm.com',
    password: 'password123',
    role: 'farmer',
    phone: '+1-555-0102',
    location: 'Madison, WI',
    bio: 'Dairy farmer specializing in organic milk and cheese products.'
  },
  {
    name: 'Mike Wilson',
    email: 'mike.wilson@farm.com',
    password: 'password123',
    role: 'farmer',
    phone: '+1-555-0103',
    location: 'Des Moines, IA',
    bio: 'Grain farmer with expertise in corn and wheat cultivation.'
  },
  {
    name: 'Lisa Brown',
    email: 'lisa.brown@farm.com',
    password: 'password123',
    role: 'farmer',
    phone: '+1-555-0104',
    location: 'Fresno, CA',
    bio: 'Fruit orchard owner specializing in apples, oranges, and berries.'
  }
];

// Dummy farms data
const dummyFarms = [
  {
    name: 'Green Valley Farm',
    location: 'Springfield, IL',
    landSize: '50 acres',
    soilType: 'Loamy',
    mapView: 'https://maps.google.com/?q=Springfield,IL',
    description: 'Organic vegetable and fruit farm specializing in tomatoes, lettuce, and berries.',
    establishedYear: 2018
  },
  {
    name: 'Sunny Meadows Dairy',
    location: 'Madison, WI',
    landSize: '100 acres',
    soilType: 'Clay',
    mapView: 'https://maps.google.com/?q=Madison,WI',
    description: 'Dairy farm producing organic milk, cheese, and yogurt products.',
    establishedYear: 2015
  },
  {
    name: 'Golden Fields Farm',
    location: 'Des Moines, IA',
    landSize: '200 acres',
    soilType: 'Silty',
    mapView: 'https://maps.google.com/?q=Des+Moines,IA',
    description: 'Grain farm specializing in corn and wheat cultivation.',
    establishedYear: 2010
  },
  {
    name: 'Orchard Hill Farm',
    location: 'Fresno, CA',
    landSize: '75 acres',
    soilType: 'Sandy',
    mapView: 'https://maps.google.com/?q=Fresno,CA',
    description: 'Fruit orchard producing apples, oranges, and various berries.',
    establishedYear: 2012
  }
];

// Dummy products data
const dummyProducts = [
  // Vegetables
  {
    name: 'Fresh Organic Tomatoes',
    description: 'Sweet and juicy organic tomatoes, perfect for salads and cooking.',
    price: 3.99,
    category: 'vegetables',
    stock: 50,
    unit: 'kg',
    rating: 4.5,
    reviewCount: 12
  },
  {
    name: 'Crisp Lettuce',
    description: 'Fresh, crisp lettuce heads grown without pesticides.',
    price: 2.49,
    category: 'vegetables',
    stock: 30,
    unit: 'piece',
    rating: 4.2,
    reviewCount: 8
  },
  {
    name: 'Organic Carrots',
    description: 'Sweet and crunchy organic carrots, rich in vitamins.',
    price: 1.99,
    category: 'vegetables',
    stock: 40,
    unit: 'kg',
    rating: 4.7,
    reviewCount: 15
  },
  {
    name: 'Fresh Spinach',
    description: 'Nutrient-rich spinach leaves, perfect for salads and smoothies.',
    price: 3.29,
    category: 'vegetables',
    stock: 25,
    unit: 'bundle',
    rating: 4.3,
    reviewCount: 10
  },
  
  // Fruits
  {
    name: 'Sweet Apples',
    description: 'Crisp and sweet apples, perfect for eating fresh or baking.',
    price: 4.99,
    category: 'fruits',
    stock: 60,
    unit: 'kg',
    rating: 4.6,
    reviewCount: 18
  },
  {
    name: 'Fresh Strawberries',
    description: 'Sweet and juicy strawberries, picked at peak ripeness.',
    price: 6.99,
    category: 'fruits',
    stock: 20,
    unit: 'dozen',
    rating: 4.8,
    reviewCount: 22
  },
  {
    name: 'Organic Oranges',
    description: 'Juicy and sweet organic oranges, rich in vitamin C.',
    price: 3.49,
    category: 'fruits',
    stock: 35,
    unit: 'kg',
    rating: 4.4,
    reviewCount: 14
  },
  {
    name: 'Fresh Blueberries',
    description: 'Antioxidant-rich blueberries, perfect for smoothies and baking.',
    price: 8.99,
    category: 'fruits',
    stock: 15,
    unit: 'kg',
    rating: 4.9,
    reviewCount: 25
  },
  
  // Grains
  {
    name: 'Organic Corn',
    description: 'Sweet corn kernels, perfect for cooking and canning.',
    price: 2.99,
    category: 'grains',
    stock: 100,
    unit: 'kg',
    rating: 4.1,
    reviewCount: 6
  },
  {
    name: 'Fresh Wheat',
    description: 'High-quality wheat grains for baking and cooking.',
    price: 1.79,
    category: 'grains',
    stock: 200,
    unit: 'kg',
    rating: 4.0,
    reviewCount: 5
  },
  
  // Dairy
  {
    name: 'Fresh Milk',
    description: 'Pure and fresh whole milk from grass-fed cows.',
    price: 4.49,
    category: 'dairy',
    stock: 40,
    unit: 'piece',
    rating: 4.5,
    reviewCount: 16
  },
  {
    name: 'Organic Cheese',
    description: 'Aged cheddar cheese made from organic milk.',
    price: 7.99,
    category: 'dairy',
    stock: 25,
    unit: 'lb',
    rating: 4.7,
    reviewCount: 20
  },
  {
    name: 'Fresh Yogurt',
    description: 'Creamy and tangy yogurt made from organic milk.',
    price: 3.99,
    category: 'dairy',
    stock: 30,
    unit: 'piece',
    rating: 4.3,
    reviewCount: 11
  },
  
  // Meat
  {
    name: 'Grass-Fed Beef',
    description: 'Premium grass-fed beef, tender and flavorful.',
    price: 12.99,
    category: 'meat',
    stock: 20,
    unit: 'lb',
    rating: 4.8,
    reviewCount: 28
  },
  {
    name: 'Free-Range Chicken',
    description: 'Fresh free-range chicken, raised without antibiotics.',
    price: 8.99,
    category: 'meat',
    stock: 15,
    unit: 'lb',
    rating: 4.6,
    reviewCount: 19
  },
  
  // Other
  {
    name: 'Fresh Eggs',
    description: 'Farm-fresh eggs from free-range chickens.',
    price: 4.99,
    category: 'other',
    stock: 50,
    unit: 'dozen',
    rating: 4.4,
    reviewCount: 13
  },
  {
    name: 'Local Honey',
    description: 'Pure and natural honey from local beehives.',
    price: 9.99,
    category: 'other',
    stock: 20,
    unit: 'lb',
    rating: 4.9,
    reviewCount: 30
  }
];

// Seed function
async function seedData() {
  try {
    console.log('Starting to seed data...');
    
    // Clear existing data
    await User.deleteMany({});
    await Farm.deleteMany({});
    await Crop.deleteMany({});
    await Product.deleteMany({});
    
    console.log('Cleared existing data');
    
    // Create farmers
    const createdFarmers = [];
    for (let i = 0; i < dummyFarmers.length; i++) {
      const farmerData = dummyFarmers[i];
      const hashedPassword = await bcrypt.hash(farmerData.password, 10);
      
      const farmer = new User({
        ...farmerData,
        password: hashedPassword
      });
      
      const savedFarmer = await farmer.save();
      createdFarmers.push(savedFarmer);
      console.log(`Created farmer: ${farmerData.name}`);
    }
    
    // Create farms
    const createdFarms = [];
    for (let i = 0; i < dummyFarms.length; i++) {
      const farmData = dummyFarms[i];
      const farm = new Farm({
        ...farmData,
        farmer: createdFarmers[i]._id
      });
      
      const savedFarm = await farm.save();
      createdFarms.push(savedFarm);
      console.log(`Created farm: ${farmData.name}`);
    }
    
    // Update farmers with their farms
    for (let i = 0; i < createdFarmers.length; i++) {
      createdFarmers[i].farms.push(createdFarms[i]._id);
      await createdFarmers[i].save();
    }

    // Create sample crops for each farm
    const sampleCrops = [
      {
        name: 'Tomatoes',
        variety: 'Roma',
        area: 5,
        unit: 'acres',
        plantingDate: new Date('2024-03-15'),
        expectedHarvestDate: new Date('2024-07-15'),
        estimatedYield: 2000,
        yieldUnit: 'kg',
        notes: 'Organic tomatoes for market sale',
        stage: 'harvested',
        status: 'completed',
        isHarvested: true,
        harvestDate: new Date('2024-07-10'),
        actualYield: 1800
      },
      {
        name: 'Lettuce',
        variety: 'Romaine',
        area: 2,
        unit: 'acres',
        plantingDate: new Date('2024-04-01'),
        expectedHarvestDate: new Date('2024-06-01'),
        estimatedYield: 800,
        yieldUnit: 'kg',
        notes: 'Fresh lettuce for local restaurants',
        stage: 'harvested',
        status: 'completed',
        isHarvested: true,
        harvestDate: new Date('2024-06-05'),
        actualYield: 750
      },
      {
        name: 'Corn',
        variety: 'Sweet',
        area: 10,
        unit: 'acres',
        plantingDate: new Date('2024-05-01'),
        expectedHarvestDate: new Date('2024-09-01'),
        estimatedYield: 5000,
        yieldUnit: 'kg',
        notes: 'Sweet corn for canning and fresh market',
        stage: 'growing'
      },
      {
        name: 'Apples',
        variety: 'Gala',
        area: 8,
        unit: 'acres',
        plantingDate: new Date('2020-03-01'),
        expectedHarvestDate: new Date('2024-09-15'),
        estimatedYield: 12000,
        yieldUnit: 'kg',
        notes: 'Mature apple orchard',
        stage: 'fruiting'
      }
    ];

    const createdCrops = [];
    for (let i = 0; i < createdFarms.length; i++) {
      const cropData = sampleCrops[i];
      const crop = new Crop({
        ...cropData,
        farm: createdFarms[i]._id,
        farmer: createdFarmers[i]._id
      });
      
      const savedCrop = await crop.save();
      createdCrops.push(savedCrop);
      console.log(`Created crop: ${cropData.name} for farm: ${createdFarms[i].name}`);
      
      // Create product from harvested crops
      if (cropData.stage === 'harvested') {
        const product = new Product({
          name: `${cropData.name} - ${cropData.variety}`,
          description: `${cropData.name} variety ${cropData.variety} harvested from ${createdFarms[i].name}`,
          price: 0, // Will be set by farmer later
          category: 'vegetables',
          stock: cropData.actualYield || cropData.estimatedYield || 0,
          unit: cropData.yieldUnit || 'kg',
          farmer: createdFarmers[i]._id,
          farm: createdFarms[i]._id,
          isAvailable: false, // Not published to marketplace yet
          rating: 0,
          reviewCount: 0
        });
        
        await product.save();
        
        // Link the product to the crop
        savedCrop.product = product._id;
        await savedCrop.save();
        
        console.log(`Created product from harvested crop: ${cropData.name}`);
      }
    }
    
    // Create products and assign to farmers
    for (let i = 0; i < dummyProducts.length; i++) {
      const productData = dummyProducts[i];
      const farmerIndex = i % createdFarmers.length; // Distribute products among farmers
      
      const product = new Product({
        ...productData,
        farmer: createdFarmers[farmerIndex]._id,
        farm: createdFarms[farmerIndex]._id
      });
      
      await product.save();
      console.log(`Created product: ${productData.name}`);
    }
    
    // Create a test buyer account
    const buyerPassword = await bcrypt.hash('password123', 10);
    const testBuyer = new User({
      name: 'Test Buyer',
      email: 'buyer@test.com',
      password: buyerPassword,
      role: 'buyer',
      phone: '+1-555-0000',
      location: 'Test City, TS',
      bio: 'Test buyer account for cart testing'
    });
    
    await testBuyer.save();
    console.log('Created test buyer account: buyer@test.com / password123');

    // Create an admin account
    const adminPassword = await bcrypt.hash('123456', 10);
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@gmail.com',
      password: adminPassword,
      role: 'admin',
      phone: '+1-555-9999',
      location: 'Admin City, AC',
      bio: 'Administrator account'
    });
    await adminUser.save();
    console.log('Created admin account: admin@gmail.com / 123456');
    
    console.log('Data seeding completed successfully!');
    console.log('\nTest Accounts:');
    console.log('Buyer: buyer@test.com / password123');
    console.log('Farmers:');
    dummyFarmers.forEach((farmer, index) => {
      console.log(`${farmer.name}: ${farmer.email} / password123`);
    });
    
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the seed function
seedData(); 