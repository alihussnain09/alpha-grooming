# Alpha Grooming - Setup Instructions

## MongoDB Atlas Setup

### 1. Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (Free tier M0 is sufficient)

### 2. Get Connection String
1. In your MongoDB Atlas dashboard, click "Connect"
2. Choose "Connect your application"
3. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
4. Replace `<password>` with your actual database password
5. Add a database name after `.net/` (e.g., `alpha_grooming`)

### 3. Set Up Environment Variables
Create a file named `.env.local` in the root directory with:

```env
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/alpha_grooming?retryWrites=true&w=majority
```

**Important:** Replace `your_username`, `your_password`, and `cluster` with your actual credentials.

### 4. Whitelist Your IP Address
1. In MongoDB Atlas, go to "Network Access"
2. Click "Add IP Address"
3. Add your current IP or choose "Allow Access from Anywhere" (0.0.0.0/0) for development

### 5. Create Database User
1. Go to "Database Access" in MongoDB Atlas
2. Click "Add New Database User"
3. Create a user with read/write permissions
4. Remember the username and password for your connection string

## Initial Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Seed the Database
Once your MongoDB connection is set up, seed the database with initial products:

```bash
npm run seed
```

Or manually using ts-node:
```bash
npx ts-node scripts/seed-database.ts
```

### 3. Run Development Server
```bash
npm run dev
```

## Features Implemented

### Customer Features
✅ Browse products with filters and search
✅ View product details
✅ Add to cart functionality
✅ Checkout with order placement
✅ Orders saved to MongoDB database
✅ SEO-friendly URLs with product slugs

### Admin Features
✅ Admin login (username: `admin`, password: `admin123`)
✅ Dashboard with real-time statistics
✅ Add new products
✅ Delete products
✅ View all orders
✅ Update order status
✅ All data persisted in MongoDB

## Admin Access

### Login Credentials
- **URL:** http://localhost:3000/admin/login
- **Username:** admin
- **Password:** admin123

### Admin Capabilities
1. **Dashboard:** View total products, orders, revenue, and customers
2. **Products Management:** Add/delete products with images, pricing, stock
3. **Orders Management:** View and update order statuses

## Product Management

### Adding Products
1. Login to admin panel
2. Go to "Product Management"
3. Click "Add Product"
4. Fill in:
   - Product Name (slug will be auto-generated)
   - Description
   - Price
   - Category (Beard Care, Face Care, Hair Care)
   - Stock quantity
   - Image URL (use existing images or add new ones to `/public/`)

### Deleting Products
1. Go to "Product Management"
2. Click "Delete" button next to any product
3. Confirm deletion

## Image Management

### Current Images
Product images are stored in `/public/` folder:
- premium-beard-oil.jpg
- beard-growth-serum.jpg
- charcoal-face-wash.jpg
- moisturizing-face-cream.jpg
- hair-growth-oil.jpg
- premium-hair-wax.jpg

### Adding New Images
1. Add image files to `/public/` folder
2. When creating products, use the filename (e.g., `/new-product.jpg`)

### Future Enhancement: Cloud Image Upload
For production, consider integrating:
- Cloudinary
- AWS S3
- Uploadthing
- Vercel Blob Storage

## Database Schema

### Products Collection
```typescript
{
  name: string
  slug: string (unique, auto-generated)
  description: string
  price: number
  category: "Beard Care" | "Face Care" | "Hair Care"
  image: string (URL)
  stock: number
  rating: number
  reviews: number
  createdAt: Date
  updatedAt: Date
}
```

### Orders Collection
```typescript
{
  customerInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    zipCode: string
  }
  items: [{
    productId: ObjectId (ref: Product)
    quantity: number
    price: number
    name: string
  }]
  subtotal: number
  tax: number
  shipping: number
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  createdAt: Date
  updatedAt: Date
}
```

## Troubleshooting

### Connection Issues
- Verify your MongoDB URI in `.env.local`
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure database user has proper permissions

### Products Not Showing
- Run the seed script to populate initial data
- Check MongoDB Atlas to verify data exists
- Check browser console for API errors

### Admin Login Issues
- Clear browser localStorage
- Use correct credentials (admin/admin123)
- Check browser cookies

## Production Deployment

### Environment Variables
Add `MONGODB_URI` to your hosting platform's environment variables:
- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Environment Variables
- Railway/Render: Add as environment variable

### Security Recommendations
1. Change admin credentials from default
2. Implement proper authentication with JWT
3. Add rate limiting
4. Use environment-specific MongoDB databases
5. Enable MongoDB encryption at rest
6. Implement proper image upload validation

## Next Steps for Enhancement

1. **Image Upload:** Integrate Cloudinary or AWS S3
2. **Payment Gateway:** Add Stripe/PayPal integration
3. **Email Notifications:** Send order confirmations
4. **User Accounts:** Allow customers to track orders
5. **Reviews System:** Let customers leave product reviews
6. **Analytics:** Add Google Analytics or similar
7. **Search:** Implement advanced product search
8. **Inventory Alerts:** Notify when stock is low

## Support

For issues or questions:
- Check MongoDB Atlas connection
- Verify environment variables are set correctly
- Review browser console for errors
- Check terminal for API errors

