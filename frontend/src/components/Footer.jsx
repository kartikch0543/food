import { Heart, Instagram, Twitter, Facebook, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 py-20 px-8 mt-24 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-600 via-rose-400 to-rose-600 opacity-50" />

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 relative z-10">
                <div className="col-span-1 md:col-span-1">
                    <div className="flex items-center gap-3 mb-8 group">
                        <div className="bg-rose-600 p-2.5 rounded-xl shadow-lg group-hover:rotate-12 transition-transform">
                            <span className="text-white font-black text-xl italic leading-none block">B</span>
                        </div>
                        <span className="text-3xl font-black uppercase italic tracking-tighter">Bite<span className="text-rose-600">Bliss.</span></span>
                    </div>
                    <p className="text-gray-400 text-xs font-medium leading-relaxed italic mb-10 max-w-xs opacity-70">
                        "Pioneering elite culinary fulfillment. From high-density operational protocols to your personal doorstep."
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"><Instagram className="h-4.5 w-4.5" /></a>
                        <a href="#" className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"><Twitter className="h-4.5 w-4.5" /></a>
                        <a href="#" className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"><Facebook className="h-4.5 w-4.5" /></a>
                    </div>
                </div>

                <div>
                    <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.4em] mb-8 italic border-l-3 border-rose-600 pl-4 leading-none">Network</h3>
                    <ul className="space-y-4 text-[11px] font-black uppercase tracking-widest text-gray-400">
                        <li><Link to="/" className="hover:text-rose-600 transition-colors">Digital Portfolio</Link></li>
                        <li><Link to="/orders" className="hover:text-rose-600 transition-colors">Logistics Hub</Link></li>
                        <li><Link to="/cart" className="hover:text-rose-600 transition-colors">Active Manifest</Link></li>
                        <li><a href="#" className="hover:text-rose-600 transition-colors">Partner Headquarters</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.4em] mb-8 italic border-l-3 border-rose-600 pl-4 leading-none">Security</h3>
                    <ul className="space-y-4 text-[11px] font-black uppercase tracking-widest text-gray-400">
                        <li><a href="#" className="hover:text-rose-600 transition-colors">Support Helpdesk</a></li>
                        <li><a href="#" className="hover:text-rose-600 transition-colors">Privacy Protocol</a></li>
                        <li><a href="#" className="hover:text-rose-600 transition-colors">Settlement Logic</a></li>
                        <li><a href="#" className="hover:text-rose-600 transition-colors">System Integrity</a></li>
                    </ul>
                </div>

                <div className="bg-gray-50/50 p-10 rounded-[2.5rem] border border-gray-100 shadow-inner">
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="h-4 w-4 text-rose-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-600 italic">Elite Access Only</span>
                    </div>
                    <h4 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic leading-none mb-6">Newsletter <br /> <span className="text-rose-600">Protocol.</span></h4>
                    <div className="relative">
                        <input
                            type="email"
                            placeholder="OPERATOR@MAIL.COM"
                            className="w-full px-6 py-4 bg-white border border-gray-100 rounded-xl outline-none font-black text-[11px] text-gray-900 italic tracking-wider placeholder:text-gray-200"
                        />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#131517] text-white p-2.5 rounded-lg hover:bg-rose-600 transition-all shadow-lg active:scale-90 border border-white/10">
                            <Heart className="h-4 w-4 fill-current" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6">
                <p className="text-[9px] font-black uppercase tracking-[0.5em] text-gray-300 italic">
                    &copy; {new Date().getFullYear()} BB.DISTRIBUTION.SYSTEMS &mdash; GLOBAL RIGHTS RESERVED
                </p>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300 flex items-center gap-2 italic">
                    ARCHITECTED BY <span className="text-rose-600">ANTIGRAVITY</span> <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
                </p>
            </div>
        </footer>
    );
}
