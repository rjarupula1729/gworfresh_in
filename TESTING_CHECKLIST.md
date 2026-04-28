# ✅ Complete Testing Checklist - GrowFresh

**Your step-by-step guide to test all 8 screens and verify functionality**

---

## 🚀 Pre-Testing Setup

Before starting tests, ensure:

```bash
# 1. Backend running
npm start
# Should see: Server running on port 5000

# 2. MongoDB connected
# Check MongoDB Atlas for "growfresh" database

# 3. Frontend running
expo start
# Choose platform (a = Android, i = iOS, w = web)

# 4. Demo Credentials Ready
Mobile: Any 10-digit number (e.g., 9876543210)
OTP: 1234
```

---

## 📱 Screen-by-Screen Testing

### Screen 1: LOGIN SCREEN ✅

**File**: `src/screens/LoginScreen.js`  
**API**: `POST /auth/verify-otp`

#### Test Cases:

- [ ] **Test 1.1**: Open app and see login screen
  - Expected: "Grow Fresh" title, mobile input field visible
  - Status: ⏳ Pending

- [ ] **Test 1.2**: Enter invalid mobile (less than 10 digits)
  - Input: "12345"
  - Expected: Error message "Please enter a valid 10-digit mobile number"
  - Status: ⏳ Pending

- [ ] **Test 1.3**: Enter valid mobile number
  - Input: "9876543210"
  - Expected: "Request OTP" button shows loading, then moves to step 2
  - Status: ⏳ Pending

- [ ] **Test 1.4**: Verify OTP timer
  - Expected: 60-second countdown starts in step 2
  - Status: ⏳ Pending

- [ ] **Test 1.5**: Enter wrong OTP first
  - Input: "0000"
  - Expected: Error message "Invalid OTP. Please try again"
  - Status: ⏳ Pending

- [ ] **Test 1.6**: Enter correct OTP
  - Input: "1234"
  - Expected: Loading state, then redirects to Home screen
  - Status: ⏳ Pending

- [ ] **Test 1.7**: Verify token is stored
  - Expected: Close and reopen app → Still logged in (no login screen)
  - Status: ⏳ Pending

- [ ] **Test 1.8**: Logout from Home
  - Expected: Clears token, returns to login screen
  - Status: ⏳ Pending

---

### Screen 2: HOME SCREEN ✅

**File**: `src/screens/HomeScreen.js`  
**APIs**: `GET /products`, `GET /products/categories/list`

#### Test Cases:

- [ ] **Test 2.1**: Home screen displays after login
  - Expected: "Welcome, [User Name]" banner visible
  - Status: ⏳ Pending

- [ ] **Test 2.2**: User statistics display
  - Expected: Cards show "Orders", "Rewards", "Plants" with counts
  - Status: ⏳ Pending

- [ ] **Test 2.3**: Quick action cards visible
  - Expected: "My Orders", "My Garden", "Community", "Experts" cards
  - Status: ⏳ Pending

- [ ] **Test 2.4**: Categories grid loads
  - Expected: At least 4-6 categories display (Seeds, Saplings, Soil, Fertilizer, etc.)
  - Status: ⏳ Pending

- [ ] **Test 2.5**: Featured products display
  - Expected: 6 featured product cards in carousel
  - Status: ⏳ Pending

- [ ] **Test 2.6**: Click on category
  - Action: Tap "Seeds" category
  - Expected: Navigates to Shop and filters by Seeds
  - Status: ⏳ Pending

- [ ] **Test 2.7**: Click on featured product
  - Action: Tap any featured product
  - Expected: Product details modal appears
  - Status: ⏳ Pending

- [ ] **Test 2.8**: Pull to refresh
  - Action: Pull down on screen
  - Expected: Data refreshes, loading indicator shows
  - Status: ⏳ Pending

- [ ] **Test 2.9**: Daily tips display
  - Expected: Gardening tip card shows with content
  - Status: ⏳ Pending

- [ ] **Test 2.10**: Logout button works
  - Action: Click menu → Logout
  - Expected: Returns to login screen
  - Status: ⏳ Pending

