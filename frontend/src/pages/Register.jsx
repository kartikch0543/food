import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Store, Utensils, ArrowRight } from 'lucide-react';

export function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(name, email, password, role);
            if (role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data?.error?.message || 'Registration failed';
            setError(msg);
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-8 py-32">
            <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-[4rem] overflow-hidden shadow-[0_80px_160px_rgba(0,0,0,0.08)] border border-gray-100">

                {/* Visual Side */}
                <div className="hidden md:block relative overflow-hidden bg-rose-600 shadow-inner">
                    <img
                        src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=1200"
                        className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay transition-transform duration-[10s]"
                        alt="Culinary Inspiration"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-900/40 via-transparent to-transparent" />

                    <div className="relative z-10 h-full p-16 flex flex-col justify-between text-white">
                        <div className="flex items-center gap-5">
                            <div className="bg-white p-4 rounded-3xl shadow-2xl">
                                <span className="text-rose-600 font-black text-3xl italic leading-none">B</span>
                            </div>
                            <span className="text-3xl font-black uppercase italic tracking-tighter shadow-sm">BiteBliss.</span>
                        </div>

                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-1 w-12 bg-rose-600 rounded-full" />
                                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-rose-500 italic">Network Expansion</span>
                            </div>
                            <h2 className="text-6xl font-black mb-8 italic leading-[0.9] tracking-tighter">Manifest <br /> <span className="text-rose-600">Account.</span></h2>
                            <p className="text-gray-400 text-lg font-bold opacity-80 max-w-sm leading-relaxed italic">
                                Initialize your presence in the world's most elite culinary network.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Side */}
                <div className="p-16 md:p-20 flex flex-col justify-center bg-white relative overflow-hidden">
                    <div className="mb-10 relative z-10">
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-4 italic uppercase leading-none">Initialize.</h1>
                        <p className="text-gray-400 font-black uppercase text-[10px] tracking-[0.4em] pl-1 opacity-60 italic">Strategic registration phase</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-600 p-6 mb-10 animate-in fade-in slide-in-from-left duration-500 rounded-r-2xl relative z-10">
                            <p className="text-red-600 text-[10px] font-black uppercase tracking-widest leading-relaxed italic">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                        <div className="flex gap-4 p-2 bg-gray-50 rounded-[2.5rem] border border-gray-100 shadow-inner italic">
                            <button
                                type="button"
                                onClick={() => setRole('user')}
                                className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all ${role === 'user' ? 'bg-white text-rose-600 shadow-2xl scale-[1.02] ring-1 ring-gray-100' : 'text-gray-300'}`}
                            >
                                <Utensils className="h-4 w-4" /> customer
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('admin')}
                                className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all ${role === 'admin' ? 'bg-white text-rose-600 shadow-2xl scale-[1.02] ring-1 ring-gray-100' : 'text-gray-300'}`}
                            >
                                <Store className="h-4 w-4" /> Admin
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="group">
                                <label className="block text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 mb-3 ml-3 italic">Name</label>
                                <div className="relative">
                                    <User className="absolute left-8 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-rose-600" />
                                    <input
                                        type="text"
                                        placeholder="ALEXANDER VANE"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-20 pr-10 py-6 bg-gray-50 border-2 border-transparent rounded-[2.5rem] outline-none font-black text-gray-900 focus:bg-white focus:border-rose-600 transition-all text-sm uppercase tracking-wider italic shadow-inner"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 mb-3 ml-3 italic">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-8 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-rose-600" />
                                    <input
                                        type="email"
                                        placeholder="OPERATOR@BITEBLISS.COM"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-20 pr-10 py-6 bg-gray-50 border-2 border-transparent rounded-[2.5rem] outline-none font-black text-gray-900 focus:bg-white focus:border-rose-600 transition-all text-sm uppercase tracking-wider italic shadow-inner"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 mb-3 ml-3 italic">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-8 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-rose-600" />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-20 pr-10 py-6 bg-gray-50 border-2 border-transparent rounded-[2.5rem] outline-none font-black text-gray-900 focus:bg-white focus:border-rose-600 transition-all text-sm uppercase tracking-wider shadow-inner"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-rose-600 text-white py-8 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.5em] hover:bg-rose-700 transition-all shadow-2xl shadow-rose-200 flex items-center justify-center gap-5 active:scale-95 group/btn italic border border-white/10"
                        >
                            Establish Presence <ArrowRight className="h-6 w-6 group-hover:translate-x-4 transition-transform duration-500" />
                        </button>
                    </form>

                    <div className="mt-16 text-center relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 italic">
                            Already exist? {' '}
                            <Link to="/login" className="text-rose-600 hover:text-rose-700 font-black ml-4 underline decoration-4 underline-offset-8 decoration-rose-100">Authorize Now</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
