import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, IndianRupee, Trash, Sparkles } from 'lucide-react';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

export function Cart() {
    const { cart, updateQuantity, removeItem, clearCart } = useCart();
    const navigate = useNavigate();

    const total = cart?.items.reduce((sum, item) => sum + (item.foodId?.price || 0) * item.quantity, 0) || 0;

    if (!cart?.items.length) return (
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-8">
            <div className="max-w-2xl w-full text-center p-24 bg-white rounded-[4rem] border border-gray-100 shadow-2xl animate-in zoom-in duration-700">
                <div className="bg-rose-50 w-28 h-28 rounded-[2.5rem] flex items-center justify-center mx-auto mb-12 group-hover:rotate-12 transition-transform shadow-inner">
                    <ShoppingCart className="h-12 w-12 text-rose-600" />
                </div>
                <h1 className="text-5xl font-black text-gray-900 uppercase tracking-tighter mb-6 italic leading-none">Folder <br /> <span className="text-rose-600">Empty.</span></h1>
                <p className="text-gray-400 font-bold text-lg mb-12 italic opacity-70">"Your culinary portfolio currently contains no active assets."</p>
                <Link to="/" className="inline-block px-14 py-6 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-rose-700 transition-all shadow-2xl shadow-rose-100 active:scale-95 italic">Explore Brands</Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fafafa] pb-32">
            {/* Header Section - Mid-Plus Balanced */}
            <div className="bg-white border-b border-gray-100 pt-20 pb-16 px-10 mb-16 shadow-sm">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-10">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <Sparkles className="h-5 w-5 text-rose-500" />
                            <span className="text-[11px] font-black text-rose-600 uppercase tracking-[0.4em] italic">Inventory Management</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">
                            My <span className="text-rose-600">Manifest.</span>
                        </h1>
                    </div>
                    <button
                        onClick={clearCart}
                        className="flex items-center gap-3 px-8 py-4 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-white hover:shadow-xl rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all border border-transparent hover:border-red-100"
                    >
                        <Trash className="h-4 w-4" /> Purge Folder
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-10 grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Items List - Proportional */}
                <div className="lg:col-span-8 space-y-10">
                    {cart.items.map((item) => (
                        <div key={item.foodId?._id} className="group bg-white p-10 rounded-[3rem] border border-gray-100 flex flex-col md:flex-row items-center gap-10 hover:shadow-2xl hover:shadow-black/[0.03] transition-all duration-700 shadow-sm relative overflow-hidden">
                            <div className="w-full md:w-52 h-52 rounded-[2rem] overflow-hidden ring-1 ring-gray-100 shadow-md">
                                <ImageWithFallback
                                    src={item.foodId?.image}
                                    alt={item.foodId?.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]"
                                />
                            </div>

                            <div className="flex-1 text-center md:text-left relative z-10">
                                <span className="text-rose-400 font-black text-[11px] uppercase tracking-[0.3em] mb-3 block italic">{item.foodId?.category}</span>
                                <h3 className="text-2xl md:text-3xl font-black text-gray-900 uppercase italic tracking-tighter mb-4 group-hover:text-rose-600 transition-colors leading-none">{item.foodId?.name}</h3>
                                <p className="text-gray-400 font-bold text-sm line-clamp-2 italic mb-8 opacity-70 leading-relaxed max-w-lg">"{item.foodId?.description}"</p>

                                <div className="flex items-center justify-center md:justify-start gap-4">
                                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-[1.8rem] border border-gray-100 shadow-inner">
                                        <button
                                            onClick={() => updateQuantity(item.foodId?._id, item.quantity - 1)}
                                            className="p-3 bg-white text-gray-400 hover:text-rose-600 rounded-xl transition-all shadow-sm active:scale-90"
                                        >
                                            <Minus className="h-4.5 w-4.5" />
                                        </button>
                                        <span className="w-14 text-center font-black text-gray-900 text-xl italic">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.foodId?._id, item.quantity + 1)}
                                            className="p-3 bg-white text-gray-400 hover:text-rose-600 rounded-xl transition-all shadow-sm active:scale-90"
                                        >
                                            <Plus className="h-4.5 w-4.5" />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeItem(item.foodId?._id)}
                                        className="p-5 text-gray-300 hover:text-red-500 transition-all hover:scale-110"
                                    >
                                        <Trash2 className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>

                            <div className="text-center md:text-right md:pl-10 md:border-l border-gray-50 z-10">
                                <p className="text-[11px] text-gray-400 font-black uppercase tracking-widest mb-2 italic">Impact</p>
                                <div className="flex items-center justify-center md:justify-end gap-1.5 font-black text-gray-900 italic">
                                    <IndianRupee className="h-5 w-5 text-rose-600" />
                                    <span className="text-4xl tracking-tighter leading-none">{(item.foodId?.price * item.quantity).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary Sidebar - Balanced Plus */}
                <div className="lg:col-span-4">
                    <div className="bg-gray-900 p-12 rounded-[4rem] text-white shadow-2xl sticky top-[120px] border border-white/5 shadow-rose-900/20 overflow-hidden group">
                        <div className="absolute top-0 right-0 p-12 text-rose-600/5 group-hover:rotate-12 transition-transform duration-1000">
                            <ShoppingCart className="h-48 w-48 -mr-16 -mt-16" />
                        </div>

                        <div className="flex items-center gap-4 mb-12 relative z-10">
                            <div className="h-2.5 w-2.5 rounded-full bg-rose-600 animate-pulse" />
                            <h2 className="text-3xl font-black uppercase italic tracking-tighter leading-none">Order <span className="text-rose-600">Impact.</span></h2>
                        </div>

                        <div className="space-y-8 mb-12 relative z-10">
                            <div className="flex justify-between items-center text-gray-500">
                                <span className="text-[11px] font-black uppercase tracking-[0.2em] italic">Base Inventory</span>
                                <span className="font-bold text-base italic">₹{total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-500">
                                <span className="text-[11px] font-black uppercase tracking-[0.2em] italic">Logistics Fee</span>
                                <span className="font-bold text-base italic">₹45.00</span>
                            </div>
                            <div className="h-px bg-white/10" />
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-rose-500 mb-2 italic">Settlement Total</p>
                                    <div className="flex items-center gap-2 font-black text-5xl italic tracking-tighter text-white">
                                        <IndianRupee className="h-7 w-7 text-rose-600 ml-[-6px]" />
                                        {(total + 45).toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/checkout')}
                            className="w-full bg-rose-600 text-white py-8 rounded-2xl font-black text-xs uppercase tracking-[0.4em] hover:bg-rose-700 transition-all flex items-center justify-center gap-5 group shadow-2xl shadow-rose-900/30 active:scale-95 italic relative z-10"
                        >
                            Authorize Transfer <ArrowRight className="h-6 w-6 group-hover:translate-x-3 transition-transform duration-700" />
                        </button>

                        <p className="text-[10px] text-gray-500 text-center font-black uppercase tracking-[0.4em] mt-10 italic opacity-40 relative z-10">
                            Secure blockchain fulfillment active
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