---

### Screen 3: SHOP SCREEN ✅

**File**: `src/screens/ShopScreen.js`  
**APIs**: `GET /products`, `GET /products/categories/list`

#### Test Cases:

- [ ] **Test 3.1**: Shop screen loads with all products
  - Expected: Grid of products visible in 2 columns
  - Status: ⏳ Pending

- [ ] **Test 3.2**: Search functionality works
  - Input: Type "tomato"
  - Expected: Products filtered to show only tomato-related items
  - Status: ⏳ Pending

- [ ] **Test 3.3**: Search clears results
  - Action: Clear search box
  - Expected: All products show again
  - Status: ⏳ Pending

- [ ] **Test 3.4**: Category filter works
  - Action: Tap "Seeds" chip
  - Expected: Only seed products display
  - Status: ⏳ Pending

- [ ] **Test 3.5**: Multiple category filters
  - Action: Tap "Seeds" then "Fertilizer"
  - Expected: Products from either category show
  - Status: ⏳ Pending

- [ ] **Test 3.6**: Product details modal opens
  - Action: Tap any product card
  - Expected: Modal shows product image, name, description, price, rating
  - Status: ⏳ Pending

- [ ] **Test 3.7**: Quantity selector works
  - Action: Tap + button multiple times
  - Expected: Quantity increases (1-10)
  - Status: ⏳ Pending

- [ ] **Test 3.8**: Add to cart adds item
  - Action: Set quantity to 3, click "Add to Cart"
  - Expected: Item added, modal closes, cart badge shows "1"
  - Status: ⏳ Pending

- [ ] **Test 3.9**: Add multiple products
  - Action: Add 3 different products
  - Expected: Cart badge shows "3"
  - Status: ⏳ Pending

- [ ] **Test 3.10**: Cart navigation from Shop tab
  - Action: Tap Cart icon (appears when items added)
  - Expected: Navigates to Cart screen
  - Status: ⏳ Pending

---

### Screen 4: CART SCREEN ✅

**File**: `src/screens/CartScreen.js`  
**APIs**: `POST /orders`

#### Test Cases:

- [ ] **Test 4.1**: Cart displays added items
  - Expected: All added products show in list with quantities
  - Status: ⏳ Pending

- [ ] **Test 4.2**: Update item quantity
  - Action: Tap + or - on an item
  - Expected: Quantity updates, subtotal recalculates
  - Status: ⏳ Pending

- [ ] **Test 4.3**: Remove item from cart
  - Action: Tap "X" on an item
  - Expected: Item removed, cart updates
  - Status: ⏳ Pending

- [ ] **Test 4.4**: Subtotal calculates correctly
  - Expected: Subtotal = sum of (price × quantity) for all items
  - Status: ⏳ Pending

- [ ] **Test 4.5**: Delivery charges add
  - Expected: Shows ₹50 delivery charge
  - Status: ⏳ Pending

- [ ] **Test 4.6**: Total calculates correctly
  - Expected: Total = Subtotal + ₹50
  - Status: ⏳ Pending

- [ ] **Test 4.7**: Proceed to checkout
  - Action: Tap "Proceed to Checkout"
  - Expected: View changes to checkout form
  - Status: ⏳ Pending

- [ ] **Test 4.8**: Address form has all fields
  - Expected: Name, Street, City, State, ZIP, Phone fields visible
  - Status: ⏳ Pending

- [ ] **Test 4.9**: Address validation works
  - Action: Leave fields empty and tap Place Order
  - Expected: Error: "Please fill all address fields"
  - Status: ⏳ Pending

- [ ] **Test 4.10**: Payment method selection
  - Expected: COD, UPI, Card options visible
  - Status: ⏳ Pending

- [ ] **Test 4.11**: Place order success
  - Action: Fill all fields and tap "Place Order"
  - Expected: Order placed, confirmation modal shows order ID
  - Status: ⏳ Pending

