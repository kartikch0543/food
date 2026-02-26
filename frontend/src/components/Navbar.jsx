import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, LogOut } from 'lucide-react';

export function Navbar() {
    const { user, logout } = useAuth();
    const { cart } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const cartCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;

    return (
        <nav className="sticky top-0 z-[100] bg-white/80 backdrop-blur-3xl border-b border-gray-100 px-8 py-5 transition-all duration-500 shadow-sm">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-4 group">
                    <div className="relative">
                        <div className="absolute inset-0 bg-rose-500 blur-xl opacity-20 group-hover:opacity-60 transition-opacity" />
                        <div className="relative bg-rose-600 p-3 rounded-2xl shadow-xl group-hover:rotate-6 group-hover:scale-110 transition-all duration-500">
                            <span className="text-white font-black text-2xl italic leading-none block">B</span>
                        </div>
                    </div>
                    <span className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic group-hover:text-rose-600 transition-colors">Bite<span className="text-rose-600">Bliss</span></span>
                </Link>

                {/* Navigation Links */}
                <div className="flex items-center gap-6 md:gap-10">
                    {user ? (
                        <>
                            {/* Role Based Links */}
                            <div className="hidden lg:flex items-center gap-12 pr-12 border-r border-gray-100">
                                {user.role === 'user' && (
                                    <>
                                        <Link to="/" className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 hover:text-rose-600 transition-all">Explore</Link>
                                        <Link to="/orders" className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 hover:text-rose-600 transition-all">My Orders</Link>
                                    </>
                                )}

                                {(user.role === 'admin' || user.role === 'owner') && (
                                    <>
                                        <Link to="/admin/dashboard" className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 hover:text-rose-600 transition-all">Dashboard</Link>
                                        <Link to="/admin/restaurants" className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 hover:text-rose-600 transition-all">Restaurants</Link>
                                        <Link to="/admin/orders" className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 hover:text-rose-600 transition-all">Global Orders</Link>
                                    </>
                                )}
                            </div>

                            {/* User Menu */}
                            <div className="flex items-center gap-4 md:gap-8 pl-2">
                                {user.role === 'user' && (
                                    <Link to="/cart" className="relative group p-4 bg-gray-50/50 rounded-2xl hover:bg-rose-50 transition-all border border-gray-100 hover:border-rose-100">
                                        <ShoppingCart className="h-6 w-6 text-gray-400 group-hover:text-rose-600 transition-colors" />
                                        {cartCount > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-[11px] font-black h-7 w-7 flex items-center justify-center rounded-full border-4 border-white shadow-xl animate-in zoom-in duration-300">
                                                {cartCount}
                                            </span>
                                        )}
                                    </Link>
                                )}

                                <div className="flex items-center gap-4 md:gap-6">
                                    <div className="hidden sm:flex flex-col items-end">
                                        <span className="text-[12px] font-black text-gray-900 uppercase tracking-widest leading-none mb-2">{user.name}</span>
                                        <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100 italic">{user.role === 'owner' ? 'Restaurateur' : user.role === 'admin' ? 'Master Admin' : 'Customer'}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="p-4 bg-gray-50/50 border border-gray-100 text-gray-400 rounded-2xl hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all active:scale-95 group shadow-sm"
                                        title="Logout"
                                    >
                                        <LogOut className="h-5 w-5 group-hover:rotate-6" />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-8">
                            <Link to="/login" className="text-[12px] font-black uppercase tracking-[0.4em] text-gray-400 hover:text-rose-600 transition-all">Sign In</Link>
                            <Link to="/register" className="px-10 py-4.5 bg-rose-600 text-white rounded-2xl text-[12px] font-black uppercase tracking-[0.4em] hover:bg-rose-700 transition-all shadow-xl shadow-rose-900/10 active:scale-95 group relative overflow-hidden">
                                <span className="relative z-10">Get Started</span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
