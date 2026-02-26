import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Store, Users, IndianRupee, Sparkles, Activity, Package, ArrowRight, Settings } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export function AdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalRestaurants: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: '0.00'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.admin.getStats().then(data => {
            setStats(data);
            setLoading(false);
        }).catch(err => {
            console.error('Failed to fetch stats:', err);
            setLoading(false);
        });
    }, []);

    const isOwner = user?.role === 'owner';

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-rose-600 border-solid"></div>
                <p className="text-gray-400 font-black text-xs uppercase tracking-[0.4em] italic leading-none">Accessing Central Metrics...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fafafa] pb-32 animate-in fade-in duration-1000">
            {/* Header section - Mid-Plus Balanced */}
            <div className="bg-white border-b border-gray-100 pt-16 pb-12 px-10 mb-16 shadow-sm">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-10">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <Sparkles className="h-5 w-5 text-rose-500" />
                            <span className="text-[11px] font-black text-rose-600 uppercase tracking-[0.5em] italic">Command Center Protocol</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter italic leading-tight">
                            System <span className="text-rose-600">Performance.</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-6 bg-gray-50/80 p-3 rounded-[1.5rem] border border-gray-100 shadow-inner">
                        <div className="px-6 py-3 bg-white rounded-xl shadow-md border border-gray-50">
                            <span className="text-[11px] font-black text-gray-900 uppercase tracking-widest leading-none italic">Real-Time Synthesis</span>
                        </div>
                        <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {(!isOwner || user?.role === 'admin') && (
                        <div className="group bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-rose-100/40 transition-all duration-700 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 text-rose-600/5 rotate-12 group-hover:-rotate-6 transition-transform duration-1000">
                                <Store className="h-32 w-32" />
                            </div>
                            <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6 italic">Portfolio Density</p>
                            <p className="text-5xl font-black text-gray-900 italic tracking-tighter mb-2 relative z-10">{stats?.totalRestaurants || 0}</p>
                            <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest italic opacity-70">Active Brand Units</span>
                        </div>
                    )}

                    <div className="group bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-700 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 text-gray-900/5 rotate-12 group-hover:-rotate-6 transition-transform duration-1000">
                            <Package className="h-32 w-32" />
                        </div>
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6 italic">Fulfillment Flow</p>
                        <p className="text-5xl font-black text-gray-900 italic tracking-tighter mb-2 relative z-10">{stats?.totalOrders || 0}</p>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic opacity-70">Synchronized Tickets</span>
                    </div>

                    {user?.role === 'admin' && (
                        <div className="group bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-700 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 text-gray-900/5 rotate-12 group-hover:-rotate-6 transition-transform duration-1000">
                                <Users className="h-32 w-32" />
                            </div>
                            <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6 italic">Network Reach</p>
                            <p className="text-5xl font-black text-gray-900 italic tracking-tighter mb-2 relative z-10">{stats?.totalUsers || 0}</p>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic opacity-70">Registered Identities</span>
                        </div>
                    )}

                    <div className="group bg-gradient-to-br from-rose-600 to-rose-700 p-10 rounded-[3.5rem] shadow-[0_50px_100px_rgba(225,29,72,0.3)] transition-all duration-700 relative overflow-hidden border border-white/10 text-white">
                        <div className="absolute top-0 right-0 p-10 text-white opacity-10 rotate-12 group-hover:scale-125 transition-transform duration-1000">
                            <IndianRupee className="h-40 w-40" />
                        </div>
                        <p className="text-[11px] font-black text-rose-100 uppercase tracking-[0.3em] mb-6 italic">Revenue Extraction</p>
                        <div className="flex items-center gap-2 mb-2 relative z-10">
                            <IndianRupee className="h-8 w-8 text-white font-black ml-[-4px]" />
                            <p className="text-5xl font-black italic tracking-tighter">{stats?.totalRevenue || '0.00'}</p>
                        </div>
                        <span className="text-[10px] font-black text-rose-100 uppercase tracking-widest italic opacity-60">Net Settlement Total</span>
                    </div>
                </div>
            </div>

            {/* Operational Manifest - Mid-Plus */}
            <div className="max-w-7xl mx-auto px-10 mt-24">
                <div className="flex items-center gap-8 mb-16">
                    <h3 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.5em] italic border-l-4 border-rose-600 pl-8 leading-none">Operational Manifest</h3>
                    <div className="flex-1 h-px bg-gray-100" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    <Link to="/admin/restaurants" className="group p-12 bg-white rounded-[3.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:border-rose-100 transition-all duration-500">
                        <div className="flex items-start justify-between mb-16">
                            <div className="p-6 bg-rose-50 text-rose-600 rounded-[1.8rem] group-hover:rotate-12 transition-transform shadow-xl shadow-rose-100/50">
                                <Store className="h-10 w-10" />
                            </div>
                            <ArrowRight className="h-7 w-7 text-gray-200 group-hover:text-rose-600 group-hover:translate-x-3 transition-all duration-500" />
                        </div>
                        <h4 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic mb-4 leading-none">Establishment <span className="text-rose-600">Core.</span></h4>
                        <p className="text-gray-400 font-bold text-sm leading-relaxed italic opacity-70">Deploy and refine your restaurant portfolio. Manage enterprise branding and asset locations.</p>
                    </Link>

                    <Link to="/admin/orders" className="group p-12 bg-white rounded-[3.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:border-rose-100 transition-all duration-500">
                        <div className="flex items-start justify-between mb-16">
                            <div className="p-6 bg-rose-600 text-white rounded-[1.8rem] group-hover:rotate-12 transition-transform shadow-xl shadow-rose-900/20 border border-white/10">
                                <Package className="h-10 w-10" />
                            </div>
                            <ArrowRight className="h-7 w-7 text-gray-200 group-hover:text-rose-600 group-hover:translate-x-3 transition-all duration-500" />
                        </div>
                        <h4 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic mb-4 leading-tight">Logistics <span className="text-rose-600">Sync.</span></h4>
                        <p className="text-gray-400 font-bold text-sm leading-relaxed italic opacity-70">Monitor fulfillment cycles. Master order synchronization across the globalized delivery network.</p>
                    </Link>

                    <Link to="/admin/orders" state={{ filter: 'Feedback' }} className="group p-12 bg-white rounded-[3.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all text-left duration-500">
                        <div className="flex items-start justify-between mb-16">
                            <div className="p-6 bg-emerald-50 text-emerald-600 rounded-[1.8rem] group-hover:rotate-12 transition-transform shadow-xl shadow-emerald-100/50">
                                <Sparkles className="h-10 w-10" />
                            </div>
                            <ArrowRight className="h-7 w-7 text-gray-200 group-hover:text-emerald-600 group-hover:translate-x-3 transition-all duration-500" />
                        </div>
                        <h4 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic mb-4 leading-none">User <span className="text-emerald-600 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400">Voice.</span></h4>
                        <p className="text-gray-400 font-bold text-sm leading-relaxed italic opacity-70">Review ratings and critical feedback from the elite user base.</p>
                    </Link>
                </div>

                {isOwner && (
                    <div className="mt-24 p-16 bg-white rounded-[4rem] border border-gray-100 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-16 group overflow-hidden relative border-t-8 border-t-rose-600">
                        <div className="absolute top-0 right-0 p-12 text-rose-600/5 rotate-12 group-hover:rotate-45 transition-transform duration-[3s]">
                            <Activity className="h-56 w-56" />
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-12 relative z-10 text-center md:text-left">
                            <div className="bg-rose-50 p-8 rounded-[2rem] group-hover:scale-110 transition-all shadow-xl shadow-rose-100/50">
                                <Activity className="h-16 w-16 text-rose-600 shadow-sm" />
                            </div>
                            <div className="max-w-2xl">
                                <h3 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter mb-4 leading-none">Enterprise Advisor</h3>
                                <p className="text-gray-400 font-black text-[12px] uppercase tracking-[0.4em] leading-relaxed italic opacity-80">
                                    "Dynamic pricing models currently trending. Scaling your signature menu weekly correlates to 1.4x higher capital retention."
                                </p>
                            </div>
                        </div>
                        <button className="bg-rose-600 text-white px-14 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.4em] shadow-2xl shadow-rose-900/10 hover:bg-rose-700 transition-all active:scale-95 relative z-10 italic">Deploy Strategy</button>
                    </div>
                )}
            </div>
        </div>
    );
}
