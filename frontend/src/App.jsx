import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Pages
import { Home } from './pages/Home';
import { RestaurantMenu } from './pages/RestaurantMenu';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// User Pages
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Orders } from './pages/Orders';

// Admin Pages
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminRestaurants } from './pages/admin/AdminRestaurants';
import { AdminFoods } from './pages/admin/AdminFoods';
import { AdminOrders } from './pages/admin/AdminOrders';

export function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-rose-100 selection:text-rose-900">
                        <Navbar />
                        <main className="flex-grow">
                            <Routes>
                                {/* Public Routes */}
                                <Route path="/" element={<Home />} />
                                <Route path="/restaurant/:id" element={<RestaurantMenu />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/admin/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />

                                {/* Protected User Routes */}
                                <Route element={<ProtectedRoute />}>
                                    <Route path="/cart" element={<Cart />} />
                                    <Route path="/checkout" element={<Checkout />} />
                                    <Route path="/orders" element={<Orders />} />
                                </Route>

                                {/* Protected Admin Routes */}
                                <Route element={<ProtectedRoute requireAdmin />}>
                                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                                    <Route path="/admin/restaurants" element={<AdminRestaurants />} />
                                    <Route path="/admin/restaurants/:id/foods" element={<AdminFoods />} />
                                    <Route path="/admin/orders" element={<AdminOrders />} />
                                </Route>
                            </Routes>
                        </main>
                        <Footer />
                    </div>
                </Router>
            </CartProvider>
        </AuthProvider>
    );
}
