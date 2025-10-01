# 🔐 TEST CREDENTIALS & ACCESS GUIDE - LI-LO PLATFORM

**Server URL**: http://localhost:3000
**Status**: ✅ Running

---

## 📝 TEST USER ACCOUNTS

### 1. CEO Account 👔
```
Email: ceo@li-lo.com
Password: Test123456!
Role: CEO
Dashboard: http://localhost:3000/ceo
```

**Features Available:**
- Full analytics dashboard
- Revenue metrics & charts
- Customer analytics
- Product performance
- Stock overview
- Financial reports
- Real-time KPIs

### 2. Seller/Worker Account 💼
```
Email: worker@li-lo.com
Password: Test123456!
Role: Seller
Dashboard: http://localhost:3000/seller
```

**Features Available:**
- Inventory management
- Stock adjustments
- Movement history
- Reorder suggestions
- Product updates
- Quick stock actions

### 3. Client Account 🛍️
```
Email: client@li-lo.com
Password: Test123456!
Role: Client
Dashboard: http://localhost:3000/client
```

**Features Available:**
- Order history
- Profile management
- Support tickets
- Wishlist
- Product reviews
- Membership status

---

## 🧪 HOW TO TEST EACH SECTION

### STEP 1: Access Login Page
1. Open browser
2. Go to: http://localhost:3000/auth/login
3. Use credentials above

### STEP 2: Test CEO Dashboard
1. Login with: `ceo@li-lo.com`
2. You'll be redirected to `/ceo`
3. **What to Test:**
   - View revenue metrics (cards at top)
   - Check interactive charts
   - Review top products table
   - Check customer analytics
   - Export data buttons
   - Time period filters

### STEP 3: Test Seller Dashboard
1. Login with: `worker@li-lo.com`
2. You'll be redirected to `/seller`
3. **What to Test:**
   - Navigate to `/seller/inventory`
   - Adjust stock levels (+ and - buttons)
   - View stock history at `/seller/history`
   - Check reorder suggestions at `/seller/reorder`
   - Test quick actions on products

### STEP 4: Test Client Dashboard
1. Login with: `client@li-lo.com`
2. Navigate to `/client`
3. **What to Test:**
   - View order history at `/client/orders`
   - Edit profile at `/client/profile`
   - Create support ticket at `/client/support`
   - Add products to wishlist
   - Submit product reviews

---

## 🛒 E-COMMERCE FLOW TEST

### Complete Purchase Flow:
1. **Browse Products**
   - Go to: http://localhost:3000/sneakers
   - 36 products available
   - Use filters (brand, price, size)
   - Search functionality

2. **Product Details**
   - Click any product
   - Select size (EU 37-47)
   - Check stock availability
   - Add to cart

3. **Shopping Cart**
   - Go to: http://localhost:3000/cart
   - Adjust quantities
   - Apply discount code: `WELCOME20`
   - Proceed to checkout

4. **Checkout**
   - Fill shipping details
   - Use test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC
   - Complete purchase

5. **Order Confirmation**
   - View success page
   - Check email (if configured)
   - Stock automatically deducted

---

## 🎯 KEY FEATURES TO TEST

### 1. Authentication System
- [x] Login/Logout
- [x] Register new account
- [x] Password reset
- [x] Email verification
- [x] Role-based access

### 2. Product Management
- [x] Browse catalog
- [x] Search products
- [x] Filter by brand/price/size
- [x] View product details
- [x] Check stock levels

### 3. Shopping Features
- [x] Add to cart
- [x] Update quantities
- [x] Apply discount codes
- [x] Checkout process
- [x] Payment processing

### 4. Dashboard Features
- [x] CEO analytics
- [x] Seller inventory
- [x] Client orders
- [x] Support tickets
- [x] Product reviews

### 5. New Features
- [x] Review system (NEW)
- [x] Support tickets (NEW)
- [x] Discount admin (NEW)

---

## 📊 TEST DATA AVAILABLE

### Products
- **Total**: 36 sneakers
- **Brands**: Nike, Adidas, Jordan, New Balance, Yeezy
- **Sizes**: EU 37-47 (474 variants)
- **Price Range**: €150 - €15,000

### Sample Products:
1. Nike SB Dunk Low Travis Scott - €1,250
2. Air Jordan 1 Retro High - €420
3. Yeezy Boost 350 V2 - €350
4. Nike Air Max 1 - €180
5. Adidas Ultra Boost - €220

### Discount Codes
- `WELCOME20` - 20% off
- `SAVE10` - 10% off
- `FIRST15` - 15% off first order

---

## 🔧 TROUBLESHOOTING

### If login fails:
1. Check server is running: http://localhost:3000
2. Verify Supabase connection in `.env.local`
3. Try registering a new account

### If dashboards don't load:
1. Clear browser cache
2. Check console for errors (F12)
3. Verify you're logged in with correct role

### If products don't appear:
1. Check API: http://localhost:3000/api/products
2. Verify Supabase connection
3. Check network tab for errors

---

## 🚀 QUICK TEST COMMANDS

```bash
# Test API endpoints
curl http://localhost:3000/api/products
curl http://localhost:3000/api/drops

# Check server status
curl -I http://localhost:3000

# Test specific pages
curl -I http://localhost:3000/auth/login
curl -I http://localhost:3000/sneakers
```

---

## ✅ VERIFICATION CHECKLIST

Before marking as complete, verify:

- [ ] All three dashboards load
- [ ] Products display with images
- [ ] Cart functionality works
- [ ] Filters and search work
- [ ] Stock updates correctly
- [ ] Support tickets can be created
- [ ] Reviews can be submitted
- [ ] Discount codes apply

---

**Note**: These are test accounts with sample data. In production, real users will register and create their own accounts.

---

*Test guide created: 2025-10-01*
*Server running at: http://localhost:3000*