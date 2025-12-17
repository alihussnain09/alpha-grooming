# Alpha Grooming - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Set Up MongoDB Atlas (2 minutes)

1. **Create Account:** Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) → Sign up (free)

2. **Create Cluster:** 
   - Click "Build a Database"
   - Choose "Free" (M0) tier
   - Click "Create"

3. **Get Connection String:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

4. **Create `.env.local` file in project root:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/alpha_grooming?retryWrites=true&w=majority
```
Replace `username`, `password`, and `cluster` with your actual values.

5. **Set Network Access:**
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)

### Step 2: Install & Run (3 minutes)

```bash
# Install dependencies
npm install

# Seed database with initial products
npm run seed

# Start development server
npm run dev
```

Visit: http://localhost:3000

## 🎯 Quick Access

### Customer Site
- **Home:** http://localhost:3000
- **Products:** http://localhost:3000/products
- **Cart:** http://localhost:3000/cart

### Admin Panel
- **Login:** http://localhost:3000/admin/login
  - Username: `admin`
  - Password: `admin123`

- **Dashboard:** http://localhost:3000/admin
- **Products:** http://localhost:3000/admin/products
- **Orders:** http://localhost:3000/admin/orders

## ✅ What You Can Do

### As Customer:
✅ Browse products with filters  
✅ Search products  
✅ Add to cart  
✅ Place orders  
✅ View product details  

### As Admin:
✅ Add products  
✅ Delete products  
✅ Manage stock  
✅ View all orders  
✅ Update order status  
✅ View dashboard statistics  

## 📝 Adding a Product

1. Login to admin panel
2. Go to "Product Management"
3. Click "Add Product"
4. Fill in details:
   - **Name:** e.g., "Luxury Shaving Cream"
   - **Description:** Product details
   - **Price:** e.g., 29.99
   - **Category:** Beard Care / Face Care / Hair Care
   - **Stock:** e.g., 50
   - **Image:** Use existing or add to `/public/` folder

## 🖼️ Adding Product Images

1. Add your image to `/public/` folder (e.g., `shaving-cream.jpg`)
2. When adding product, enter: `/shaving-cream.jpg`
3. Image will display on product page

## 🔧 Troubleshooting

### Can't Connect to Database?
- Check `.env.local` exists in root folder
- Verify MONGODB_URI is correct
- Ensure IP is whitelisted in MongoDB Atlas
- Restart dev server after adding .env.local

### Products Not Showing?
```bash
npm run seed
```

### Admin Login Not Working?
- Clear browser cache/localStorage
- Use credentials: admin/admin123
- Check browser console for errors

## 📚 Learn More

See `SETUP_INSTRUCTIONS.md` for detailed documentation.

## 🆘 Need Help?

1. Check MongoDB Atlas connection
2. Verify `.env.local` file exists
3. Run `npm run seed` to populate data
4. Check browser and terminal console for errors

