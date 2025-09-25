# 🔐 Li-Lo Platform - Account Credentials

## 🌐 Local Deployment Access
**URL:** http://localhost:3000

---

## 👤 Account Types & Login Credentials

### 1️⃣ CEO Account (Full Platform Access)
- **Email:** `ceo@li-lo.com`
- **Password:** `CEO2024#Secure`
- **Dashboard:** http://localhost:3000/ceo
- **Access Level:** Complete platform oversight
- **Features:**
  - Global analytics dashboard
  - Revenue & financial reports
  - Seller performance metrics
  - Regional sales analysis
  - Customer insights
  - Live activity monitoring

### 2️⃣ Seller Account (Store Management)
- **Email:** `seller@li-lo.com`
- **Password:** `Seller2024#Safe`
- **Dashboard:** http://localhost:3000/seller/dashboard
- **Access Level:** Product & inventory management
- **Features:**
  - Stock control (add/remove/adjust)
  - Product management
  - Price adjustments
  - Order viewing
  - Inventory alerts
  - Sales analytics

### 3️⃣ Client Account (Customer)
- **Email:** `test.client@example.com`
- **Password:** `Client2024#Test`
- **Dashboard:** http://localhost:3000/account/dashboard
- **Access Level:** Customer features
- **Features:**
  - Order history
  - Wishlist
  - Profile management
  - Address book
  - Payment methods
  - Preferences

---

## 🚀 How to Use

### First Time Setup:
1. Make sure the development server is running:
   ```bash
   npm run dev
   ```

2. Open your browser and go to: http://localhost:3000

### To Login as CEO:
1. Go to: http://localhost:3000/auth/login
2. Enter email: `ceo@li-lo.com`
3. Enter password: `CEO2024#Secure`
4. You'll be automatically redirected to the CEO Dashboard

### To Login as Seller:
1. Go to: http://localhost:3000/auth/login
2. Enter email: `seller@li-lo.com`
3. Enter password: `Seller2024#Safe`
4. You'll be automatically redirected to the Seller Dashboard

### To Login as Client:
1. Go to: http://localhost:3000/auth/login
2. Enter email: `test.client@example.com`
3. Enter password: `Client2024#Test`
4. You'll be automatically redirected to the Client Dashboard

---

## 📝 Creating New Accounts

### New Client Account (Default):
- Go to: http://localhost:3000/auth/register
- Use any email (except ceo@li-lo.com or seller@li-lo.com)
- Complete registration
- Account will automatically be assigned "client" role

### Special Role Assignment:
- **CEO Role:** Only `ceo@li-lo.com` email gets CEO access
- **Seller Role:** Only `seller@li-lo.com` or emails containing "seller" get seller access
- **Client Role:** All other emails become clients

---

## 🔄 Password Reset
If you need to reset any password:
1. Go to: http://localhost:3000/auth/forgot-password
2. Enter the email address
3. Follow the reset instructions

---

## 🛠️ Troubleshooting

### Can't Login?
1. Make sure the dev server is running (`npm run dev`)
2. Check that you're using the exact email and password (case-sensitive)
3. Clear browser cookies/cache if needed

### Wrong Dashboard?
- The system automatically routes based on email:
  - `ceo@li-lo.com` → CEO Dashboard
  - `seller@li-lo.com` → Seller Dashboard
  - All others → Client Dashboard

### Need Different Access?
- Use the appropriate email for the role you want to test
- You cannot change roles after account creation (by design)

---

## 🔒 Security Notes
- All passwords are hashed using bcrypt
- Sessions are managed by Supabase Auth
- Role-based access control (RBAC) is enforced
- Middleware protection on all routes

---

## 📊 Test Scenarios

### Testing CEO Features:
1. Login with CEO account
2. Check KPI cards (Revenue, Orders, Customers, etc.)
3. Navigate through Performance, Products, Sellers tabs
4. View live activity feed

### Testing Seller Features:
1. Login with Seller account
2. Go to Inventory page
3. Try adjusting stock levels
4. Check product management
5. View order statistics

### Testing Client Features:
1. Login with Client account
2. Browse products
3. Add to cart
4. Check wishlist
5. View order history

---

## 📱 Quick Links

- **Homepage:** http://localhost:3000
- **Login Page:** http://localhost:3000/auth/login
- **Register Page:** http://localhost:3000/auth/register
- **CEO Dashboard:** http://localhost:3000/ceo
- **Seller Dashboard:** http://localhost:3000/seller/dashboard
- **Client Dashboard:** http://localhost:3000/account/dashboard
- **Products:** http://localhost:3000/sneakers

---

**Last Updated:** September 25, 2025
**Version:** 1.0.0