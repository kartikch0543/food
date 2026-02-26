import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (user.role === 'admin' || user.role === 'owner') {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data?.error?.message || 'Invalid credentials';
            setError(msg);
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-10 py-32">
            <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-[4rem] overflow-hidden shadow-[0_100px_200px_rgba(0,0,0,0.1)] border border-gray-100">

                {/* Visual Side - Mid-Plus */}
                <div className="hidden md:block relative overflow-hidden bg-rose-600 shadow-inner">
                    <img
                        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1200"
                        className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay transition-transform duration-[12s] hover:scale-110"
                        alt="Signature Cuisine"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-rose-900/60 via-transparent to-transparent" />

                    <div className="relative z-10 h-full p-20 flex flex-col justify-between text-white">
                        <div className="flex items-center gap-6 group">
                            <div className="bg-white p-5 rounded-[2rem] shadow-2xl group-hover:rotate-12 transition-transform duration-500">
                                <span className="text-rose-600 font-black text-4xl italic leading-none block">B</span>
                            </div>
                            <span className="text-4xl font-black uppercase italic tracking-tighter">Bite<span className="text-rose-600">Bliss.</span></span>
                        </div>

                        <div>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-1.5 w-16 bg-rose-600 rounded-full shadow-[0_0_20px_rgba(225,29,72,0.4)]" />
                                <span className="text-[11px] font-black uppercase tracking-[0.5em] text-rose-500 italic">Signature Access Protocol</span>
                            </div>
                            <h2 className="text-7xl lg:text-8xl font-black mb-10 italic leading-[0.85] tracking-tighter">Identity <br /> <span className="text-rose-600">Verification.</span></h2>
                            <p className="text-gray-400 text-xl font-bold opacity-80 max-w-sm leading-relaxed italic tracking-tight">
                                "Access your curated culinary portfolio and secure assets through our elite gateway."
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Side - Mid-Plus */}
                <div className="p-16 md:p-28 flex flex-col justify-center bg-white relative overflow-hidden">
                    <div className="absolute top-10 right-10 text-gray-50">
                        <ShieldCheck className="h-32 w-32 -rotate-12" />
                    </div>

                    <div className="mb-16 relative z-10">
                        <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-5 italic uppercase leading-none">Authorize.</h1>
                        <p className="text-gray-400 font-black uppercase text-[11px] tracking-[0.5em] pl-1.5 opacity-60 italic">Elite entry protocol active</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-600 p-8 mb-12 animate-in fade-in slide-in-from-left duration-500 rounded-r-3xl relative z-10 shadow-sm">
                            <p className="text-red-700 text-[11px] font-black uppercase tracking-widest leading-relaxed italic">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-12 relative z-10">
                        <div className="group">
                            <label className="block text-[11px] font-black uppercase tracking-[0.6em] text-gray-400 mb-5 ml-4 italic">User Name</label>
                            <div className="relative">
                                <Mail className="absolute left-10 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-300 transition-all group-focus-within:text-rose-600 group-focus-within:scale-110" />
                                <input
                                    type="email"
                                    placeholder="OPERATOR@BITEBLISS.COM"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-24 pr-10 py-8 bg-gray-50 border-2 border-transparent rounded-[3rem] outline-none font-black text-gray-900 focus:bg-white focus:border-rose-600 focus:shadow-2xl focus:shadow-rose-100 transition-all text-base uppercase tracking-wider italic shadow-inner placeholder:text-gray-200"
                                    required
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-[11px] font-black uppercase tracking-[0.6em] text-gray-400 mb-5 ml-4 italic">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-10 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-300 transition-all group-focus-within:text-rose-600 group-focus-within:scale-110" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-24 pr-10 py-8 bg-gray-50 border-2 border-transparent rounded-[3rem] outline-none font-black text-gray-900 focus:bg-white focus:border-rose-600 focus:shadow-2xl focus:shadow-rose-100 transition-all text-base uppercase tracking-wider shadow-inner"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-rose-600 text-white py-9 rounded-[3rem] font-black text-sm uppercase tracking-[0.4em] hover:bg-rose-700 transition-all shadow-2xl shadow-rose-200 flex items-center justify-center gap-6 active:scale-95 group/btn italic ring-8 ring-transparent hover:ring-rose-50 border border-white/10"
                        >
                            Confirm Identity <ArrowRight className="h-7 w-7 group-hover:translate-x-5 transition-transform duration-700" />
                        </button>
                    </form>

                    <div className="mt-24 text-center relative z-10">
                        <p className="text-[11px] font-black uppercase tracking-[0.5em] text-gray-400 italic">
                            No credentials? {' '}
                            <Link to="/register" className="text-rose-600 hover:text-rose-700 font-black ml-5 underline decoration-4 underline-offset-8 decoration-rose-100 hover:decoration-rose-200 transition-all">Create Identity</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
