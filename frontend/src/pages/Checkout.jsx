import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useCart } from '../context/CartContext';
import { MapPin, CreditCard, ShoppingBag, ArrowRight, ShieldCheck, Truck, IndianRupee, ChevronLeft } from 'lucide-react';

export function Checkout() {
    const { cart, clearCart, loading: cartLoading } = useCart();
    const navigate = useNavigate();

    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (!cartLoading && (!cart || cart.items.length === 0)) {
            navigate('/cart');
        }
    }, [cart, cartLoading, navigate]);

    if (cartLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-6">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-rose-600 border-solid"></div>
                <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest italic">Securing Logistics...</p>
            </div>
        </div>
    );

    if (!cart || cart.items.length === 0) return null;

    const totalAmount = cart.items.reduce((sum, item) => {
        const food = item.foodId;
        if (typeof food === 'object' && food !== null) {
            return sum + (food.price * item.quantity);
        }
        return sum;
    }, 0);

    const orderItems = cart.items.map(item => {
        const food = item.foodId;
        if (typeof food === 'object' && food !== null) {
            return {
                foodId: food._id,
                name: food.name,
                price: food.price,
                quantity: item.quantity
            };
        }
        return null;
    }).filter(Boolean);

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (orderItems.length === 0) return;
        setProcessing(true);

        try {
            const firstItem = cart.items[0].foodId;
            const restaurantId = typeof firstItem === 'object' ? firstItem.restaurantId : null;

            await api.orders.create({
                items: orderItems,
                totalAmount,
                deliveryAddress: address,
                paymentMethod,
                restaurantId
            });
            await clearCart();
            navigate('/orders');
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Failed to place order');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] pb-24">
            {/* Header Sticky Container - Compact */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-[73px] z-[40]">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <button onClick={() => navigate('/cart')} className="p-2.5 bg-gray-50 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all shadow-sm">
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <span className="text-[8px] font-black text-rose-600 uppercase tracking-[0.3em] italic">Transmission Phase</span>
                            </div>
                            <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">Checkout <span className="text-rose-600">Protocol.</span></h1>
                        </div>
                        <div className="hidden lg:flex items-center gap-4 px-8 py-3 bg-gray-50 rounded-2xl border border-gray-100 italic">
                            <span className="text-[9px] font-black text-gray-400 uppercase">1. Basket</span>
                            <ArrowRight className="h-3 w-3 text-gray-200" />
                            <span className="text-[9px] font-black text-rose-600 uppercase tracking-widest">2. Verification</span>
                            <ArrowRight className="h-3 w-3 text-gray-200" />
                            <span className="text-[9px] font-black text-gray-300 uppercase">3. Arrival</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    <div className="lg:col-span-8">
                        <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-10">
                            {/* Delivery Section */}
                            <section className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="flex items-center justify-center w-10 h-10 bg-gray-900 text-white rounded-xl">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">Coordinates</h2>
                                        <p className="text-[8px] font-black text-rose-600 uppercase tracking-widest mt-0.5 italic">Define the final destination</p>
                                    </div>
                                </div>
                                <div className="relative">
                                    <textarea
                                        required
                                        className="w-full px-8 py-6 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-rose-600 transition-all h-32 resize-none font-bold text-base placeholder:text-gray-200 outline-none italic"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="Detailed address (Street, Building, Flat...)"
                                    ></textarea>
                                </div>
                            </section>

                            {/* Payment Section */}
                            <section className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="flex items-center justify-center w-10 h-10 bg-gray-900 text-white rounded-xl">
                                        <CreditCard className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">Settlement</h2>
                                        <p className="text-[8px] font-black text-rose-600 uppercase tracking-widest mt-0.5 italic">Select transaction gateway</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <label className={`relative flex items-center p-8 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-rose-600 bg-white shadow-lg' : 'border-gray-50 bg-gray-50/50 hover:border-rose-100'}`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="COD"
                                            checked={paymentMethod === 'COD'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="sr-only"
                                        />
                                        <div className="flex flex-col">
                                            <span className={`text-xl font-black uppercase tracking-tighter italic ${paymentMethod === 'COD' ? 'text-gray-900' : 'text-gray-400'}`}>Cash</span>
                                            <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest mt-1 italic">Hand Settlement</span>
                                        </div>
                                    </label>

                                    <div className="relative flex items-center p-8 border-2 border-dashed border-gray-100 rounded-2xl opacity-40 bg-gray-50/30">
                                        <div className="flex flex-col">
                                            <span className="text-xl font-black uppercase tracking-tighter italic text-gray-300">Digital</span>
                                            <span className="text-[9px] font-black text-gray-300 uppercase mt-1 italic">Locked</span>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </form>
                    </div>

                    {/* Order Summary Sidebar - Compact */}
                    <div className="lg:col-span-4 lg:sticky lg:top-[200px]">
                        <div className="bg-gray-900 p-10 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden group/sidebar">
                            <div className="relative z-10">
                                <h2 className="text-xl font-black mb-8 flex items-center gap-3 uppercase tracking-tighter italic text-rose-500">
                                    <ShoppingBag className="h-5 w-5" /> Final Manifest
                                </h2>

                                <div className="space-y-6 mb-12">
                                    <div className="max-h-48 overflow-y-auto no-scrollbar space-y-4 pr-2">
                                        {cart.items.map((item, idx) => {
                                            const food = item.foodId;
                                            if (typeof food !== 'object') return null;
                                            return (
                                                <div key={idx} className="flex justify-between items-center py-0.5">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-black uppercase tracking-tight text-white/90 italic">{food.name}</span>
                                                        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest mt-0.5 italic">Qty x{item.quantity}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 font-black text-rose-400 italic">
                                                        <IndianRupee className="h-2.5 w-2.5" />
                                                        <span className="text-lg tracking-tighter">{(food.price * item.quantity).toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="h-px bg-white/10 my-8" />
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white/30 mb-2 italic">Grand Aggregate</p>
                                            <div className="flex items-center gap-2 font-black text-white italic">
                                                <IndianRupee className="h-6 w-6 text-rose-500" />
                                                <p className="text-5xl tracking-tighter leading-[0.8]">{totalAmount.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <button
                                        type="submit"
                                        form="checkout-form"
                                        disabled={processing || !address}
                                        className="w-full relative group/btn py-6 bg-rose-600 text-white rounded-2xl font-black text-[9px] uppercase tracking-[0.3em] active:scale-95 transition-all shadow-xl disabled:opacity-30 disabled:cursor-not-allowed italic"
                                    >
                                        {processing ? 'Processing...' : 'Authorize Arrival'}
                                    </button>
                                    <div className="flex items-center justify-center gap-2 text-white/10 text-[8px] font-black uppercase tracking-widest italic">
                                        <ShieldCheck className="h-3 w-3" /> Secure Transmission
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
