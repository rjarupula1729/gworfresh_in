# 📖 GrowFresh - Complete Project Documentation

**Version:** 1.0.0  
**Created:** April 2026  
**Status:** Production Ready for Android Deployment  

---

## 📋 TABLE OF CONTENTS

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Frontend Architecture](#frontend-architecture)
5. [Backend Architecture](#backend-architecture)
6. [Database Schema](#database-schema)
7. [API Endpoints](#api-endpoints)
8. [Features Implemented](#features-implemented)
9. [Setup & Installation](#setup--installation)
10. [Build & Deployment](#build--deployment)
11. [Key Files & Purpose](#key-files--purpose)
12. [Development Guidelines](#development-guidelines)

---

## PROJECT OVERVIEW

### What is GrowFresh?

GrowFresh is a comprehensive **agricultural e-commerce mobile application** built with React Native and Expo, designed to help users:
- Browse and purchase agricultural products
- Track their home gardens and plants
- Book agricultural instructors
- Connect with the farming community
- Get location-based product recommendations

### Target Users
- Home gardeners
- Small-scale farmers
- Agricultural enthusiasts
- People wanting to grow vegetables at home

### Key Business Goals
1. Enable easy access to quality agricultural products
2. Provide expert guidance through instructor bookings
3. Build a community of farmers and gardeners
4. Offer personalized recommendations based on location and season
5. Simplify the agricultural marketplace

### Application Type
- **Platform:** Android (iOS compatible)
- **Category:** E-Commerce + Community
- **Deployment:** Direct APK installation or Expo Go
- **Target Android Version:** 8.0+ (API 26+)

---

## TECHNOLOGY STACK

### Frontend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| React Native | Latest | Mobile app framework |
| Expo | 50+ | React Native development platform |
| React Navigation | 6.x | In-app navigation & routing |
| Context API | React | Global state management |
| Axios | 1.3.4 | HTTP client for API calls |
| AsyncStorage | Expo | Local data persistence |
| React Native Elements | - | UI components library |

### Backend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18.x | JavaScript runtime |
| Express.js | 4.18.2 | REST API framework |
| MongoDB | 7.0+ | Document database |
| Mongoose | 7.0.0 | MongoDB object modeling |
| JWT | 9.0.0 | Authentication tokens |
| bcryptjs | 2.4.3 | Password encryption |
| CORS | 2.8.5 | Cross-origin requests |
| dotenv | 16.0.3 | Environment variables |

### Development Tools
- Git & GitHub
- npm (package manager)
- Nodemon (auto-restart on file changes)
- Axios (API testing)
- EAS Build (Expo Android build service)

---

## PROJECT STRUCTURE

```
gworfresh_in/                                    # Root Directory
│
├── 📱 FRONTEND (React Native + Expo)
│   ├── src/                                    # Main source directory
│   │   ├── App.js                             # Root component
│   │   ├── app.json                           # Expo configuration (Android: com.growfresh.app)
│   │   │
│   │   ├── screens/                           # 8 Screen Components
│   │   │   ├── HomeScreen.js                  # Landing page, featured products
│   │   │   ├── ShopScreen.js                  # Product listing, search, filter
│   │   │   ├── CartScreen.js                  # Shopping cart management
│   │   │   ├── LoginScreen.js                 # User authentication (OTP-based)
│   │   │   ├── GardenScreen.js                # Home garden tracking
│   │   │   ├── PlantTrackingScreen.js         # Individual plant care tracking
│   │   │   ├── InstructorBookingScreen.js     # Book agriculture experts
│   │   │   ├── CommunityForumScreen.js        # Community discussions
│   │   │   └── OrderTrackingScreen.js         # Order status tracking
│   │   │
│   │   ├── navigation/
│   │   │   └── AppNavigator.js                # React Navigation setup (6-tab bottom navigator)
│   │   │
│   │   ├── context/
│   │   │   └── AppContext.js                  # Global state management
│   │   │                                       # Manages: user, cart, products, orders
│   │   │
│   │   ├── services/
│   │   │   └── api.js                         # API communication layer
│   │   │                                       # Axios instance with JWT interceptors
│   │   │
│   │   ├── utils/
│   │   │   ├── colors.js                      # App color scheme
│   │   │   └── storage.js                     # AsyncStorage helper functions
│   │   │
│   │   └── assets/                            # Images, icons, splash screen
│   │       ├── icon.png                       # App icon
│   │       ├── splash.png                     # Splash screen
│   │       └── adaptive-icon.png              # Android adaptive icon
│   │
│   └── package.json                           # Frontend dependencies
│
│
├── 🔧 BACKEND (Node.js + Express + MongoDB)
│   ├── server.js                              # Express app entry point
│   │
│   ├── config/
│   │   └── db.js                              # MongoDB connection configuration
│   │
│   ├── middleware/
│   │   └── auth.js                            # JWT verification middleware
│   │
│   ├── models/                                # Mongoose schemas (Database structure)
│   │   ├── User.js                            # User account schema
│   │   ├── Product.js                         # Product catalog schema
│   │   ├── Order.js                           # Order schema
│   │   ├── Plant.js                           # Plant types schema
│   │   ├── PlantTracking.js                   # User's plant tracking data
│   │   ├── InstructorBooking.js               # Instructor booking schema
│   │   ├── CommunityPost.js                   # Community forum posts
│   │   └── ProductUpdated.js                  # Product updates/variants
│   │
│   ├── routes/                                # API endpoints (22 route files)
│   │   ├── auth.js                            # Login, registration, OTP verification
│   │   ├── products.js                        # Product CRUD operations
│   │   ├── cart.js                            # Cart management
│   │   ├── orders.js                          # Order placement & tracking
│   │   ├── garden.js                          # Garden management
│   │   ├── instructors.js                     # Instructor bookings
│   │   ├── community.js                       # Community posts
│   │   └── geolocationWithJSON.js             # 11 geolocation API endpoints
│   │
│   ├── data/                                  # Static data & seeding
│   │   ├── productImages.js                   # 40+ Unsplash image URLs
│   │   ├── seedProducts.js                    # Database initialization script
│   │   ├── geolocationData.json               # Regional data (5 regions, 22 states, 65+ vegetables)
│   │   └── stateToRegionMapping.js            # Geographic mapping
│   │
│   ├── utils/
│   │   └── loadGeolocationData.js             # Geolocation data loader
│   │
│   ├── package.json                           # Backend dependencies
│   ├── .env                                   # Environment variables (LOCAL - DO NOT COMMIT)
│   ├── .env.example                           # Template for environment setup
│   │
│   └── routes/                                # 22 API endpoint files total
│
│
├── ⚙️ BUILD & DEPLOYMENT
│   ├── eas.json                               # Expo EAS Build configuration
│   ├── BUILD_ANDROID.sh                       # Interactive build automation script
│   ├── QUICK_COMMANDS.sh                      # Quick reference commands
│   │
│   ├── ANDROID_BUILD_GUIDE.md                 # Complete Android build guide
│   ├── ANDROID_BUILD_READY.md                 # Build checklist & reference
│   ├── VISUAL_ANDROID_BUILD.md                # Step-by-step walkthrough
│   │
│   ├── README.md                              # Quick start guide
│   ├── setup.sh                               # Initial setup script
│   ├── start.sh                               # App startup script
│   │
│   └── .gitignore                             # Git ignore patterns
│
│
├── 📚 DOCUMENTATION
│   ├── GEOLOCATION_COMPLETE_SUMMARY.txt       # Geolocation system details
│   ├── PROJECT_ARCHITECTURE.md                # System architecture
│   └── API_DOCUMENTATION.md                   # API reference
│
│
└── .git/                                      # Git repository (GitHub)
    └── Commits: 20+ production commits
```

---

## FRONTEND ARCHITECTURE

### 1. **App Entry Point** (`App.js`)
```
App.js (Root Component)
├── AppProvider (Context wrapper for global state)
└── AppNavigator (Bottom tab navigation with 6 screens)
```

### 2. **Navigation Structure** (`navigation/AppNavigator.js`)

**Bottom Tab Navigator (6 Active Tabs):**

| Tab | Screen | Purpose |
|-----|--------|---------|
| 🏠 Home | HomeScreen | Featured products, announcements, quick actions |
| 🛍️ Shop | ShopScreen | Browse all products, search, filter, geolocation |
| 🛒 Cart | CartScreen | View & manage shopping cart items |
| 👤 Login | LoginScreen | User authentication (OTP-based) |
| 🌿 Garden | GardenScreen | Home garden tracking & plant management |
| 👨‍🏫 Instructors | InstructorBookingScreen | Book agricultural experts |

**Additional Screens:**
- PlantTrackingScreen (detailed plant care)
- CommunityForumScreen (community discussions)
- OrderTrackingScreen (order status)

### 3. **State Management** (`context/AppContext.js`)

Global state managed via Context API:
```javascript
{
  user: { id, name, email, phone, location, state },
  products: [ ... ],
  cart: [ ... ],
  orders: [ ... ],
  plants: [ ... ],
  isAuthenticated: boolean,
  userLocation: { latitude, longitude },
  recommendedProducts: [ ... ]
}
```

Actions:
- `setUser()` - Update user info
- `addToCart()` - Add product to cart
- `removeFromCart()` - Remove from cart
- `placeOrder()` - Create new order
- `addPlant()` - Add plant to tracking
- `updateLocation()` - Update user location

### 4. **API Communication** (`services/api.js`)

Axios instance with:
- **Base URL:** `http://10.0.2.2:5000/api` (configurable)
- **JWT Interceptors:** Automatically attach auth token to requests
- **Error Handling:** Centralized error management
- **Request/Response Transformation:** Format conversion

```javascript
// Example API calls
api.get('/products') // Get all products
api.post('/auth/login', { phone }) // Login
api.post('/cart/add', { productId, quantity }) // Add to cart
api.get('/orders') // Get user orders
api.post('/garden/add-plant', { plantData }) // Add plant
```

### 5. **Screen Components Overview**

**HomeScreen:**
- Featured products carousel
- Category quick navigation
- Promotional banners
- Quick shop button

**ShopScreen:**
- Product grid/list view (40+ products with images)
- Search functionality
- Category filter
- Price range filter
- Location-based geolocation filter
- Sort options (price, rating, newest)

**CartScreen:**
- List all cart items
- Quantity adjustment
- Price calculation (subtotal, tax, shipping)
- Coupon code input
- Checkout button

**LoginScreen:**
- Phone number input
- OTP verification
- User registration
- Profile setup

**GardenScreen:**
- Add plants to personal garden
- Track growing plants
- Set reminders
- View plant care tips

**PlantTrackingScreen:**
- Individual plant details
- Growth timeline
- Care checklist
- Watering schedule
- Health status

**InstructorBookingScreen:**
- Browse available instructors
- View expertise & ratings
- Book appointment
- Check booking status

**CommunityForumScreen:**
- View community posts
- Create new posts
- Like/comment on posts
- Discussion threads

**OrderTrackingScreen:**
- View all past orders
- Track order status
- Estimated delivery dates
- Order history

### 6. **Utilities**

**colors.js:**
- App color palette
- Theme colors (primary, secondary, success, danger, warning)
- Consistent styling across app

**storage.js:**
- AsyncStorage wrapper functions
- `saveUser()`, `getUser()`, `clearUser()`
- `saveCart()`, `getCart()`, `clearCart()`
- Local data persistence

---

## BACKEND ARCHITECTURE

### 1. **Server Entry Point** (`server.js`)

```javascript
Express application with:
- MongoDB connection
- CORS enabled
- JSON body parser
- 7 main API route groups (22 total endpoint files)
- Port: 5000 (configurable via .env)
```

### 2. **Database Configuration** (`config/db.js`)

```javascript
MongoDB Connection:
- Mongoose ODM
- Connection retry logic
- Error handling
- URL from environment variable
```

### 3. **API Routes Structure** (22 endpoint files)

| Route | File | Endpoints | Purpose |
|-------|------|-----------|---------|
| `/api/auth` | `routes/auth.js` | 5 | Login, register, OTP, verify |
| `/api/products` | `routes/products.js` | 8 | CRUD products, filtering, search |
| `/api/cart` | `routes/cart.js` | 4 | Add, remove, update cart items |
| `/api/orders` | `routes/orders.js` | 6 | Create, get, update orders |
| `/api/garden` | `routes/garden.js` | 5 | Manage user gardens |
| `/api/instructors` | `routes/instructors.js` | 4 | List, book, manage instructors |
| `/api/community` | `routes/community.js` | 5 | Create, get, comment posts |
| `/api/geolocation` | `routes/geolocationWithJSON.js` | **11** | Regional & seasonal recommendations |

**Total: 48 API Endpoints**

### 4. **Data Models** (8 Mongoose schemas)

#### User Schema
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String (unique, required),
  password: String (bcrypt hashed),
  location: { latitude, longitude },
  state: String,
  address: String,
  createdAt: Date,
  updatedAt: Date,
  points: Number, // Reward points
  isVerified: Boolean
}
```

#### Product Schema
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  category: String,
  price: Number,
  image: String (Unsplash CDN URL),
  rating: Number,
  reviews: [ { user, comment, rating, date } ],
  inStock: Boolean,
  quantity: Number,
  season: String,
  suitableRegions: [ String ],
  createdAt: Date,
  updatedAt: Date
}
```

#### Order Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  items: [ { productId, quantity, price } ],
  totalAmount: Number,
  status: String (pending, processing, shipped, delivered),
  shippingAddress: String,
  paymentMethod: String,
  createdAt: Date,
  updatedAt: Date,
  estimatedDelivery: Date
}
```

#### PlantTracking Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  plantType: String,
  dateAdded: Date,
  location: String,
  wateringSchedule: String,
  healthStatus: String,
  growthProgress: Number (0-100),
  notes: [ String ],
  images: [ String ],
  updatedAt: Date
}
```

#### Plant Schema
```javascript
{
  _id: ObjectId,
  name: String,
  scientificName: String,
  description: String,
  careInstructions: String,
  wateringFrequency: String,
  sunlight: String,
  season: String,
  suitableRegions: [ String ],
  growthTime: String,
  yield: String
}
```

#### CommunityPost Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  title: String,
  content: String,
  category: String,
  likes: Number,
  comments: [ { userId, text, date } ],
  createdAt: Date,
  updatedAt: Date,
  tags: [ String ]
}
```

#### InstructorBooking Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  instructorId: ObjectId,
  date: Date,
  time: String,
  topic: String,
  status: String (scheduled, completed, cancelled),
  notes: String,
  createdAt: Date
}
```

#### ProductUpdated Schema
```javascript
{
  _id: ObjectId,
  productId: ObjectId (ref: Product),
  variant: String,
  price: Number,
  stock: Number,
  specifications: Object,
  updatedAt: Date
}
```

### 5. **Authentication Middleware** (`middleware/auth.js`)

```javascript
JWT Verification:
- Extracts token from Authorization header
- Verifies signature using JWT_SECRET
- Attaches user info to request
- Returns 401 if token invalid/expired
- Used on protected routes
```

### 6. **Geolocation System** (Complete Feature)

**5 Climate Zones:**
- North
- South
- East
- West
- Central

**22 States Mapped:**
- Distributed across 5 zones
- Each state linked to climate & season

**65+ Vegetables Tracked:**
- Each vegetable has:
  - Seasonal availability (Winter, Summer, Monsoon, Year-round)
  - Regional suitability (0-100 score)
  - Care instructions
  - Yield information

**11 Geolocation API Endpoints:**
1. `GET /geolocation/states` - List all states
2. `GET /geolocation/zones` - List climate zones
3. `GET /geolocation/state/:stateName` - Get state details
4. `GET /geolocation/products-by-state` - Products suitable for state
5. `GET /geolocation/seasonal-products` - Products for current season
6. `GET /geolocation/region/:regionName` - Get region details
7. `GET /geolocation/vegetables-by-region` - Vegetables for region
8. `GET /geolocation/recommendations` - Personalized recommendations
9. `POST /geolocation/set-user-location` - Save user location
10. `GET /geolocation/nearby-products` - Nearby product recommendations
11. `GET /geolocation/farming-tips/:state` - State-specific farming tips

### 7. **Product Images** (40+ Products with Unsplash URLs)

Products include:
- Vegetables: Tomato, Carrot, Broccoli, Spinach, Lettuce, Potato, Onion, Garlic, Bell Pepper, Cucumber, etc.
- Fruits: Apple, Mango, Banana, Orange, Strawberry, Blueberry, Grape, Watermelon, etc.
- Seeds & Tools: Hybrid seeds, organic fertilizer, garden tools, etc.

All images from **Unsplash CDN** (free, open-source, high-quality)

---

## DATABASE SCHEMA

### MongoDB Collections (8 total)

| Collection | Records | Purpose | Indexed Fields |
|------------|---------|---------|-----------------|
| users | 50-1000+ | User accounts | phone (unique), email |
| products | 40+ | Product catalog | category, price, name |
| orders | 100-10000+ | Purchase orders | userId, status, date |
| planttrackings | 100-10000+ | User plant data | userId, plantType |
| plants | 65+ | Plant types | name, season, region |
| communityposts | 100-10000+ | Forum posts | userId, category, date |
| instructorbookings | 100-1000+ | Booking data | userId, instructorId, date |
| productupdateds | 50+ | Product variants | productId, variant |

### Relationships
- User → Orders (1:N)
- User → PlantTracking (1:N)
- User → CommunityPosts (1:N)
- User → InstructorBookings (1:N)
- Product → Orders (through Order.items)
- Product → ProductUpdated (1:N)
- Instructor → Bookings (1:N)

---

## API ENDPOINTS

### Authentication Endpoints (5)
```
POST   /api/auth/send-otp              - Send OTP to phone
POST   /api/auth/verify-otp            - Verify OTP
POST   /api/auth/register              - Register new user
POST   /api/auth/login                 - Login user
GET    /api/auth/profile               - Get user profile
```

### Product Endpoints (8)
```
GET    /api/products                   - Get all products
GET    /api/products/:id               - Get product details
POST   /api/products                   - Create product (admin)
PUT    /api/products/:id               - Update product (admin)
DELETE /api/products/:id               - Delete product (admin)
GET    /api/products/search            - Search products
GET    /api/products/category/:cat     - Get by category
GET    /api/products/featured          - Get featured products
```

### Cart Endpoints (4)
```
POST   /api/cart/add                   - Add item to cart
GET    /api/cart                       - Get cart items
PUT    /api/cart/update                - Update cart item qty
DELETE /api/cart/remove/:id            - Remove from cart
```

### Order Endpoints (6)
```
POST   /api/orders                     - Place new order
GET    /api/orders                     - Get user orders
GET    /api/orders/:id                 - Get order details
PUT    /api/orders/:id/status          - Update order status
GET    /api/orders/tracking/:id        - Track order
DELETE /api/orders/:id                 - Cancel order
```

### Garden Endpoints (5)
```
POST   /api/garden/add-plant           - Add plant to garden
GET    /api/garden/my-plants           - Get user's plants
PUT    /api/garden/update/:id          - Update plant info
DELETE /api/garden/remove/:id          - Remove plant
GET    /api/garden/tips                - Get care tips
```

### Instructor Endpoints (4)
```
GET    /api/instructors                - List all instructors
GET    /api/instructors/:id            - Get instructor profile
POST   /api/instructors/book           - Book instructor
GET    /api/instructors/bookings       - Get user's bookings
```

### Community Endpoints (5)
```
POST   /api/community/post             - Create new post
GET    /api/community/posts            - Get all posts
GET    /api/community/posts/:id        - Get post details
POST   /api/community/comment/:id      - Add comment
DELETE /api/community/posts/:id        - Delete post
```

### Geolocation Endpoints (11)
```
GET    /api/geolocation/states         - List states
GET    /api/geolocation/zones          - List climate zones
GET    /api/geolocation/state/:name    - Get state details
GET    /api/geolocation/region/:name   - Get region details
GET    /api/geolocation/vegetables/:region - Vegetables in region
GET    /api/geolocation/products-by-state - Products for state
GET    /api/geolocation/seasonal       - Seasonal products
POST   /api/geolocation/recommendations - Personalized recommendations
POST   /api/geolocation/set-location   - Save user location
GET    /api/geolocation/nearby         - Nearby recommendations
GET    /api/geolocation/tips/:state    - Farming tips
```

**Total: 48 API Endpoints**

---

## FEATURES IMPLEMENTED

### ✅ Core Features

#### 1. **User Authentication**
- Phone number-based registration
- OTP verification (demo: "1234")
- JWT token-based authentication
- Token stored in AsyncStorage
- 30-day token expiry
- Auto-login on app restart
- User profile management

#### 2. **Product Catalog**
- 40+ products with images
- Product search functionality
- Category filtering
- Price range filtering
- Rating & reviews system
- Product details page
- Stock availability tracking
- Product recommendations

#### 3. **Shopping Cart**
- Add/remove items
- Quantity adjustment
- Price calculation
- Tax computation
- Shipping fee
- Coupon code support
- Cart persistence (localStorage)
- Checkout process

#### 4. **Order Management**
- Order placement
- Order status tracking
- Order history
- Estimated delivery dates
- Order cancellation
- Email notifications
- Receipt generation

#### 5. **Geolocation System**
- 5 climate zones (North, South, East, West, Central)
- 22 states mapped
- 65+ vegetables tracked
- Seasonal recommendations
- Regional suitability scoring
- Location-based product filtering
- Personalized recommendations
- Farming tips by region

#### 6. **Plant Tracking**
- Add plants to personal garden
- Track growth progress
- Set watering schedules
- Health status monitoring
- Photo documentation
- Care reminders
- Growth timeline

#### 7. **Instructor Booking**
- Browse available instructors
- View expertise & ratings
- Book consultations
- Schedule management
- Booking confirmation
- Payment integration ready

#### 8. **Community Forum**
- Create forum posts
- Browse community discussions
- Like & comment on posts
- User profiles in forum
- Post categorization
- Search within community
- Moderation capabilities

#### 9. **User Rewards**
- Reward points system
- Points on purchases
- Redeem points for discounts
- Leaderboard system
- Referral rewards

#### 10. **Push Notifications**
- Order status updates
- Delivery notifications
- Community mentions
- Booking confirmations
- Promotional announcements

---

## SETUP & INSTALLATION

### Prerequisites
```bash
✓ Node.js v14+ installed
✓ npm installed
✓ MongoDB (local or MongoDB Atlas)
✓ Git installed
✓ Free Expo account (https://expo.dev)
```

### Frontend Setup (React Native + Expo)

**Step 1: Install Expo CLI**
```bash
npm install -g expo-cli
```

**Step 2: Install Frontend Dependencies**
```bash
cd ~/Documents/gworfresh_in/src
npm install
```

**Step 3: Update API URL** (if using custom backend)
```bash
# Edit: src/services/api.js
const API_BASE_URL = 'http://10.0.2.2:5000/api'; // Or your backend URL
```

**Step 4: Run Frontend (Local Testing)**
```bash
cd ~/Documents/gworfresh_in/src
expo start
```

Then:
- Scan QR code with Expo Go app (free from Play Store)
- App appears on your phone instantly!

### Backend Setup (Node.js + Express + MongoDB)

**Step 1: Install Backend Dependencies**
```bash
cd ~/Documents/gworfresh_in/backend
npm install
```

**Step 2: Configure Environment**
```bash
# Create .env file
cp .env.example .env

# Edit .env with your values:
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/growfresh
JWT_SECRET=your_secret_key_12345
JWT_EXPIRE=30d
```

**Step 3: Start Backend Server**
```bash
# Development mode (auto-restart on changes)
npm run dev

# OR Production mode
npm start
```

Backend will be available at: `http://localhost:5000`

**Step 4: Seed Database (Optional)**
```bash
# Run seed script to populate products
node backend/data/seedProducts.js
```

---

## BUILD & DEPLOYMENT

### Three Ways to Deploy

#### **Option 1: Cloud Build (Recommended - 15-30 min)**

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build APK
cd ~/Documents/gworfresh_in
eas build --platform android

# Follow prompts, get email with download link
# Download APK and install on phone
```

**Pros:** No local Android SDK needed, most reliable, can share APK easily  
**Cons:** Requires Expo account, internet-dependent

#### **Option 2: Local Build (30-60 min)**

```bash
npm install -g eas-cli
eas login
eas build --platform android --local

# Requires Android SDK installation
# APK created in current directory
```

**Pros:** Full control, offline capability  
**Cons:** Requires Android SDK, longer setup

#### **Option 3: Expo Go (2 min - Fastest)**

```bash
npm install -g expo-cli
cd ~/Documents/gworfresh_in/src
expo start

# Scan QR with Expo Go app on phone
```

**Pros:** Instant, no build needed, hot reload  
**Cons:** Requires Expo Go app on phone, slower for production

### APK Configuration

**App Details:**
- **Package Name:** `com.growfresh.app`
- **App Name:** GrowFresh
- **Version:** 1.0.0
- **Min Android:** 8.0 (API 26)
- **Target Android:** 14+
- **File Size:** ~50-100 MB

**Permissions:**
- INTERNET (API calls)
- ACCESS_FINE_LOCATION (geolocation)
- ACCESS_COARSE_LOCATION (geolocation)
- CAMERA (profile photos)
- STORAGE (image upload)

---

## KEY FILES & PURPOSE

### Critical Configuration Files

| File | Purpose | Edit? |
|------|---------|-------|
| `src/app.json` | Expo app config, Android settings | ✏️ Update version |
| `eas.json` | EAS Build configuration | ✏️ If adding new build profiles |
| `src/services/api.js` | API base URL, interceptors | ✏️ Update API URL |
| `backend/.env` | Database, server secrets | ✏️ Your credentials (never commit) |
| `backend/.env.example` | Template for .env | ℹ️ Reference only |

### Important Data Files

| File | Purpose | Records |
|------|---------|---------|
| `backend/data/productImages.js` | Product image URLs | 40+ |
| `backend/data/seedProducts.js` | Database seeding script | - |
| `backend/data/geolocationData.json` | Regional & seasonal data | 22 states, 65+ vegetables |

### Route Files (22 total)

**Frontend:**
- `src/screens/` - 8 screen components
- `src/navigation/AppNavigator.js` - Navigation setup
- `src/context/AppContext.js` - Global state

**Backend:**
- `backend/routes/` - 22 API route files
- `backend/models/` - 8 Mongoose schemas
- `backend/middleware/auth.js` - JWT verification
- `backend/config/db.js` - Database connection

---

## DEVELOPMENT GUIDELINES

### Adding New Features

#### **To Add a New Screen:**

1. Create file: `src/screens/NewScreen.js`
2. Add to navigator: `src/navigation/AppNavigator.js`
3. Create API calls in: `src/services/api.js`
4. Update global state if needed: `src/context/AppContext.js`
5. Test with: `expo start`

#### **To Add a New API Endpoint:**

1. Create/update route file: `backend/routes/feature.js`
2. Add route to: `backend/server.js`
3. Create model if needed: `backend/models/Feature.js`
4. Add to API client: `src/services/api.js`
5. Test with Postman or Axios
6. Update frontend to use endpoint

#### **To Add a New Database Field:**

1. Update Mongoose schema: `backend/models/Feature.js`
2. Create migration (optional): Add script to update existing records
3. Update API endpoints to handle new field
4. Update frontend forms/display
5. Test with new and existing data

### Code Structure Best Practices

**Frontend:**
- Keep screens simple, move logic to context
- Use meaningful variable names
- Add comments for complex logic
- Test navigation between screens
- Handle loading & error states
- Persist important data to AsyncStorage

**Backend:**
- Use async/await for promises
- Validate all input data
- Implement error handling
- Use middleware for cross-cutting concerns
- Keep route handlers thin (logic in models)
- Add request logging
- Document API changes

### Testing Checklist

- [ ] All screens load without errors
- [ ] Navigation works between screens
- [ ] Login/OTP flow completes
- [ ] Products display with images
- [ ] Cart add/remove works
- [ ] Checkout completes
- [ ] Orders saved to database
- [ ] Geolocation filtering works
- [ ] Plant tracking saves data
- [ ] Community posts create
- [ ] Instructor booking completes
- [ ] All forms validate input
- [ ] Error messages display properly
- [ ] Loading states show
- [ ] Back buttons work
- [ ] Deep links work (if implemented)

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
git add .
git commit -m "feat: Add new feature description"

# Push to GitHub
git push origin feature/new-feature

# Create pull request on GitHub
# After review, merge to main

# Deploy
eas build --platform android
```

### Environment Variables

**Frontend (in app.json):**
```json
{
  "extra": {
    "apiUrl": "http://10.0.2.2:5000/api"
  }
}
```

**Backend (.env):**
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/growfresh
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=30d
```

---

## COMMON TASKS

### Update App Version
```bash
# In src/app.json
"version": "1.0.1"

# In backend/package.json
"version": "1.0.1"

# Rebuild APK
eas build --platform android
```

### Add New Product
```bash
# Method 1: Via MongoDB Compass
# Connect to database, add to products collection

# Method 2: Via API
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Product Name",
    "price": 100,
    "image": "url",
    "category": "vegetables"
  }'
```

### Add New State/Region
```bash
# Edit: backend/data/geolocationData.json
# Add state to regions array
# Run geolocation endpoint: GET /api/geolocation/vegetables/:region
```

### Deploy New Version
```bash
# Make changes
git add .
git commit -m "feat: Description"
git push origin main

# Build new APK
eas build --platform android

# Users get update (OTA or new APK)
```

---

## TROUBLESHOOTING

### Frontend Issues

**Problem:** "Cannot find module"
```bash
Solution: npm install && expo start
```

**Problem:** "API not responding"
```bash
Check: Backend running on localhost:5000
Check: API URL in src/services/api.js
Check: Network connectivity
```

**Problem:** "Login OTP not working"
```bash
Default OTP: 1234
Check: Backend auth route
Verify: .env MONGODB_URI correct
```

### Backend Issues

**Problem:** "MongoDB connection failed"
```bash
Check: .env MONGODB_URI is correct
Check: Firewall allows MongoDB port
Check: Internet connection
```

**Problem:** "Port 5000 already in use"
```bash
Kill: lsof -ti:5000 | xargs kill -9
Or change PORT in .env
```

**Problem:** "JWT token expired"
```bash
Clear: AsyncStorage on app
Re-login: User must login again
Update: JWT_EXPIRE in .env if needed
```

### Deployment Issues

**Problem:** "Build failed in EAS"
```bash
Check: Node.js version 18+
Check: All dependencies installed
Check: Code has no syntax errors
Check: app.json is valid
```

**Problem:** "APK won't install"
```bash
Enable: Settings → Unknown sources
Uninstall: Previous version first
Check: Android version 8.0+
Check: 100 MB free space
```

---

## FUTURE ENHANCEMENTS

### Planned Features (Phase 2)

1. **Payment Integration**
   - Razorpay/Stripe integration
   - Multiple payment methods
   - Subscription plans

2. **Advanced Analytics**
   - User behavior tracking
   - Sales analytics
   - Growth metrics

3. **AI Recommendations**
   - ML-based product suggestions
   - Smart crop recommendations
   - Predictive analytics

4. **Video Content**
   - Tutorial videos
   - Expert interviews
   - How-to guides

5. **Mobile Optimization**
   - Offline mode
   - Progressive Web App
   - Performance optimization

6. **Marketplace**
   - Farmer marketplace
   - Direct-to-consumer sales
   - Auction system

---

## SUPPORT & RESOURCES

### Documentation
- 📖 [README.md](./README.md) - Quick start
- 📱 [ANDROID_BUILD_GUIDE.md](./ANDROID_BUILD_GUIDE.md) - Detailed build guide
- 🎬 [VISUAL_ANDROID_BUILD.md](./VISUAL_ANDROID_BUILD.md) - Step-by-step walkthrough
- 📋 [ANDROID_BUILD_READY.md](./ANDROID_BUILD_READY.md) - Checklist & reference

### External Resources
- Expo Docs: https://docs.expo.dev
- React Native: https://reactnative.dev
- Express.js: https://expressjs.com
- MongoDB: https://docs.mongodb.com
- EAS Build: https://docs.expo.dev/build/setup/

### GitHub Repository
https://github.com/rjarupula1729/gworfresh_in

---

## CONTACT & SUPPORT

For issues or questions:
1. Check documentation files
2. Review GitHub issues
3. Check code comments
4. Consult team members

---

## PROJECT METADATA

| Property | Value |
|----------|-------|
| **Project Name** | GrowFresh |
| **Version** | 1.0.0 |
| **Status** | Production Ready |
| **Platform** | Android (React Native) |
| **Build Date** | April 2026 |
| **Last Updated** | April 28, 2026 |
| **GitHub Repo** | https://github.com/rjarupula1729/gworfresh_in |
| **Main Branch** | main |
| **Latest Commit** | fe95309 |
| **Contributors** | Development Team |
| **License** | ISC |
| **Deployment** | Expo EAS Build |

---

## CONCLUSION

GrowFresh is a comprehensive agricultural e-commerce platform built with modern technologies (React Native, Node.js, MongoDB). The app includes:

✅ **Complete frontend** with 8 screens  
✅ **Powerful backend** with 48 API endpoints  
✅ **Rich database** with 8 collections  
✅ **Geolocation system** for personalized recommendations  
✅ **Production-ready** APK builds  
✅ **Comprehensive documentation** for team onboarding  

The application is ready for:
- Direct Android deployment via APK
- User testing and feedback
- Feature enhancements
- Team handoff to other developers

---

**Document Version:** 1.0  
**Last Updated:** April 28, 2026  
**For Questions:** Review documentation files or contact team members
