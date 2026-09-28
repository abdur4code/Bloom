# Development Guide - Bloom E-Commerce Frontend

## Architecture Overview

### Component Structure

The project follows a clean, scalable architecture:

```
Pages (Route-level components)
  ↓
Components (Reusable UI components)
  ↓
Services (API calls via Axios)
  ↓
Store (Redux state management)
```

### Data Flow

1. **Components** dispatch Redux actions or call API services
2. **Services** use Axios to communicate with backend
3. **Axios** automatically attaches auth tokens
4. **Store** manages global state (user, token, etc.)
5. **Components** subscribe to Redux state and re-render

## Key Concepts

### Redux State Structure

```javascript
auth: {
  user: { id, name, email },           // Logged-in user
  accessToken: "Bearer xxx",           // Auth token
  isLoading: false,                    // Loading state
  error: null                          // Error messages
}
```

### Axios Interceptors

- **Request**: Automatically adds `Authorization: Bearer <token>` header
- **Response**: On 401, clears auth and redirects to login

### Form Handling

Using React Hook Form for:
- Form state management
- Real-time validation
- Error display
- File uploads

### Toast Notifications

Using React Toastify for:
- Success messages
- Error alerts
- Auto-dismiss after 3 seconds
- Bottom-right corner placement

## Adding New Features

### Add a New Page

1. **Create the page component** (`src/pages/NewPage.jsx`):
```javascript
import { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosConfig';

function NewPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/endpoint');
        setData(response.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return <div>{/* JSX */}</div>;
}

export default NewPage;
```

2. **Add route in `App.jsx`**:
```javascript
import NewPage from './pages/NewPage';

<Routes>
  {/* existing routes */}
  <Route path="/new-page" element={<NewPage />} />
</Routes>
```

3. **Add navigation link in `Navbar.jsx`**:
```javascript
<Link to="/new-page" className="...">
  New Page
</Link>
```

### Add a New Component

1. **Create reusable component** (`src/components/MyComponent.jsx`):
```javascript
import { useState } from 'react';

function MyComponent({ prop1, prop2, onAction }) {
  return (
    <div className="space-y-4">
      {/* Component JSX */}
    </div>
  );
}

export default MyComponent;
```

2. **Use in pages**:
```javascript
import MyComponent from '../components/MyComponent';

<MyComponent prop1={value1} onAction={handleAction} />
```

### Handle Forms

Using React Hook Form:

```javascript
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post('/endpoint', data);
      toast.success('Success!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('fieldName', {
          required: 'This field is required',
          pattern: { value: /pattern/, message: 'Invalid format' }
        })}
      />
      {errors.fieldName && <p>{errors.fieldName.message}</p>}
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Make API Calls

Always use the configured Axios instance:

```javascript
import axiosInstance from '../services/axiosConfig';

// GET request
const response = await axiosInstance.get('/products');

// POST request
const response = await axiosInstance.post('/auth/login', {
  email: 'user@example.com',
  password: 'password'
});

// With FormData (file upload)
const formData = new FormData();
formData.append('name', 'Product Name');
formData.append('image', fileInput);
const response = await axiosInstance.post('/products', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
```

## Styling Guidelines

### Tailwind CSS Classes

All styling uses Tailwind utility classes. Key patterns:

```javascript
// Container and spacing
<div className="max-w-7xl mx-auto px-4 py-8 space-y-4">

// Grid layouts
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Buttons
<button className="bg-zinc-900 text-white px-4 py-2 rounded hover:bg-zinc-800 transition">

// Typography
<h1 className="text-4xl font-bold text-zinc-900">
<p className="text-zinc-500 text-lg">

// States
<div className="bg-red-50 border border-red-200 text-red-700">

// Responsive
<div className="hidden md:block">  // Hidden on mobile
```

### Color Palette

- **Primary**: `zinc-900` (dark backgrounds/text)
- **Secondary**: `white` / `bg-white`
- **Light**: `zinc-50` (light backgrounds)
- **Muted**: `zinc-500` / `zinc-400` (secondary text)
- **Borders**: `zinc-200` / `zinc-300`
- **Success**: `green-100` / `green-800`
- **Error**: `red-50` / `red-700`

## Best Practices

### ✅ DO

- Use functional components with hooks
- Keep components small and focused
- Use Redux for global state (auth, user)
- Use local state for component-level data
- Handle errors with try-catch
- Show loading states during API calls
- Validate forms before submission
- Use meaningful variable/function names
- Add comments for complex logic

### ❌ DON'T

- Don't use class components
- Don't make API calls without error handling
- Don't store sensitive data in localStorage
- Don't use inline styles (use Tailwind)
- Don't hardcode API URLs (use axiosInstance)
- Don't forget loading states
- Don't validate only on client side
- Don't make requests in useEffect without cleanup
- Don't nest components too deeply

## Performance Tips

1. **Lazy Load Routes**:
```javascript
import { lazy, Suspense } from 'react';

const Home = lazy(() => import('./pages/Home'));

<Suspense fallback={<Loading />}>
  <Route path="/" element={<Home />} />
</Suspense>
```

2. **Memoize Components**:
```javascript
import { memo } from 'react';

export default memo(ProductCard);
```

3. **Use useCallback for Functions**:
```javascript
const handleClick = useCallback(() => {
  // function body
}, [dependencies]);
```

## Debugging Tips

### Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Check Request/Response headers and body
4. Verify Authorization header is present

### Check Redux State
1. Install Redux DevTools extension
2. Open DevTools (F12)
3. Redux tab shows all state changes
4. Can time-travel through actions

### Check Console Errors
1. F12 → Console tab
2. Look for red errors
3. Check error messages and stack traces

### Common Issues

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Token expired or invalid - need to login again |
| 403 Forbidden | User doesn't have permission for this action |
| 404 Not Found | API endpoint doesn't exist or typo in URL |
| CORS Error | Backend doesn't allow requests from frontend URL |
| Image not loading | Check image path format and backend URL |

## Testing Checklist

Before deploying:

- [ ] All pages load correctly
- [ ] Authentication works (register, login, logout)
- [ ] Add product form works
- [ ] Product grid displays correctly
- [ ] Product details page works
- [ ] Links navigate correctly
- [ ] Responsive on mobile (use DevTools)
- [ ] Error messages show properly
- [ ] Toast notifications appear
- [ ] No console errors
- [ ] Token persists on refresh
- [ ] 401 redirects to login

## Deployment

### Production Build
```bash
npm run build
```

Creates optimized build in `dist/` folder.

### Environment Variables for Production
Create `.env.production`:
```env
VITE_API_BASE_URL=https://your-api-domain/api
```

### Hosting Options
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- DigitalOcean

## File Size & Performance

- Main bundle: ~100KB (gzipped)
- Images: Optimize before upload
- Lazy load routes for large apps
- Use Lighthouse to check performance

## Security Considerations

✅ **Good Practices**
- Tokens stored in localStorage (not XSS-proof but acceptable)
- Always validate on backend
- Use HTTPS in production
- CORS properly configured
- No secrets in frontend code

⚠️ **Current Limitations**
- Tokens in localStorage vulnerable to XSS
- Consider httpOnly cookies for better security
- Add CSRF protection if needed
- Validate all user inputs on backend

## Resources & Documentation

- [React Docs](https://react.dev)
- [React Router Docs](https://reactrouter.com)
- [Redux Toolkit Docs](https://redux-toolkit.js.org)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Axios Documentation](https://axios-http.com)
- [React Hook Form Docs](https://react-hook-form.com)

---

**Happy coding! 🚀**
