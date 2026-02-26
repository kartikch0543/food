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
            <div className="flex flex-col items-center gap-6">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-rose-600 border-solid"></div>
                <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] italic">Synchronizing Metrics...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fafafa] pb-24 animate-in fade-in duration-700">
            {/* Header section - Compact Thinner */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-[73px] z-40">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[8px] font-black text-rose-600 uppercase tracking-[0.4em] italic bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100/50">Command</span>
                            </div>
                            <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">
                                Performance <span className="text-rose-600">Metric.</span>
                            </h1>
                        </div>
                        <div className="flex items-center gap-3 bg-gray-100/50 p-1.5 rounded-xl border border-gray-200">
                            <div className="px-4 py-1.5 bg-white rounded-lg shadow-sm">
                                <span className="text-[9px] font-black text-gray-900 uppercase tracking-widest">Real-time</span>
                            </div>
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse mr-1" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {(!isOwner || user?.role === 'admin') && (
                        <div className="group bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 text-rose-50 opacity-20 transition-transform">
                                <Store className="h-12 w-12" />
                            </div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Portfolio</p>
                            <p className="text-3xl font-black text-gray-900 italic tracking-tighter mb-0.5">{stats?.totalRestaurants || 0}</p>
                            <span className="text-[8px] font-bold text-rose-500 uppercase tracking-widest">Active Brands</span>
                        </div>
                    )}

                    <div className="group bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 text-gray-100 opacity-20 transition-transform">
                            <Package className="h-12 w-12" />
                        </div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Fulfillment</p>
                        <p className="text-3xl font-black text-gray-900 italic tracking-tighter mb-0.5">{stats?.totalOrders || 0}</p>
                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Processed Tickets</span>
                    </div>

                    {user?.role === 'admin' && (
                        <div className="group bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 text-gray-100 opacity-20 transition-transform">
                                <Users className="h-12 w-12" />
                            </div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Network Reach</p>
                            <p className="text-3xl font-black text-gray-900 italic tracking-tighter mb-0.5">{stats?.totalUsers || 0}</p>
                            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Registered Users</span>
                        </div>
                    )}

                    <div className="group bg-rose-600 p-6 rounded-[1.5rem] shadow-lg shadow-rose-200 transition-all duration-500 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 text-rose-400 opacity-30 transition-transform">
                            <IndianRupee className="h-12 w-12" />
                        </div>
                        <p className="text-[9px] font-black text-rose-200 uppercase tracking-widest mb-3">Revenue Flow</p>
                        <div className="flex items-center gap-1 text-white">
                            <IndianRupee className="h-4 w-4 font-black" />
                            <p className="text-3xl font-black italic tracking-tighter">{stats?.totalRevenue || '0.00'}</p>
                        </div>
                        <span className="text-[8px] font-bold text-rose-200 uppercase tracking-widest">Net Acquisitions</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions - Compact Manifest */}
            <div className="max-w-7xl mx-auto px-6 mt-12">
                <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8 italic pl-2 border-l-2 border-rose-600 ml-1">Operational Manifest</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <Link to="/admin/restaurants" className="group p-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                        <div className="flex items-start justify-between mb-8">
                            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl group-hover:rotate-12 transition-transform">
                                <Store className="h-6 w-6" />
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-200 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
                        </div>
                        <h4 className="text-lg font-black text-gray-900 uppercase tracking-tighter italic mb-2">Establishment <span className="text-rose-600">Core.</span></h4>
                        <p className="text-gray-400 text-[10px] font-medium leading-relaxed italic opacity-80">Deploy and refine your restaurant portfolio. Manage branding and locations.</p>
                    </Link>

                    <Link to="/admin/orders" className="group p-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                        <div className="flex items-start justify-between mb-8">
                            <div className="p-3 bg-gray-50 text-gray-900 rounded-xl group-hover:rotate-12 transition-transform">
                                <Package className="h-6 w-6" />
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-200 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
                        </div>
                        <h4 className="text-lg font-black text-gray-900 uppercase tracking-tighter italic mb-2">Ticket <span className="text-rose-600">Flow.</span></h4>
                        <p className="text-gray-400 text-[10px] font-medium leading-relaxed italic opacity-80">Monitor fulfillment logs. Update order status in a synchronized feed.</p>
                    </Link>

                    <button className="group p-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all text-left">
                        <div className="flex items-start justify-between mb-8">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:rotate-12 transition-transform">
                                <Sparkles className="h-6 w-6" />
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-200 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
                        </div>
                        <h4 className="text-lg font-black text-gray-900 uppercase tracking-tighter italic mb-2">User <span className="text-emerald-600">Voice.</span></h4>
                        <p className="text-gray-400 text-[10px] font-medium leading-relaxed italic opacity-80">Review ratings and critical feedback from the elite user base.</p>
                    </button>
                </div>

                {isOwner && (
                    <div className="mt-16 p-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-8 group">
                        <div className="flex items-center gap-6 relative z-10">
                            <div className="bg-rose-50 p-4 rounded-xl group-hover:scale-110 transition-transform">
                                <Activity className="h-8 w-8 text-rose-600" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter mb-1">Growth Advisor</h3>
                                <p className="text-gray-400 font-bold text-[9px] uppercase tracking-widest italic opacity-70">"Brands that update catalog weekly see 24% higher retention."</p>
                            </div>
                        </div>
                        <button className="bg-rose-600 text-white px-8 py-3.5 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-md hover:bg-rose-700 transition-all active:scale-95">Insights</button>
                    </div>
                )}
            </div>
        </div>
    );
}