- [ ] **Test 4.12**: Cart clears after order
  - Action: Go back to Shop after order
  - Expected: Cart is empty
  - Status: ⏳ Pending

---

### Screen 5: ORDER TRACKING SCREEN ✅

**File**: `src/screens/OrderTrackingScreen.js`  
**APIs**: `GET /orders`, `GET /orders/:id`

#### Test Cases:

- [ ] **Test 5.1**: Order Tracking tab opens
  - Expected: See "My Orders" header with order count
  - Status: ⏳ Pending

- [ ] **Test 5.2**: Recent orders display
  - Expected: Order card shows for order just placed
  - Status: ⏳ Pending

- [ ] **Test 5.3**: Order card shows details
  - Expected: Order ID, Date, Status badge, Items, Total, Payment status
  - Status: ⏳ Pending

- [ ] **Test 5.4**: Status badge color changes
  - Expected: Pending (orange), Confirmed (green), Shipped (purple), Delivered (green)
  - Status: ⏳ Pending

- [ ] **Test 5.5**: Click order to see full details
  - Action: Tap order card
  - Expected: Details modal opens with all information
  - Status: ⏳ Pending

- [ ] **Test 5.6**: Delivery timeline displays
  - Expected: 4-step timeline (Order Placed, Confirmed, Shipped, Delivered)
  - Status: ⏳ Pending

- [ ] **Test 5.7**: Timeline shows correct steps
  - Expected: Current and completed steps highlighted in green
  - Status: ⏳ Pending

- [ ] **Test 5.8**: Order items display in modal
  - Expected: All items show with name, category, quantity, price
  - Status: ⏳ Pending

- [ ] **Test 5.9**: Delivery address shows in modal
  - Expected: Complete address formatted correctly
  - Status: ⏳ Pending

- [ ] **Test 5.10**: Payment details in modal
  - Expected: Subtotal, delivery charge, total, payment method, payment status
  - Status: ⏳ Pending

- [ ] **Test 5.11**: Reward points display
  - Expected: Shows "10 points earned" for this order
  - Status: ⏳ Pending

- [ ] **Test 5.12**: Pull to refresh updates orders
  - Action: Pull down
  - Expected: Order status refreshes
  - Status: ⏳ Pending

---

### Screen 6: PLANT TRACKING SCREEN ✅

**File**: `src/screens/PlantTrackingScreen.js`  
**APIs**: `GET /garden`, `POST /garden/:id/progress`, `GET /garden/instructions/:productId`

#### Test Cases:

- [ ] **Test 6.1**: Garden tab shows empty or with plants
  - Expected: If no plants, show "Your garden is empty" message
  - Status: ⏳ Pending

- [ ] **Test 6.2**: Empty state shows suggestion
  - Expected: "Start by purchasing plants from shop" button visible
  - Status: ⏳ Pending

- [ ] **Test 6.3**: After adding plants from shop
  - Action: Buy a plant and start tracking
  - Expected: Plant appears in Garden with card
  - Status: ⏳ Pending

- [ ] **Test 6.4**: Plant card shows correct info
  - Expected: Plant name, date planted, health status badge
  - Status: ⏳ Pending

- [ ] **Test 6.5**: Health status color correct
  - Expected: Seedling (purple), Growing (blue), Strong (green), Mature (yellow)
  - Status: ⏳ Pending

- [ ] **Test 6.6**: Progress bar updates
  - Expected: Percentage increases over time
  - Status: ⏳ Pending

- [ ] **Test 6.7**: Click plant to see details
  - Action: Tap plant card
  - Expected: Details modal opens
  - Status: ⏳ Pending

- [ ] **Test 6.8**: Care instructions display
  - Expected: Shows Watering, Sunlight, Soil care tips
  - Status: ⏳ Pending

- [ ] **Test 6.9**: Recent logs show in modal
  - Expected: List of recent progress entries
  - Status: ⏳ Pending

- [ ] **Test 6.10**: Add progress button works
  - Action: Tap "Log Progress"
  - Expected: Progress modal opens
  - Status: ⏳ Pending

