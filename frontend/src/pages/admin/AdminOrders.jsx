import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../../lib/api';
import { Package, IndianRupee, Eye, ListFilter, ClipboardCheck, Clock, CheckCircle2, ShieldAlert, Sparkles, XCircle, MapPin } from 'lucide-react';
export function AdminOrders() {
    const location = useLocation();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [filterStatus, setFilterStatus] = useState(location.state?.filter || 'All');

    useEffect(() => {
        if (location.state?.filter) {
            setFilterStatus(location.state.filter);
        }
    }, [location.state]);

    const fetchOrders = async () => {
        try {
            const data = await api.orders.getAll();
            setOrders(data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, status) => {
        try {
            await api.orders.updateStatus(orderId, status);
            fetchOrders();
        } catch (err) {
            console.error(err);
            alert('Failed to update status');
        }
    };

    const StatusOption = ({ status }) => {
        const specs = {
            'Pending': { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
            'Preparing': { icon: ClipboardCheck, color: 'text-blue-500', bg: 'bg-blue-50' },
            'Out for Delivery': { icon: Package, color: 'text-rose-500', bg: 'bg-rose-50' },
            'Delivered': { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
            'Cancelled': { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' }
        };
        const spec = specs[status] || { icon: Package, color: 'text-gray-500', bg: 'bg-gray-50' };
        return (
            <div className={`flex items-center gap-3 ${spec.color}`}>
                <spec.icon className="h-4 w-4" />
                <span>{status}</span>
            </div>
        );
    };

    const filteredOrders = orders.filter(o => {
        if (filterStatus === 'All') return true;
        if (filterStatus === 'Feedback') return o.rating && o.rating > 0;
        return o.status === filterStatus;
    });

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-rose-600 border-solid"></div>
                <p className="text-gray-400 font-black text-xs uppercase tracking-[0.4em] italic leading-none">Accessing Central Registry...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fafafa] pb-32 animate-in fade-in duration-1000">
            {/* Header Sticky Container - Balanced Plus */}
            {/* Hero Header Section - Normal Flow */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-10 py-12 lg:py-16">
                    <div className="flex flex-col items-center text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="h-2 w-2 rounded-full bg-rose-600 animate-pulse shadow-[0_0_12px_rgba(225,29,72,0.4)]" />
                            <span className="text-[10px] font-black text-rose-600 uppercase tracking-[0.5em] italic leading-none">Elite Logistics Feed</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 uppercase tracking-tighter italic leading-none mb-3">
                            Fulfillment <span className="text-rose-600 text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-rose-400">Sync.</span>
                        </h1>
                        <p className="text-gray-400 font-bold text-sm italic max-w-xl opacity-70">Synchronize and monitor the globalized culinary fulfillment pipeline.</p>
                    </div>
                </div>
            </div>

            {/* Persistent Filter Bar - Sticky */}
            <div className="sticky top-0 z-[40] w-full bg-[#fafafa]/80 backdrop-blur-xl border-b border-gray-100 py-4">
                <div className="max-w-7xl mx-auto px-10">
                    <div className="flex items-center justify-center p-1.5 bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-black/5 w-fit max-w-full mx-auto overflow-x-auto no-scrollbar gap-1 ring-1 ring-gray-900/5">
                        {['All', 'Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled', 'Feedback'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-5 py-3 rounded-[2rem] text-[10px] whitespace-nowrap font-black uppercase tracking-widest transition-all duration-500 active:scale-95 ${filterStatus === status
                                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/10'
                                    : 'text-gray-400 hover:text-rose-600 hover:bg-rose-50'
                                    }`}
                            >
                                {status === 'Feedback' ? 'Voice' : status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-10 mt-16 pb-32 space-y-12">
                {filteredOrders.length === 0 ? (
                    <div className="text-center p-32 bg-white rounded-[4rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                        <Package className="h-24 w-24 text-gray-50 mb-10" />
                        <h2 className="text-4xl font-black text-gray-200 uppercase tracking-widest italic tracking-tighter border-b-4 border-gray-50 pb-4">Vault Restrictive.</h2>
                        <p className="text-gray-400 mt-6 font-bold italic">"No active tickets match the current filtration parameters."</p>
                    </div>
                ) : (
                    filteredOrders.map((order) => (
                        <div key={order._id} className="group bg-white rounded-[3.5rem] border border-gray-100 shadow-sm hover:shadow-[0_40px_100px_rgba(0,0,0,0.04)] transition-all duration-1000 overflow-hidden">
                            <div className="p-10 md:p-14">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-10">
                                    <div className="flex items-center gap-8">
                                        <div className="h-16 w-16 bg-gray-50 rounded-[1.8rem] flex items-center justify-center text-gray-400 group-hover:bg-rose-50 group-hover:text-rose-600 transition-all duration-700 shadow-inner">
                                            <Package className="h-8 w-8" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-4 mb-2">
                                                <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] italic">Operational Ticket</span>
                                                <code className="text-[11px] font-black text-rose-600 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-100/50">#{order._id.slice(-6).toUpperCase()}</code>
                                            </div>
                                            <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 uppercase tracking-tighter italic leading-tight">{order.userId?.name || 'Authorized Guest'}</h3>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 w-full md:w-auto">
                                        <div className="flex-1 md:flex-none">
                                            <div className="relative">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                    className={`w-full md:w-56 px-6 py-4.5 rounded-2xl text-[12px] font-black uppercase tracking-widest border transition-all outline-none cursor-pointer appearance-none shadow-sm ${order.status === 'Cancelled' ? 'bg-red-50 border-red-100 text-red-600' :
                                                        order.status === 'Delivered' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                                                            'bg-rose-50 border-rose-100 text-rose-600 shadow-inner/20'
                                                        }`}
                                                >
                                                    {['Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'].map(s => (
                                                        <option key={s} value={s}>{s.toUpperCase()}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                                                    <ListFilter className="h-4 w-4" />
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                                            className={`p-5 rounded-2xl transition-all duration-700 shadow-xl ${expandedOrder === order._id ? 'bg-rose-600 text-white rotate-180 shadow-rose-900/20' : 'bg-gray-50 text-gray-400 hover:bg-rose-600 hover:text-white transform hover:scale-110'}`}
                                        >
                                            <Eye className={`h-6 w-6`} />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 px-2">
                                    <div className="p-6 bg-gray-50/70 rounded-[2rem] border border-gray-100/50 hover:bg-white hover:shadow-xl transition-all duration-700 group/card relative overflow-hidden">
                                        <div className="absolute -right-2 -bottom-2 text-rose-600/5 rotate-12 group-hover/card:-translate-y-2 transition-transform duration-[2s]">
                                            <IndianRupee className="h-16 w-16" />
                                        </div>
                                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 italic leading-none">Net Impact</p>
                                        <div className="flex items-center gap-2 text-gray-900 relative z-10">
                                            <IndianRupee className="h-5 w-5 text-rose-600" />
                                            <span className="text-3xl font-black tracking-tighter italic leading-tight">{order.totalAmount.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <div className="p-6 bg-gray-50/70 rounded-[2rem] border border-gray-100/50 hover:bg-white hover:shadow-xl transition-all duration-700 group/card relative overflow-hidden">
                                        <div className="absolute -right-2 -bottom-2 text-gray-200/30 rotate-12 group-hover/card:-translate-y-2 transition-transform duration-[2s]">
                                            <ClipboardCheck className="h-16 w-16" />
                                        </div>
                                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 italic leading-none">Payload</p>
                                        <span className="text-3xl font-black text-gray-900 tracking-tighter italic leading-none relative z-10">{order.items.length} <span className="text-base text-gray-400">UNITS</span></span>
                                    </div>
                                    <div className="p-6 bg-gray-50/70 rounded-[2rem] border border-gray-100/50 hover:bg-white hover:shadow-xl transition-all duration-700 col-span-2 group/card relative overflow-hidden">
                                        <div className="absolute top-4 right-4 text-emerald-500/10">
                                            <Sparkles className="h-12 w-12" />
                                        </div>
                                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 italic leading-none">Chronology Feed</p>
                                        <span className="text-2xl font-black text-gray-900 tracking-tighter italic uppercase leading-none relative z-10">
                                            {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>

                                {expandedOrder === order._id && (
                                    <div className="mt-14 pt-14 border-t border-gray-100 animate-in fade-in slide-in-from-top-10 duration-1000">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                                            <div>
                                                <h4 className="text-[12px] font-black text-rose-600 uppercase tracking-[0.5em] mb-10 italic border-l-4 border-rose-600 pl-6 leading-none">Order Manifest Ledger</h4>
                                                <div className="space-y-4">
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} className="flex items-center justify-between p-6 bg-gray-50 rounded-[1.8rem] group/item hover:bg-white hover:shadow-2xl transition-all duration-700 border border-transparent hover:border-gray-100">
                                                            <div className="flex items-center gap-6">
                                                                <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-sm font-black text-rose-600 shadow-md ring-1 ring-gray-100 italic">
                                                                    {item.quantity}x
                                                                </div>
                                                                <span className="font-black text-gray-900 text-base uppercase tracking-tight italic group-hover/item:text-rose-600 transition-colors">{item.name}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-gray-900 font-black text-lg italic">
                                                                <IndianRupee className="h-4.5 w-4.5 text-rose-600" />
                                                                {(item.price * item.quantity).toFixed(2)}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-12">
                                                <div>
                                                    <h4 className="text-[12px] font-black text-rose-600 uppercase tracking-[0.5em] mb-6 italic border-l-4 border-rose-600 pl-6 leading-none">Logistics Destination</h4>
                                                    <div className="p-10 bg-gray-50/50 rounded-[2.5rem] border border-gray-100 relative overflow-hidden group/addr">
                                                        <MapPin className="absolute top-4 right-4 h-12 w-12 text-rose-900/5 group-hover/addr:-rotate-12 transition-transform duration-1000" />
                                                        <p className="text-base font-black text-gray-500 leading-relaxed italic relative z-10">
                                                            "{order.deliveryAddress}"
                                                        </p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="text-[12px] font-black text-rose-600 uppercase tracking-[0.5em] mb-6 italic border-l-4 border-rose-600 pl-6 leading-none">Customer Audit</h4>
                                                    {order.rating ? (
                                                        <div className="space-y-6">
                                                            <div className="flex items-center gap-3 bg-white p-4 rounded-3xl w-fit shadow-xl shadow-amber-900/5 border border-amber-50">
                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                    <div key={star} className={`flex items-center justify-center ${star <= order.rating ? 'text-amber-500' : 'text-gray-100'}`}>
                                                                        <CheckCircle2 className={`h-6 w-6 ${star <= order.rating ? 'fill-current' : ''}`} />
                                                                    </div>
                                                                ))}
                                                                <span className="text-[11px] font-black text-amber-600 uppercase ml-4 italic tracking-widest">{order.rating}/5 Impact Rating</span>
                                                            </div>
                                                            <div className="p-10 bg-amber-50/30 rounded-[2.5rem] border border-amber-100/50 relative overflow-hidden group/rating">
                                                                <p className="text-base font-black text-gray-900 italic leading-relaxed relative z-10">
                                                                    "{order.feedback || 'User provided no specific logistics commentary.'}"
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="p-10 bg-gray-50/30 rounded-[2.5rem] border-2 border-dashed border-gray-100 flex items-center justify-center gap-4 group/pending">
                                                            <Clock className="h-6 w-6 text-gray-200 group-hover/pending:animate-spin transition-all" />
                                                            <span className="text-xs font-black text-gray-300 uppercase tracking-[0.4em] italic leading-none">Awaiting Post-Fulfillment Audit</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="text-[12px] font-black text-rose-600 uppercase tracking-[0.5em] mb-6 italic border-l-4 border-rose-600 pl-6 leading-none">Financial Settlement</h4>
                                                    <div className="flex items-center gap-4">
                                                        <div className="px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] italic bg-emerald-600 text-white shadow-2xl shadow-emerald-900/20 border border-emerald-500 flex items-center gap-4">
                                                            <ClipboardCheck className="h-5 w-5" /> {order.paymentMethod.toUpperCase()} • DEPLOYMENT SETTLED
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
