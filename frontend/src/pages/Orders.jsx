import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Package, CheckCircle, ChevronDown, History, IndianRupee, Clock, Truck, Utensils, AlertCircle, Sparkles, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const STATUS_STEPS = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered'];

export function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrders, setExpandedOrders] = useState({});
    const [submittingFeedback, setSubmittingFeedback] = useState({});

    const fetchOrders = () => {
        api.orders.getUserOrders().then(data => {
            setOrders(data);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const toggleExpand = (orderId) => {
        setExpandedOrders(prev => ({ ...prev, [orderId]: !prev[orderId] }));
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return;
        try {
            await api.orders.cancelOrder(orderId);
            fetchOrders();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Failed to cancel order');
        }
    };

    const handleFeedbackSubmit = async (orderId, rating, feedback) => {
        setSubmittingFeedback(prev => ({ ...prev, [orderId]: true }));
        try {
            await api.orders.submitFeedback(orderId, { rating, feedback });
            fetchOrders();
        } catch (error) {
            console.error(error);
            alert('Failed to submit feedback');
        } finally {
            setSubmittingFeedback(prev => ({ ...prev, [orderId]: false }));
        }
    };

    const StatusIcon = ({ status, className }) => {
        switch (status) {
            case 'Pending': return <Clock className={className} />;
            case 'Preparing': return <Utensils className={className} />;
            case 'Out for Delivery': return <Truck className={className} />;
            case 'Delivered': return <CheckCircle className={className} />;
            default: return <Package className={className} />;
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-6">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-rose-600 border-solid"></div>
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest italic">Syncing History...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fafafa] pb-32">
            {/* Header Sticky Container - Balanced Plus */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-[90px] z-[40]">
                <div className="max-w-7xl mx-auto px-8 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div>
                            <div className="flex items-center gap-4 mb-3">
                                <div className="h-2.5 w-2.5 rounded-full bg-rose-600 animate-pulse" />
                                <span className="text-[11px] font-black text-rose-600 uppercase tracking-[0.4em] italic">Orders Archive</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">
                                My Flavor <span className="text-rose-600">History.</span>
                            </h1>
                        </div>
                        <div className="flex items-center gap-6 px-8 py-4 bg-gray-50 rounded-[2rem] border border-gray-100 italic shadow-inner">
                            <div className="flex flex-col text-right">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">Global Status</span>
                                <span className="text-sm font-black text-gray-900 tracking-tight">{orders.length} Active Sessions</span>
                            </div>
                            <History className="h-7 w-7 text-rose-600" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-8 mt-16 space-y-10">
                {orders.length === 0 ? (
                    <div className="text-center p-32 bg-white rounded-[4rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                        <Package className="h-24 w-24 text-gray-50 mb-10" />
                        <h2 className="text-3xl font-black text-gray-200 uppercase tracking-widest italic tracking-tighter mb-8">No Records Found</h2>
                        <Link to="/" className="px-12 py-5 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-700 transition-all shadow-xl shadow-rose-200/50">Start Your Journey</Link>
                    </div>
                ) : (
                    orders.map(order => {
                        const currentStatusIdx = STATUS_STEPS.indexOf(order.status);
                        const isCancelled = order.status === 'Cancelled';
                        const isDelivered = order.status === 'Delivered';
                        const isExpanded = expandedOrders[order._id];

                        return (
                            <div key={order._id} className="group bg-white rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-black/[0.03] transition-all duration-700 overflow-hidden">
                                <div className="p-10 md:p-12 cursor-pointer" onClick={() => toggleExpand(order._id)}>
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-10">
                                        <div className="flex items-center gap-8">
                                            <div className={`h-16 w-16 rounded-[1.8rem] flex items-center justify-center transition-all ${isCancelled ? 'bg-red-50 text-red-500 shadow-inner' :
                                                isDelivered ? 'bg-emerald-50 text-emerald-600 shadow-inner' :
                                                    'bg-rose-50 text-rose-600 shadow-inner'
                                                }`}>
                                                <StatusIcon status={order.status} className="h-7 w-7" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-4 mb-2">
                                                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] italic">Session ID</span>
                                                    <code className="text-[11px] font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-xl shadow-sm">#{order._id.slice(-6).toUpperCase()}</code>
                                                </div>
                                                <div className="flex items-center gap-5">
                                                    <h3 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">
                                                        {order?.createdAt ? new Date(order.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : 'Unknown Date'}
                                                    </h3>
                                                    {isDelivered && order.rating && (
                                                        <div className="flex items-center gap-2 px-4 py-1.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-100 italic shadow-sm">
                                                            <Star className="h-4 w-4 fill-current" />
                                                            <span className="text-xs font-black">{order.rating}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-10">
                                            <div className="text-right">
                                                <p className="text-[11px] text-gray-400 font-black uppercase tracking-widest mb-1.5 italic opacity-60">Impact</p>
                                                <div className="flex items-center justify-end gap-2 font-black text-gray-900 italic">
                                                    <IndianRupee className="h-5 w-5 text-rose-600" />
                                                    <span className="text-4xl tracking-tighter leading-none">{order.totalAmount.toFixed(2)}</span>
                                                </div>
                                            </div>
                                            <div className={`p-5 rounded-2xl transition-all duration-500 ${isExpanded ? 'bg-rose-600 text-white rotate-180 shadow-2xl shadow-rose-900/20' : 'bg-gray-50 text-gray-400 group-hover:bg-rose-50 group-hover:text-rose-600 shadow-md transform hover:scale-110'}`}>
                                                <ChevronDown className="h-6 w-6" />
                                            </div>
                                        </div>
                                    </div>

                                    {!isExpanded && !isCancelled && (
                                        <div className={`flex items-center gap-4 px-6 py-2.5 rounded-2xl w-fit border shadow-sm transition-all ${isDelivered ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'
                                            }`}>
                                            {!isDelivered && <div className="h-2.5 w-2.5 rounded-full bg-rose-600 animate-pulse" />}
                                            <span className="text-[11px] font-black uppercase tracking-[0.2em] italic leading-none">{order.status}</span>
                                        </div>
                                    )}

                                    {isExpanded && (
                                        <div className="mt-12 pt-12 border-t border-gray-100 animate-in fade-in slide-in-from-top-10 duration-700">
                                            {/* Status Timeline - Balanced Plus */}
                                            {!isCancelled && (
                                                <div className="mb-20 px-6">
                                                    <div className="grid grid-cols-4 relative pt-6 pb-4">
                                                        <div className="absolute top-1/2 left-0 w-full h-[4px] bg-gray-50 -translate-y-1/2 -z-10 rounded-full overflow-hidden shadow-inner">
                                                            <div
                                                                className={`h-full transition-all duration-1000 ${isDelivered ? 'bg-emerald-500' : 'bg-rose-600'}`}
                                                                style={{ width: `${(currentStatusIdx / (STATUS_STEPS.length - 1)) * 100}%` }}
                                                            />
                                                        </div>
                                                        {STATUS_STEPS.map((step, idx) => {
                                                            const isCompleted = idx <= currentStatusIdx;
                                                            const isCurrent = idx === currentStatusIdx;
                                                            return (
                                                                <div key={step} className="flex flex-col items-center text-center group/step">
                                                                    <div className={`h-16 w-16 rounded-[1.5rem] flex items-center justify-center border-2 transition-all duration-700 shadow-md ${isCompleted ? (isDelivered ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-rose-600 border-rose-600 text-white') :
                                                                        'bg-white border-gray-100 text-gray-200'
                                                                        } ${isCurrent ? 'scale-125 shadow-2xl ring-8 ring-rose-50' : ''}`}>
                                                                        {idx === 0 && <Clock className="h-6 w-6" />}
                                                                        {idx === 1 && <Utensils className="h-6 w-6" />}
                                                                        {idx === 2 && <Truck className="h-6 w-6" />}
                                                                        {idx === 3 && <CheckCircle className="h-6 w-6" />}
                                                                    </div>
                                                                    <span className={`text-[10px] font-black uppercase tracking-[0.3em] mt-8 italic transition-colors ${isCompleted ? 'text-gray-900' : 'text-gray-300'}`}>
                                                                        {step}
                                                                    </span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Feedback & Rating - Multi-scale */}
                                            {isDelivered && (
                                                <div className="mb-16 bg-gray-50/50 p-10 rounded-[3rem] border border-gray-100 relative overflow-hidden shadow-inner">
                                                    <h4 className="text-[11px] font-black text-amber-600 uppercase tracking-[0.4em] mb-8 italic flex items-center gap-4">
                                                        <Sparkles className="h-5 w-5" /> Satisfaction Protocol
                                                    </h4>

                                                    {!order.rating ? (
                                                        <div className="flex items-center gap-6">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <button
                                                                    key={star}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        const feedback = prompt('Share your culinary thoughts:');
                                                                        if (feedback !== null) handleFeedbackSubmit(order._id, star, feedback);
                                                                    }}
                                                                    className="p-4 bg-white rounded-2xl border border-gray-100 text-gray-100 hover:text-amber-500 hover:border-amber-400 hover:scale-110 transition-all shadow-xl group/star"
                                                                >
                                                                    <Star className="h-8 w-8 group-hover/star:fill-current" />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-6">
                                                            <div className="flex items-center gap-2.5">
                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                    <Star key={star} className={`h-5 w-5 ${star <= order.rating ? 'text-amber-500 fill-current' : 'text-gray-100'}`} />
                                                                ))}
                                                            </div>
                                                            <div className="p-7 bg-white rounded-2xl border border-gray-100 shadow-sm leading-relaxed relative">
                                                                <div className="absolute top-4 right-4 text-amber-500/10"><Sparkles className="h-12 w-12" /></div>
                                                                <p className="text-base font-bold text-gray-700 italic relative z-10">"{order.feedback || 'Exceptional service experience.'}"</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                                                <div>
                                                    <h4 className="text-[11px] font-black text-rose-600 uppercase tracking-[0.4em] mb-8 italic border-l-4 border-rose-600 pl-4">Inventory Ledger</h4>
                                                    <div className="space-y-4">
                                                        {order?.items?.map((item, index) => (
                                                            <div key={index} className="flex justify-between items-center p-6 bg-gray-50/50 rounded-2xl border border-gray-100/50 hover:bg-white hover:shadow-xl transition-all group/item">
                                                                <div className="flex flex-col">
                                                                    <span className="font-black text-gray-900 uppercase text-base tracking-tight italic group-hover/item:text-rose-600 transition-colors">{item?.name}</span>
                                                                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-2 italic flex items-center gap-2">
                                                                        <div className="h-1.5 w-1.5 rounded-full bg-rose-500/30" /> {item?.quantity} UNITS @ ₹{(item?.price || 0).toFixed(2)}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-1.5 font-black text-xl text-gray-900 italic">
                                                                    <IndianRupee className="h-5 w-5 text-rose-600" />
                                                                    <span>{((item?.price || 0) * (item?.quantity || 0)).toFixed(2)}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="space-y-12">
                                                    <div>
                                                        <h4 className="text-[11px] font-black text-rose-600 uppercase tracking-[0.4em] mb-6 italic border-l-4 border-rose-600 pl-4">Shipment Destination</h4>
                                                        <div className="text-gray-500 bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 font-bold text-base italic leading-relaxed shadow-inner">
                                                            {order.deliveryAddress}
                                                        </div>
                                                    </div>

                                                    <div className="p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-100 flex justify-between items-center shadow-sm relative overflow-hidden group/card shadow-inner">
                                                        <div className="absolute inset-0 bg-gradient-to-r from-rose-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        <div className="flex items-center gap-6 z-10">
                                                            <div className="bg-rose-50 p-4.5 rounded-2xl border border-rose-100">
                                                                <Truck className="h-6 w-6 text-rose-600" />
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.4em] mb-1.5 italic">Capital Exchange</p>
                                                                <span className="text-lg font-black italic tracking-wide text-gray-900">{order.paymentMethod}</span>
                                                            </div>
                                                        </div>
                                                        <div className="z-10 bg-emerald-50 text-emerald-600 px-5 py-2 rounded-full border border-emerald-100 text-[10px] font-black uppercase tracking-widest italic">Processed</div>
                                                    </div>

                                                    {order.status === 'Pending' && (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleCancelOrder(order._id); }}
                                                            className="w-full py-6 bg-red-50 text-red-600 rounded-[2rem] border-2 border-dashed border-red-200 font-black text-[11px] uppercase tracking-[0.3em] hover:bg-red-600 hover:text-white hover:border-solid hover:shadow-2xl transition-all active:scale-95 italic group/cancel shadow-xl shadow-red-100/50"
                                                        >
                                                            Abort Deployment <ArrowRight className="inline-block h-4 w-4 ml-3 opacity-0 group-hover/cancel:opacity-100 group-hover/cancel:translate-x-2 transition-all" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
