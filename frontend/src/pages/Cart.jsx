import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShoppingCart, IndianRupee } from 'lucide-react';

export function Cart() {
    const { cart, addItem, removeItem, loading } = useCart();
    const navigate = useNavigate();

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-6">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-rose-600 border-solid"></div>
                <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest italic">Auditing Assets...</p>
            </div>
        </div>
    );

    const totalAmount = cart?.items.reduce((sum, item) => {
        const food = item.foodId;
        if (typeof food === 'object' && food !== null) {
            return sum + (food.price * item.quantity);
        }
        return sum;
    }, 0) || 0;

    if (!cart || cart.items.length === 0) {
        return (
            <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-white px-6">
                <div className="max-w-xl w-full text-center">
                    <div className="bg-rose-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm animate-bounce">
                        <ShoppingBag className="h-6 w-6 text-rose-600" />
                    </div>
                    <h2 className="text-xl font-black text-gray-900 mb-2 tracking-tighter uppercase italic">Empty Basket</h2>
                    <p className="text-gray-400 font-bold text-[8px] uppercase tracking-[0.3em] mb-6 italic opacity-60">
                        No acquisitions detected.
                    </p>
                    <Link to="/" className="inline-flex items-center justify-center bg-rose-600 text-white px-8 py-3 rounded-xl hover:bg-rose-700 transition-all font-black text-[9px] uppercase tracking-widest shadow-lg">
                        Browse Menu
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa] pb-24">
            {/* Header Sticky Container - Compact */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-[73px] z-[40]">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <div className="h-1 w-1 rounded-full bg-rose-600 animate-pulse" />
                                <span className="text-[8px] font-black text-rose-600 uppercase tracking-[0.3em] italic">Procurement Phase</span>
                            </div>
                            <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">
                                Your Asset <span className="text-rose-600">Basket.</span>
                            </h1>
                        </div>
                        <div className="bg-gray-900 text-white px-6 py-2.5 rounded-xl flex items-center gap-4 shadow-xl">
                            <div className="flex flex-col">
                                <span className="text-[7px] font-black text-rose-500 uppercase tracking-widest italic leading-none mb-0.5">Portfolio Size</span>
                                <span className="text-xs font-black tracking-tight">{cart.items.length} Secure Items</span>
                            </div>
                            <div className="h-4 w-px bg-white/10" />
                            <div className="flex flex-col text-right">
                                <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest italic leading-none mb-0.5">Locked Value</span>
                                <span className="text-xs font-black tracking-tight text-rose-400">₹{totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    <div className="lg:col-span-8 space-y-6">
                        {cart.items.map((item, index) => {
                            const food = item.foodId;
                            if (typeof food !== 'object' || food === null) return null;

                            return (
                                <div key={food._id || index} className="group flex flex-col sm:flex-row items-center gap-6 md:gap-8 p-3 bg-white rounded-[2rem] border border-gray-100 hover:shadow-xl transition-all duration-500 relative overflow-hidden">
                                    <div className="h-32 w-32 md:h-40 md:w-40 flex-shrink-0 relative z-10">
                                        <div className="relative h-full w-full overflow-hidden rounded-[1.5rem] border-2 border-white shadow-lg">
                                            <img src={food.image} alt={food.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        </div>
                                    </div>

                                    <div className="flex-1 w-full sm:w-auto relative z-10 pr-4">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <span className="text-[7px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg uppercase tracking-widest mb-2 inline-block border border-rose-100 italic">{food.category}</span>
                                                <h3 className="text-xl font-black text-gray-900 uppercase italic leading-tight tracking-tighter mb-1">{food.name}</h3>
                                                <p className="text-[8px] text-gray-400 font-bold uppercase italic opacity-60 line-clamp-1 italic">"{food.description}"</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[7px] text-gray-400 font-black uppercase tracking-widest mb-0.5 italic">Rate</p>
                                                <div className="flex items-center justify-end gap-0.5 font-black text-gray-900 italic leading-none">
                                                    <IndianRupee className="h-3 w-3 text-rose-600" />
                                                    <span className="text-xl tracking-tighter">{food.price.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between gap-6 pt-4 border-t border-gray-50">
                                            <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-1.5 border border-gray-100">
                                                <button
                                                    onClick={() => addItem(food, -1)}
                                                    className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm hover:bg-rose-600 hover:text-white transition-all text-gray-400"
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </button>
                                                <span className="w-6 text-center font-black text-gray-900 text-lg italic tracking-tighter">{item.quantity}</span>
                                                <button
                                                    onClick={() => addItem(food, 1)}
                                                    className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm hover:bg-rose-600 hover:text-white transition-all text-gray-400"
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeItem(food._id)}
                                                className="group/trash flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-gray-300 hover:text-red-500 transition-all italic"
                                            >
                                                <div className="p-2.5 bg-gray-50 rounded-xl group-hover/trash:bg-red-50 transition-colors">
                                                    <Trash2 className="h-4 w-4" />
                                                </div>
                                                Purge
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="lg:col-span-4 lg:sticky lg:top-[200px]">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 relative overflow-hidden">
                            <div className="relative z-10">
                                <h2 className="text-lg font-black text-gray-900 mb-6 uppercase tracking-tighter italic flex items-center gap-3">
                                    <div className="h-1.5 w-1.5 bg-rose-600 rounded-full animate-pulse" /> Assessment
                                </h2>

                                <div className="space-y-4 mb-10">
                                    <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-gray-400 italic">
                                        <span>Portfolio Value</span>
                                        <div className="flex items-center gap-1 text-gray-900 font-black text-xs">
                                            <IndianRupee className="h-2 w-2" />
                                            <span>{totalAmount.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <div className="h-px bg-gray-50" />
                                    <div className="pt-2">
                                        <p className="text-[8px] font-black uppercase tracking-widest text-rose-600 mb-2 italic">Total Valuation</p>
                                        <div className="flex items-center gap-2 text-gray-900 font-black italic">
                                            <IndianRupee className="h-6 w-6 text-rose-600" />
                                            <p className="text-5xl tracking-tighter leading-none">{totalAmount.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <button
                                        onClick={() => navigate('/checkout')}
                                        className="w-full py-4 bg-rose-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest active:scale-95 transition-all shadow-lg"
                                    >
                                        Commit Transaction
                                    </button>
                                    <button
                                        onClick={() => navigate('/')}
                                        className="w-full py-4 bg-gray-50 text-gray-400 rounded-xl font-black text-[9px] uppercase tracking-widest hover:text-gray-900 transition-all border border-gray-100"
                                    >
                                        Add Assets
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
