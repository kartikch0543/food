import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { api } from '../lib/api';
import { MapPin, CreditCard, ChevronRight, CheckCircle, ArrowRight, IndianRupee, Sparkles, Package, ShieldCheck } from 'lucide-react';

export function Checkout() {
    const { cart, clearCart } = useCart();
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('stripe');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const total = cart?.items.reduce((sum, item) => sum + (item.foodId?.price || 0) * item.quantity, 0) || 0;

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const orderData = {
                items: cart.items.map(item => ({
                    foodId: item.foodId?._id || item.foodId,
                    name: item.foodId?.name,
                    price: item.foodId?.price,
                    quantity: item.quantity
                })),
                totalAmount: total + 45,
                deliveryAddress: address,
                paymentMethod
            };
            await api.orders.create(orderData);
            clearCart();
            navigate('/orders');
        } catch (err) {
            console.error(err);
            alert('Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] pb-32">
            {/* Header Section - Mid-Plus Balanced */}
            <div className="bg-white border-b border-gray-100 pt-20 pb-16 px-10 mb-16 shadow-sm">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-4 mb-4">
                        <Sparkles className="h-5 w-5 text-rose-500" />
                        <span className="text-[11px] font-black text-rose-600 uppercase tracking-[0.4em] italic">Transaction Protocol</span>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-end gap-12">
                        <h1 className="text-5xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">
                            Secure <span className="text-rose-600">Gateway.</span>
                        </h1>

                        <div className="flex items-center gap-8 bg-gray-50 p-3.5 rounded-[2rem] border border-gray-100 shadow-inner">
                            {[1, 2, 3].map((step) => (
                                <div key={step} className="flex items-center gap-4">
                                    <div className={`h-12 w-12 rounded-[1.2rem] flex items-center justify-center font-black italic text-sm shadow-md transition-all ${step === 2 ? 'bg-rose-600 text-white' : step < 2 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-white text-gray-200'}`}>
                                        {step < 2 ? <CheckCircle className="h-6 w-6" /> : `0${step}`}
                                    </div>
                                    {step < 3 && <ChevronRight className="h-5 w-5 text-gray-200" />}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handlePlaceOrder} className="max-w-7xl mx-auto px-10 grid grid-cols-1 lg:grid-cols-12 gap-20">
                <div className="lg:col-span-7 space-y-16">
                    {/* Logistics Section - Substantial */}
                    <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-2xl hover:shadow-black/[0.02] transition-all duration-700">
                        <div className="absolute top-0 right-0 p-12 text-rose-50/40 opacity-20 group-hover:rotate-12 transition-transform duration-[2s]">
                            <MapPin className="h-44 w-44" />
                        </div>

                        <div className="flex items-center gap-6 mb-12 relative z-10">
                            <div className="bg-rose-50 p-5 rounded-[1.8rem] text-rose-600 shadow-xl shadow-rose-100/50">
                                <MapPin className="h-8 w-8" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter leading-none mb-2">Logistics <span className="text-rose-600">Endpoint.</span></h3>
                                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic opacity-60">Destination for fulfillment</p>
                            </div>
                        </div>

                        <div className="relative z-10">
                            <textarea
                                required
                                placeholder="ENTER PRECISE DELIVERY COORDINATES..."
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full bg-gray-50 border-2 border-transparent focus:border-rose-600 focus:bg-white rounded-[2.5rem] p-10 text-base font-black text-gray-900 outline-none transition-all min-h-[220px] uppercase tracking-wider italic shadow-inner placeholder:text-gray-200"
                            />
                        </div>
                    </div>

                    {/* Settlement Section - Interactive */}
                    <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-2xl hover:shadow-black/[0.02] transition-all duration-700">
                        <div className="absolute top-0 right-0 p-12 text-gray-50/50 opacity-20 group-hover:rotate-12 transition-transform duration-[2s]">
                            <CreditCard className="h-44 w-44" />
                        </div>

                        <div className="flex items-center gap-6 mb-12 relative z-10">
                            <div className="bg-[#131517] p-5 rounded-[1.8rem] text-white shadow-2xl border border-white/5">
                                <CreditCard className="h-8 w-8" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter leading-none mb-2">Settlement <span className="text-rose-600">Protocol.</span></h3>
                                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic opacity-60">Preferred financial channel</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                            {[
                                { id: 'stripe', name: 'Digital Ledger', detail: 'SECURE ENCRYPTED TRANSFER', icon: ShieldCheck },
                                { id: 'cod', name: 'Physical Settlement', detail: 'PAYMENT UPON FULFILLMENT', icon: IndianRupee }
                            ].map((method) => (
                                <button
                                    key={method.id}
                                    type="button"
                                    onClick={() => setPaymentMethod(method.id)}
                                    className={`p-10 rounded-[3rem] border-2 text-left transition-all duration-700 relative overflow-hidden group/btn ${paymentMethod === method.id ? 'bg-[#131517] border-[#131517] text-white shadow-2xl scale-[1.03]' : 'bg-gray-50 border-gray-50 text-gray-400 hover:border-gray-200'}`}
                                >
                                    <div className="flex items-center justify-between mb-8">
                                        <span className={`text-[10px] font-black uppercase tracking-[0.3em] italic ${paymentMethod === method.id ? 'text-rose-500' : 'text-gray-300'}`}>Channel 0{method.id === 'stripe' ? '1' : '2'}</span>
                                        {paymentMethod === method.id ? <CheckCircle className="h-6 w-6 text-rose-500 animate-in zoom-in duration-500" /> : <method.icon className="h-5 w-5 opacity-20" />}
                                    </div>
                                    <p className="text-2xl font-black uppercase italic tracking-tighter mb-3 leading-none">{method.name}</p>
                                    <p className="text-[11px] font-black uppercase tracking-[0.2em] opacity-40 italic">{method.detail}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Manifest - Premium */}
                <div className="lg:col-span-5">
                    <div className="bg-white p-12 rounded-[4rem] border border-gray-100 shadow-2xl sticky top-[120px] hover:shadow-black/[0.05] transition-all duration-1000 group/sidebar">
                        <div className="flex items-center justify-between mb-12">
                            <div className="flex items-center gap-5">
                                <div className="bg-rose-600 p-4.5 rounded-[1.5rem] rotate-3 shadow-xl group-hover/sidebar:rotate-6 transition-transform">
                                    <Package className="h-7 w-7 text-white" />
                                </div>
                                <h2 className="text-3xl font-black uppercase italic tracking-tighter leading-none">Order <span className="text-rose-600">Summary.</span></h2>
                            </div>
                            <span className="text-[11px] font-black text-gray-300 uppercase italic tracking-widest">Ref: CX_{Math.floor(Math.random() * 9000).toString().padStart(4, '0')}</span>
                        </div>

                        <div className="space-y-5 max-h-[380px] overflow-y-auto no-scrollbar mb-12 pr-2">
                            {cart.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center p-6 bg-gray-50 rounded-[2rem] border border-transparent hover:border-gray-100 hover:bg-white transition-all group/item shadow-sm">
                                    <div className="flex items-center gap-6">
                                        <span className="text-sm font-black text-rose-600 bg-white w-12 h-12 rounded-[1.2rem] flex items-center justify-center shadow-md border border-gray-50 italic">{item.quantity}x</span>
                                        <span className="text-base font-black text-gray-900 uppercase tracking-tight italic group-hover/item:text-rose-600 transition-colors">{item.foodId?.name}</span>
                                    </div>
                                    <span className="text-lg font-black text-gray-900 italic">₹{(item.foodId?.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-6 p-10 bg-[#131517] rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden border border-white/5">
                            <div className="absolute top-0 right-0 p-10 opacity-5 text-rose-500">
                                <Sparkles className="h-32 w-32" />
                            </div>

                            <div className="flex justify-between items-center text-gray-500 relative z-10">
                                <span className="text-[11px] font-black uppercase tracking-[0.3em] italic">Base Inventory</span>
                                <span className="font-bold text-lg italic">₹{total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-500 relative z-10">
                                <span className="text-[11px] font-black uppercase tracking-[0.3em] italic">Logistics Fee</span>
                                <span className="font-bold text-lg italic">₹45.00</span>
                            </div>
                            <div className="h-px bg-white/10 relative z-10" />
                            <div className="flex justify-between items-end relative z-10">
                                <div>
                                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-rose-500 mb-2 italic">Total Settlement</p>
                                    <div className="flex items-center gap-2 font-black text-6xl italic tracking-tighter text-white">
                                        <IndianRupee className="h-8 w-8 text-rose-600 ml-[-8px]" />
                                        {(total + 45).toFixed(2)}
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !address}
                                className={`w-full py-8 mt-4 rounded-3xl font-black text-sm uppercase tracking-[0.4em] flex items-center justify-center gap-6 group transition-all transform active:scale-95 italic relative z-10 ${loading || !address ? 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5' : 'bg-rose-600 text-white hover:bg-rose-700 shadow-[0_25px_50px_rgba(225,29,72,0.3)]'}`}
                            >
                                {loading ? 'Fulfilling...' : <>Place Commitment <ArrowRight className="h-7 w-7 group-hover:translate-x-4 transition-transform duration-700" /></>}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