- [ ] **Test 6.11**: Log progress modal has input
  - Expected: Text area for notes, photo button, tips, reward info
  - Status: ⏳ Pending

- [ ] **Test 6.12**: Submit progress saves
  - Action: Enter note and tap "Save Progress"
  - Expected: Modal closes, success alert "You earned 2 points"
  - Status: ⏳ Pending

- [ ] **Test 6.13**: New log appears in history
  - Expected: Just-added log appears in recent logs list
  - Status: ⏳ Pending

---

### Screen 7: COMMUNITY FORUM SCREEN ✅

**File**: `src/screens/CommunityForumScreen.js`  
**APIs**: `GET /community`, `POST /community`, `POST /community/:id/comment`

#### Test Cases:

- [ ] **Test 7.1**: Community tab opens
  - Expected: See "Community Forum" header with "+" button
  - Status: ⏳ Pending

- [ ] **Test 7.2**: Post feed loads
  - Expected: If empty, show "No posts yet" message
  - Status: ⏳ Pending

- [ ] **Test 7.3**: Create post button works
  - Action: Tap "+" button
  - Expected: New post modal opens
  - Status: ⏳ Pending

- [ ] **Test 7.4**: Post modal has input fields
  - Expected: Text area, photo button, topics, rewards info
  - Status: ⏳ Pending

- [ ] **Test 7.5**: Character counter works
  - Action: Type in post textarea
  - Expected: Counter shows current characters (0/500)
  - Status: ⏳ Pending

