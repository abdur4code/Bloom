# Bloom - Minimalist E-Commerce Frontend

A clean, modern e-commerce frontend built with React, Tailwind CSS, and Redux Toolkit.

## Features

✨ **Minimalist Design**
- Clean, modern UI with heavy use of whitespace
- Black/white/zinc color palette
- Industry-standard typography
- Responsive grid layouts

🔐 **Authentication**
- User registration and login
- Redux Toolkit for state management
- Secure token-based authentication (Bearer tokens)
- Automatic token attachment via Axios interceptors
- Session persistence with localStorage

🛍️ **Product Management**
- Browse all products with grid layout
- Product details page with images and pricing
- Add to cart UI (ready for implementation)
- Multiple currency support (USD, EUR, GBP, INR)
- Stock status indicators

📝 **Product Upload**
- Add new products via modal form
- Image upload with 5MB file size validation
- React Hook Form for form handling
- Multipart form data submission
- Real-time validation feedback

🎨 **Modern UI Components**
- Loading spinners and states
- Toast notifications (success/error feedback)
- Icons via Lucide React
- Smooth transitions and hover states

## Tech Stack

- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Redux Toolkit** - State management
- **Axios** - HTTP client with interceptors
- **Tailwind CSS** - Utility-first styling
- **React Hook Form** - Form handling and validation
- **React Toastify** - Notifications
- **Lucide React** - SVG icons
- **Vite** - Build tool and dev server

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Main navigation with auth UI
│   ├── AddProductModal.jsx # Product creation form
│   └── ProductCard.jsx     # Reusable product card
├── pages/
│   ├── Home.jsx            # Landing page with featured products
│   ├── Products.jsx        # All products grid
│   ├── ProductDetails.jsx  # Single product details
│   ├── Login.jsx           # User login page
│   └── Register.jsx        # User registration page
├── store/
│   ├── store.js            # Redux store configuration
│   └── authSlice.js        # Auth reducer and actions
├── services/
│   └── axiosConfig.js      # Axios instance with interceptors
├── styles/
│   └── index.css           # Global styles with Tailwind
├── App.jsx                 # Main app component with routing
└── main.jsx               # Entry point with Redux provider
```

## Setup & Installation

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```
   - App will open at `http://localhost:5173`

3. **Build for production**
   ```bash
   npm run build
   ```

## API Integration

The frontend expects a backend running at `http://localhost:3000/api` with these endpoints:

### Authentication
- `POST /api/auth/register` - Register new user
  - Body: `{ name, email, password, confirmPassword }`
  - Response: User created message
  
- `POST /api/auth/login` - User login
  - Body: `{ email, password }`
  - Response: `{ accessToken, user: { id, name, email } }`
  
- `GET /api/auth/me` - Get current user (requires auth)
  - Header: `Authorization: Bearer <token>`
  - Response: `{ user: { id, name, email } }`

### Products
- `GET /api/products` - List all products
  - Response: Array of products
  
- `GET /api/products/:id` - Get single product
  - Response: Product object
  
- `POST /api/products` - Create product (requires auth)
  - Header: `Authorization: Bearer <token>`
  - Body: `multipart/form-data`
    - Fields: `name`, `description`, `price`, `currency`, `stock`, `image`
  - Response: Created product object

## Authentication Flow

1. User registers → Backend creates account → Redirects to login
2. User logs in → Receives access token → Stored in Redux + localStorage
3. Axios interceptor attaches token to all requests automatically
4. On 401 response → User redirected to login
5. Logout → Clear Redux state + localStorage → Redirect to home

## Key Features Explained

### Redux State Management
- Stores user info and access token
- Persists to localStorage for session recovery
- Auto-clears on logout or 401 errors

### Form Validation
- React Hook Form for all forms
- Real-time validation feedback
- File size validation (images < 5MB)
- Password confirmation matching

### Error Handling
- Global error display with toast notifications
- Specific error messages from API
- Graceful fallbacks for missing images
- Loading states for all API calls

### Responsive Design
- Mobile-first approach with Tailwind
- Grid layouts adapt from 1-4 columns
- Touch-friendly button sizing
- Proper spacing and typography scales

## Environment Variables

Create `.env.local` (optional, defaults to localhost):

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Development Tips

### Adding New Pages
1. Create component in `src/pages/`
2. Add route in `App.jsx`
3. Link from Navbar or other pages

### Adding New Components
1. Create reusable component in `src/components/`
2. Use Lucide icons for consistency
3. Follow minimalist design principles

### Styling
- Use Tailwind utility classes
- Follow zinc/black/white color palette
- Keep spacing consistent
- Use the defined breakpoints (md, lg)

### API Calls
- Import `axiosInstance` from `src/services/axiosConfig.js`
- Token is attached automatically
- Wrap in try-catch and use toast for feedback

## Future Enhancements

- [ ] Shopping cart implementation
- [ ] Order management
- [ ] User profile and settings
- [ ] Product search and filtering
- [ ] Review and ratings system
- [ ] Wishlist functionality
- [ ] Payment integration
- [ ] Admin dashboard

## License

Built as a practice project following minimalist e-commerce design principles.

## Notes

- Images are served from backend (placeholder URLs for missing images)
- Form validation happens both client and server-side
- All API calls include loading states
- Error messages are user-friendly
- The design prioritizes whitespace and simplicity
