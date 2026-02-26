import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Package, IndianRupee, Eye, ListFilter } from 'lucide-react';

export function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [filterStatus, setFilterStatus] = useState('All');

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

    const filteredOrders = orders.filter(o => filterStatus === 'All' || o.status === filterStatus);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-6">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-rose-600 border-solid"></div>
                <p className="text-gray-400 font-black text-xs uppercase tracking-[0.3em] italic">Fetching Order Vault...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fafafa] pb-24 animate-in fade-in duration-700">
            {/* Header Sticky Container - Balanced */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-[73px] z-[40]">
                <div className="max-w-7xl mx-auto px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div>
                            <div className="flex items-center gap-2.5 mb-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-rose-600 animate-pulse" />
                                <span className="text-[10px] font-black text-rose-600 uppercase tracking-[0.4em] italic leading-none">Logistics Feed</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">
                                Fulfillment <span className="text-rose-600">Sync.</span>
                            </h1>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-2 bg-gray-100/50 p-1.5 rounded-2xl border border-gray-200">
                            {['All', 'Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === status
                                        ? 'bg-white text-rose-600 shadow-sm ring-1 ring-gray-100/10'
                                        : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-8 mt-12 space-y-8">
                {filteredOrders.length === 0 ? (
                    <div className="text-center p-24 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                        <Package className="h-14 w-14 text-gray-100 mb-8" />
                        <h2 className="text-2xl font-black text-gray-200 uppercase tracking-widest italic tracking-tighter">No Tickets Active</h2>
                    </div>
                ) : (
                    filteredOrders.map((order) => (
                        <div key={order._id} className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-black/[0.02] transition-all duration-500 overflow-hidden">
                            <div className="p-8 md:p-10">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8">
                                    <div className="flex items-center gap-6">
                                        <div className="h-14 w-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-rose-50 group-hover:text-rose-600 transition-colors">
                                            <Package className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2.5 mb-1">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Ticket ID</span>
                                                <code className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg">#{order._id.slice(-6).toUpperCase()}</code>
                                            </div>
                                            <h3 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tighter italic">{order.userId?.name || 'Guest User'}</h3>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 w-full md:w-auto">
                                        <div className="flex-1 md:flex-none">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                className={`w-full md:w-48 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest border transition-all outline-none cursor-pointer ${order.status === 'Cancelled' ? 'bg-red-50 border-red-100 text-red-600' :
                                                    order.status === 'Delivered' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                                                        'bg-rose-50 border-rose-100 text-rose-600'
                                                    }`}
                                            >
                                                {['Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'].map(s => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <button
                                            onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                                            className="p-3.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-900 hover:text-white transition-all shadow-sm"
                                        >
                                            <Eye className={`h-5 w-5 transition-transform duration-500 ${expandedOrder === order._id ? 'rotate-180' : ''}`} />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-1">
                                    <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Total Value</p>
                                        <div className="flex items-center gap-1.5 text-gray-900">
                                            <IndianRupee className="h-4 w-4 text-rose-600" />
                                            <span className="text-xl md:text-2xl font-black tracking-tighter italic">{order.totalAmount.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Items</p>
                                        <span className="text-xl md:text-2xl font-black text-gray-900 tracking-tighter italic">{order.items.length} Units</span>
                                    </div>
                                    <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 col-span-2">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Timestamp</p>
                                        <span className="text-xl md:text-2xl font-black text-gray-900 tracking-tighter italic">
                                            {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>

                                {expandedOrder === order._id && (
                                    <div className="mt-10 pt-10 border-t border-gray-100 animate-in slide-in-from-top-6 duration-500">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                            <div>
                                                <h4 className="text-[11px] font-black text-rose-600 uppercase tracking-[0.3em] mb-6 italic">Order Manifest</h4>
                                                <div className="space-y-3">
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group/item hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-gray-100">
                                                            <div className="flex items-center gap-4">
                                                                <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-[11px] font-black text-gray-400 ring-1 ring-gray-100 italic">
                                                                    {item.quantity}x
                                                                </div>
                                                                <span className="font-bold text-gray-900 text-sm uppercase tracking-tight">{item.name}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1 text-gray-600 font-bold text-sm italic">
                                                                <IndianRupee className="h-3.5 w-3.5" />
                                                                {(item.price * item.quantity).toFixed(2)}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-8">
                                                <div>
                                                    <h4 className="text-[11px] font-black text-rose-600 uppercase tracking-[0.3em] mb-4 italic">Logistics Address</h4>
                                                    <p className="text-sm font-medium text-gray-500 leading-relaxed italic border-l-4 border-rose-100 pl-6">
                                                        {order.deliveryAddress}
                                                    </p>
                                                </div>
                                                <div>
                                                    <h4 className="text-[11px] font-black text-rose-600 uppercase tracking-[0.3em] mb-4 italic">Customer Feedback</h4>
                                                    {order.rating ? (
                                                        <div className="space-y-4">
                                                            <div className="flex items-center gap-2">
                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                    <div key={star} className={`h-4 w-4 rounded-lg flex items-center justify-center ${star <= order.rating ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-300'}`}>
                                                                        <Package className="h-2.5 w-2.5 fill-current" />
                                                                    </div>
                                                                ))}
                                                                <span className="text-[10px] font-black text-amber-600 uppercase ml-2 italic">{order.rating}/5 Impact</span>
                                                            </div>
                                                            <p className="text-sm font-bold text-gray-900 bg-gray-50 p-4 rounded-2xl border border-gray-100 italic leading-relaxed">
                                                                "{order.feedback || 'No commentary provided.'}"
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div className="p-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 text-center">
                                                            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest italic">Pending Feedback</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="text-[11px] font-black text-rose-600 uppercase tracking-[0.3em] mb-4 italic">Payment Context</h4>
                                                    <div className="flex items-center gap-2">
                                                        <div className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest italic bg-emerald-50 text-emerald-600 border border-emerald-100">
                                                            {order.paymentMethod.toUpperCase()} • SETTLED
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
