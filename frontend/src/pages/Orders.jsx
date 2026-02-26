import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Package, CheckCircle, ChevronDown, History, IndianRupee, Clock, Truck, Utensils, AlertCircle, Sparkles, Star } from 'lucide-react';
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
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-rose-600 border-solid"></div>
                <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest italic">Syncing History...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fafafa] pb-24">
            {/* Header Sticky Container - Compact */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-[73px] z-[40]">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <div className="h-1 w-1 rounded-full bg-rose-600 animate-pulse" />
                                <span className="text-[8px] font-black text-rose-600 uppercase tracking-[0.3em] italic">Orders Archive</span>
                            </div>
                            <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">
                                My Flavor <span className="text-rose-600">History.</span>
                            </h1>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100 italic">
                            <div className="flex flex-col text-right">
                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Global Status</span>
                                <span className="text-[10px] font-black text-gray-900 tracking-tight">{orders.length} Active Sessions</span>
                            </div>
                            <History className="h-5 w-5 text-rose-600" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 mt-8 space-y-6">
                {orders.length === 0 ? (
                    <div className="text-center p-20 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                        <Package className="h-16 w-16 text-gray-100 mb-6" />
                        <h2 className="text-xl font-black text-gray-200 uppercase tracking-widest italic tracking-tighter mb-4">No Records Found</h2>
                        <Link to="/" className="px-8 py-3 bg-rose-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg">Start Your Journey</Link>
                    </div>
                ) : (
                    orders.map(order => {
                        const currentStatusIdx = STATUS_STEPS.indexOf(order.status);
                        const isCancelled = order.status === 'Cancelled';
                        const isDelivered = order.status === 'Delivered';
                        const isExpanded = expandedOrders[order._id];

                        return (
                            <div key={order._id} className="group bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/30 transition-all duration-500 overflow-hidden">
                                <div className="p-6 md:p-8 cursor-pointer" onClick={() => toggleExpand(order._id)}>
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
                                        <div className="flex items-center gap-5">
                                            <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-colors ${isCancelled ? 'bg-red-50 text-red-500' :
                                                    isDelivered ? 'bg-emerald-50 text-emerald-600' :
                                                        'bg-rose-50 text-rose-600'
                                                }`}>
                                                <StatusIcon status={order.status} className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">Session ID</span>
                                                    <code className="text-[8px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">#{order._id.slice(-6).toUpperCase()}</code>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter italic">
                                                        {order?.createdAt ? new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown Date'}
                                                    </h3>
                                                    {isDelivered && order.rating && (
                                                        <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-600 rounded-md border border-amber-100 italic">
                                                            <Star className="h-2.5 w-2.5 fill-current" />
                                                            <span className="text-[9px] font-black">{order.rating}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest mb-0.5 italic">Impact</p>
                                                <div className="flex items-center justify-end gap-1 font-black text-gray-900 italic">
                                                    <IndianRupee className="h-3 w-3 text-rose-600" />
                                                    <span className="text-2xl tracking-tighter">{order.totalAmount.toFixed(2)}</span>
                                                </div>
                                            </div>
                                            <div className={`p-3 rounded-xl transition-all ${isExpanded ? 'bg-gray-900 text-white rotate-180' : 'bg-gray-50 text-gray-400 group-hover:bg-rose-50 group-hover:text-rose-600'}`}>
                                                <ChevronDown className="h-4 w-4" />
                                            </div>
                                        </div>
                                    </div>

                                    {!isExpanded && !isCancelled && (
                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg w-fit border transition-all ${isDelivered ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'
                                            }`}>
                                            {!isDelivered && <div className="h-1.5 w-1.5 rounded-full bg-rose-600 animate-pulse" />}
                                            <span className="text-[9px] font-black uppercase tracking-widest italic">{order.status}</span>
                                        </div>
                                    )}

                                    {isExpanded && (
                                        <div className="mt-8 pt-8 border-t border-gray-100 animate-in slide-in-from-top-4 duration-500">
                                            {/* Status Timeline - Compact */}
                                            {!isCancelled && (
                                                <div className="mb-12 px-2">
                                                    <div className="grid grid-cols-4 relative pt-4 pb-2">
                                                        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gray-50 -translate-y-1/2 -z-10 rounded-full">
                                                            <div
                                                                className={`h-full transition-all duration-1000 ${isDelivered ? 'bg-emerald-500' : 'bg-rose-600'}`}
                                                                style={{ width: `${(currentStatusIdx / (STATUS_STEPS.length - 1)) * 100}%` }}
                                                            />
                                                        </div>
                                                        {STATUS_STEPS.map((step, idx) => {
                                                            const isCompleted = idx <= currentStatusIdx;
                                                            const isCurrent = idx === currentStatusIdx;
                                                            return (
                                                                <div key={step} className="flex flex-col items-center text-center">
                                                                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center border transition-all duration-700 shadow-sm ${isCompleted ? (isDelivered ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-rose-600 border-rose-600 text-white') :
                                                                            'bg-white border-gray-100 text-gray-200'
                                                                        } ${isCurrent ? 'scale-110 shadow-md ring-2 ring-rose-50' : ''}`}>
                                                                        {idx === 0 && <Clock className="h-3.5 w-3.5" />}
                                                                        {idx === 1 && <Utensils className="h-3.5 w-3.5" />}
                                                                        {idx === 2 && <Truck className="h-3.5 w-3.5" />}
                                                                        {idx === 3 && <CheckCircle className="h-3.5 w-3.5" />}
                                                                    </div>
                                                                    <span className={`text-[7px] font-black uppercase tracking-widest mt-4 italic ${isCompleted ? 'text-gray-900' : 'text-gray-300'}`}>
                                                                        {step}
                                                                    </span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Feedback & Rating - Compact */}
                                            {isDelivered && (
                                                <div className="mb-10 bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100 relative overflow-hidden">
                                                    <h4 className="text-[8px] font-black text-amber-600 uppercase tracking-[0.2em] mb-4 italic flex items-center gap-2">
                                                        <Sparkles className="h-3 w-3" /> Satisfaction Protocol
                                                    </h4>

                                                    {!order.rating ? (
                                                        <div className="flex items-center gap-3">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <button
                                                                    key={star}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        const feedback = prompt('Share your culinary thoughts:');
                                                                        handleFeedbackSubmit(order._id, star, feedback);
                                                                    }}
                                                                    className="p-2 bg-white rounded-lg border border-gray-100 text-gray-200 hover:text-amber-500 hover:border-amber-200 transition-all shadow-sm"
                                                                >
                                                                    <Star className="h-4 w-4 hover:fill-current" />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-1">
                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                    <Star key={star} className={`h-3 w-3 ${star <= order.rating ? 'text-amber-500 fill-current' : 'text-gray-100'}`} />
                                                                ))}
                                                            </div>
                                                            <p className="text-xs font-bold text-gray-700 italic">"{order.feedback || 'Exceptional service.'}"</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                                <div>
                                                    <h4 className="text-[8px] font-black text-rose-600 uppercase tracking-[0.3em] mb-4 italic">Inventory Ledger</h4>
                                                    <div className="space-y-2">
                                                        {order?.items?.map((item, index) => (
                                                            <div key={index} className="flex justify-between items-center p-3 bg-gray-50/50 rounded-xl border border-transparent hover:border-gray-100 transition-all">
                                                                <div className="flex flex-col">
                                                                    <span className="font-black text-gray-800 uppercase text-xs tracking-tight italic">{item?.name}</span>
                                                                    <span className="text-[7px] text-gray-400 font-black uppercase tracking-widest mt-0.5 italic">
                                                                        {item?.quantity} UNITS @ ₹{(item?.price || 0).toFixed(2)}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-0.5 font-black text-sm text-gray-900 italic">
                                                                    <IndianRupee className="h-3 w-3" />
                                                                    <span>{((item?.price || 0) * (item?.quantity || 0)).toFixed(2)}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="space-y-8">
                                                    <div>
                                                        <h4 className="text-[8px] font-black text-rose-600 uppercase tracking-[0.3em] mb-3 italic">Destination</h4>
                                                        <div className="text-gray-500 bg-gray-100/50 p-4 rounded-xl border border-gray-100 font-bold text-xs italic border-l-2 border-l-rose-600">
                                                            {order.deliveryAddress}
                                                        </div>
                                                    </div>

                                                    <div className="p-5 bg-gray-900 rounded-2xl text-white flex justify-between items-center shadow-lg relative overflow-hidden group/card shadow-gray-200">
                                                        <div className="flex items-center gap-4 z-10">
                                                            <div className="bg-white/10 p-2.5 rounded-xl border border-white/20">
                                                                <Truck className="h-4 w-4 text-rose-50" />
                                                            </div>
                                                            <div>
                                                                <p className="text-[7px] text-gray-500 font-black uppercase tracking-[0.2em] italic">Settlement</p>
                                                                <span className="text-sm font-black italic">{order.paymentMethod}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {order.status === 'Pending' && (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleCancelOrder(order._id); }}
                                                            className="w-full py-4 bg-red-50 text-red-600 rounded-xl border border-dashed border-red-200 font-black text-[8px] uppercase tracking-widest hover:bg-red-600 hover:text-white hover:border-solid transition-all active:scale-95 italic"
                                                        >
                                                            Cancel Request
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
