import { Heart, Instagram, Twitter, Facebook, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 py-12 px-6 mt-16 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-rose-600 via-rose-400 to-rose-600" />

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
                <div className="col-span-1 md:col-span-1">
                    <div className="flex items-center gap-2 mb-6 group">
                        <div className="bg-rose-600 p-2 rounded-lg shadow-md group-hover:rotate-6 transition-transform">
                            <span className="text-white font-black text-lg italic leading-none">B</span>
                        </div>
                        <span className="text-2xl font-black uppercase italic tracking-tighter">BiteBliss.</span>
                    </div>
                    <p className="text-gray-400 text-[10px] font-medium leading-relaxed italic mb-6 max-w-xs opacity-60">
                        Pioneering culinary fulfillment. From elite protocols to your doorstep.
                    </p>
                    <div className="flex gap-3">
                        <a href="#" className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-rose-600 hover:text-white transition-all"><Instagram className="h-3.5 w-3.5" /></a>
                        <a href="#" className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-rose-600 hover:text-white transition-all"><Twitter className="h-3.5 w-3.5" /></a>
                        <a href="#" className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-rose-600 hover:text-white transition-all"><Facebook className="h-3.5 w-3.5" /></a>
                    </div>
                </div>

                <div>
                    <h3 className="text-[8px] font-black text-gray-900 uppercase tracking-[0.3em] mb-6 italic">Network</h3>
                    <ul className="space-y-3 text-[9px] font-black uppercase tracking-widest text-gray-400">
                        <li><Link to="/" className="hover:text-rose-600 transition-colors">Portfolio</Link></li>
                        <li><Link to="/orders" className="hover:text-rose-600 transition-colors">Logistics</Link></li>
                        <li><Link to="/cart" className="hover:text-rose-600 transition-colors">Manifest</Link></li>
                        <li><a href="#" className="hover:text-rose-600 transition-colors">Partner HQ</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-[8px] font-black text-gray-900 uppercase tracking-[0.3em] mb-6 italic">Support</h3>
                    <ul className="space-y-3 text-[9px] font-black uppercase tracking-widest text-gray-400">
                        <li><a href="#" className="hover:text-rose-600 transition-colors">Help</a></li>
                        <li><a href="#" className="hover:text-rose-600 transition-colors">Privacy</a></li>
                        <li><a href="#" className="hover:text-rose-600 transition-colors">Settlement</a></li>
                        <li><a href="#" className="hover:text-rose-600 transition-colors">Systems</a></li>
                    </ul>
                </div>

                <div className="bg-gray-50/30 p-6 rounded-[1.5rem] border border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="h-3 w-3 text-rose-500" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-rose-600 italic">Elite Access</span>
                    </div>
                    <h4 className="text-lg font-black text-gray-900 uppercase tracking-tighter italic leading-none mb-3">Newsletter <br /> <span className="text-rose-600">Protocol.</span></h4>
                    <div className="relative mt-4">
                        <input
                            type="email"
                            placeholder="operator@mail.com"
                            className="w-full px-4 py-2.5 bg-white border border-gray-100 rounded-lg outline-none font-bold text-[10px] text-gray-900 italic"
                        />
                        <button className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-gray-900 text-white p-1.5 rounded-md hover:bg-rose-600 transition-all">
                            <Heart className="h-2.5 w-2.5 fill-current" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-[7px] font-black uppercase tracking-[0.4em] text-gray-300">
                    &copy; {new Date().getFullYear()} BB.DISTRIBUTION.SYSTEMS
                </p>
                <p className="text-[7px] font-black uppercase tracking-[0.2em] text-gray-300 flex items-center gap-1.5">
                    DESIGNED BY <span className="text-rose-600 italic">ANTIGRAVITY</span> <Heart className="h-2.5 w-2.5 fill-rose-500 text-rose-500" />
                </p>
            </div>
        </footer>
    );
}