- [ ] **Test 7.6**: Popular topics display
  - Expected: Hashtag chips (#Gardening101, #UrbanGarden, etc.)
  - Status: ⏳ Pending

- [ ] **Test 7.7**: Submit post works
  - Action: Write text and tap "Share"
  - Expected: Modal closes, success alert "You earned 5 points"
  - Status: ⏳ Pending

- [ ] **Test 7.8**: New post appears in feed
  - Expected: Just-created post shows at top of feed
  - Status: ⏳ Pending

- [ ] **Test 7.9**: Post card shows user avatar
  - Expected: Green circle with first letter of username
  - Status: ⏳ Pending

- [ ] **Test 7.10**: Post stats display
  - Expected: Shows likes, comments, time posted
  - Status: ⏳ Pending

- [ ] **Test 7.11**: Click comment opens thread
  - Action: Tap "Comment" on post
  - Expected: Comments modal opens showing thread
  - Status: ⏳ Pending

- [ ] **Test 7.12**: Add comment works
  - Action: Type comment and tap send
  - Expected: Comment added, success alert "You earned 1 point"
  - Status: ⏳ Pending

- [ ] **Test 7.13**: Comment appears in thread
  - Expected: New comment shows with user avatar, name, text
  - Status: ⏳ Pending

---

### Screen 8: INSTRUCTOR BOOKING SCREEN ✅

**File**: `src/screens/InstructorBookingScreen.js`  
**APIs**: `GET /instructors/instructors/available`, `POST /instructors`, `GET /instructors`

#### Test Cases:

- [ ] **Test 8.1**: Instructors tab opens
  - Expected: See "Expert Consultants" header
  - Status: ⏳ Pending

- [ ] **Test 8.2**: Available instructors tab shows
  - Expected: List of instructor cards with names, ratings, rates
  - Status: ⏳ Pending

- [ ] **Test 8.3**: My Bookings tab is empty initially
  - Expected: Tab shows "(0)" and "No bookings yet" message
  - Status: ⏳ Pending

- [ ] **Test 8.4**: Instructor card shows details
  - Expected: Avatar, name, rating with reviews, specialization, experience, rate
  - Status: ⏳ Pending

- [ ] **Test 8.5**: Click book consultation
  - Action: Tap "Book Consultation"
  - Expected: Booking modal opens
  - Status: ⏳ Pending

- [ ] **Test 8.6**: Booking modal has all fields
  - Expected: Date input, time slots grid, notes textarea
  - Status: ⏳ Pending

- [ ] **Test 8.7**: Date input works
  - Action: Enter date (tomorrow or later)
  - Expected: Date is set
  - Status: ⏳ Pending

- [ ] **Test 8.8**: Time slots display
  - Expected: 10:00, 10:30, 11:00... up to 18:30
  - Status: ⏳ Pending

- [ ] **Test 8.9**: Select time slot
  - Action: Tap a time slot
  - Expected: Slot highlights in green
  - Status: ⏳ Pending

- [ ] **Test 8.10**: Enter booking notes
  - Action: Type notes about what to discuss
  - Expected: Text saves
  - Status: ⏳ Pending

- [ ] **Test 8.11**: Price displays
  - Expected: Shows "₹500 per session" (or instructor's rate)
  - Status: ⏳ Pending

- [ ] **Test 8.12**: Cancellation policy shows
  - Expected: "Free cancellation up to 24 hours before session"
  - Status: ⏳ Pending

- [ ] **Test 8.13**: Submit booking works
  - Action: Fill all fields and tap "Request Booking"
  - Expected: Modal closes, success alert
  - Status: ⏳ Pending

- [ ] **Test 8.14**: Booking appears in My Bookings
  - Action: Switch to "My Bookings" tab
  - Expected: Booking appears in list with status "Requested"
  - Status: ⏳ Pending

- [ ] **Test 8.15**: Booking card shows details
  - Expected: Instructor name, date, status, message button
  - Status: ⏳ Pending

---

## 🔄 Cross-Screen Navigation Testing

- [ ] **Test N.1**: Bottom tab navigation works
  - Expected: Can tap any of 6 tabs (Home, Shop, Orders, Garden, Community, Experts)
  - Status: ⏳ Pending

- [ ] **Test N.2**: Back button works on all screens
  - Expected: Can go back from any detail screen
  - Status: ⏳ Pending

- [ ] **Test N.3**: Modals close properly
  - Expected: Tap X or outside modal to close
  - Status: ⏳ Pending

- [ ] **Test N.4**: Navigation persists state
  - Expected: Switch tabs and back, data still there
  - Status: ⏳ Pending

---

## 🔍 Error Handling Testing

- [ ] **Test E.1**: No internet connection
  - Action: Turn off WiFi
  - Expected: Error message displays
  - Status: ⏳ Pending

- [ ] **Test E.2**: Invalid input fields
  - Action: Try to submit empty forms
  - Expected: Validation errors show
  - Status: ⏳ Pending

- [ ] **Test E.3**: Session expired
  - Action: Wait 30 days or delete token
  - Expected: Auto-logout, redirect to login
  - Status: ⏳ Pending

---

## 📊 Performance Testing

- [ ] **Test P.1**: App loads quickly
  - Expected: Home screen loads in < 2 seconds
  - Status: ⏳ Pending

- [ ] **Test P.2**: No lag during scrolling
  - Expected: Smooth scrolling on all screens
  - Status: ⏳ Pending

- [ ] **Test P.3**: Modals open smoothly
  - Expected: No delays or jank
  - Status: ⏳ Pending

---

## ✅ Sign-Off Checklist

When all tests are passing, verify:

- [ ] All 8 screens working
- [ ] All APIs integrated
- [ ] Navigation flows complete
- [ ] Error handling working
- [ ] Reward points calculating
- [ ] Data persisting correctly
- [ ] No console errors
- [ ] App doesn't crash

---

## 📝 Test Report Template

Copy and fill out after testing:

```markdown
# Test Report - [Date]

## Environment
- Backend: ✅ Running
- MongoDB: ✅ Connected
- Frontend: ✅ Expo running
- Device: [Android/iOS/Web]

## Results Summary
- Screens: 8/8 ✅
- Navigation: ✅
- APIs: ✅
- Error Handling: ✅
- Performance: ✅

## Issues Found
1. [List any issues]
2. [List any issues]

## Status
✅ READY FOR PRODUCTION
```

---

**Happy Testing! 🎉**

All screens are ready. Test thoroughly and document any issues found.

