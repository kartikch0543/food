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
        <nav className="sticky top-0 z-[100] bg-white/80 backdrop-blur-3xl border-b border-gray-100/50 px-8 py-3.5 transition-all duration-500 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="relative">
                        <div className="absolute inset-0 bg-rose-500 blur-xl opacity-20 group-hover:opacity-60 transition-opacity" />
                        <div className="relative bg-rose-600 p-2.5 rounded-2xl shadow-[0_8px_20px_-4px_rgba(225,29,72,0.4)] group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                            <span className="text-white font-black text-xl italic leading-none block">B</span>
                        </div>
                    </div>
                    <span className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic group-hover:text-rose-600 transition-colors">Bite<span className="text-rose-600">Bliss</span></span>
                </Link>

                {/* Navigation Links */}
                <div className="flex items-center gap-4 md:gap-8">
                    {user ? (
                        <>
                            {/* Role Based Links */}
                            <div className="hidden lg:flex items-center gap-10 pr-10 border-r border-rose-100/50">
                                {user.role === 'user' && (
                                    <>
                                        <Link to="/" className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-rose-600 hover:translate-y-[-1px] transition-all">Explore</Link>
                                        <Link to="/orders" className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-rose-600 hover:translate-y-[-1px] transition-all">My Orders</Link>
                                    </>
                                )}

                                {(user.role === 'admin' || user.role === 'owner') && (
                                    <>
                                        <Link to="/admin/dashboard" className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-rose-600 hover:translate-y-[-1px] transition-all">Dashboard</Link>
                                        <Link to="/admin/restaurants" className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-rose-600 hover:translate-y-[-1px] transition-all">Restaurants</Link>
                                        <Link to="/admin/orders" className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-rose-600 hover:translate-y-[-1px] transition-all">Global Orders</Link>
                                    </>
                                )}
                            </div>

                            {/* User Menu */}
                            <div className="flex items-center gap-4 md:gap-6 pl-2">
                                {user.role === 'user' && (
                                    <Link to="/cart" className="relative group p-3.5 bg-gray-50/50 rounded-2xl hover:bg-rose-50 transition-all border border-gray-100 hover:border-rose-100 shadow-sm">
                                        <ShoppingCart className="h-5 w-5 text-gray-400 group-hover:text-rose-600 transition-colors" />
                                        {cartCount > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-[10px] font-black h-6 w-6 flex items-center justify-center rounded-full border-4 border-white shadow-lg animate-in zoom-in duration-300">
                                                {cartCount}
                                            </span>
                                        )}
                                    </Link>
                                )}

                                <div className="flex items-center gap-3 md:gap-5">
                                    <div className="hidden sm:flex flex-col items-end">
                                        <span className="text-[11px] font-black text-gray-900 uppercase tracking-widest leading-none mb-1.5">{user.name}</span>
                                        <span className="text-[9px] font-black text-rose-500 uppercase tracking-[0.25em] bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-100/50 shadow-sm">{user.role === 'owner' ? 'Restaurateur' : user.role === 'admin' ? 'Master Admin' : 'Customer'}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="p-3 bg-gray-50/50 border border-gray-100 text-gray-400 rounded-2xl hover:bg-rose-600 hover:text-white hover:border-rose-500 transition-all active:scale-90 shadow-sm group"
                                        title="Logout"
                                    >
                                        <LogOut className="h-4.5 w-4.5 group-hover:rotate-12" />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-6">
                            <Link to="/login" className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-rose-600 transition-all">Sign In</Link>
                            <Link to="/register" className="px-8 py-3.5 bg-rose-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] hover:bg-rose-700 transition-all shadow-[0_10px_20px_-5px_rgba(225,29,72,0.4)] active:scale-95 group relative overflow-hidden">
                                <span className="relative z-10">Get Started</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
