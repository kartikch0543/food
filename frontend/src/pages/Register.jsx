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
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6 py-20">
            <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100">

                {/* Visual Side */}
                <div className="hidden md:block relative overflow-hidden bg-gray-900 shadow-inner">
                    <img
                        src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=1200"
                        className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay transition-transform duration-[10s]"
                        alt="Culinary Inspiration"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-900/40 via-transparent to-transparent" />

                    <div className="relative z-10 h-full p-12 flex flex-col justify-between text-white">
                        <div className="flex items-center gap-4">
                            <div className="bg-white p-3 rounded-2xl shadow-xl">
                                <span className="text-rose-600 font-black text-2xl italic leading-none">B</span>
                            </div>
                            <span className="text-2xl font-black uppercase italic tracking-tighter">BiteBliss.</span>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="h-0.5 w-8 bg-rose-600 rounded-full" />
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-rose-500 italic">Network Expansion</span>
                            </div>
                            <h2 className="text-4xl font-black mb-6 italic leading-none tracking-tighter">Manifest <br /> <span className="text-rose-600">Account.</span></h2>
                            <p className="text-gray-400 text-sm font-bold opacity-80 max-w-xs leading-relaxed italic">
                                Initialize your presence in the world's most elite culinary network.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Side */}
                <div className="p-10 md:p-14 flex flex-col justify-center bg-white relative overflow-hidden">
                    <div className="mb-8 relative z-10">
                        <h1 className="text-3xl font-black text-gray-900 tracking-tighter mb-2 italic uppercase leading-none">Initialize.</h1>
                        <p className="text-gray-400 font-black uppercase text-[8px] tracking-[0.3em] pl-1 opacity-60 italic">Strategic registration phase</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-6 animate-in fade-in slide-in-from-left duration-500 rounded-r-xl relative z-10">
                            <p className="text-red-600 text-[9px] font-black uppercase tracking-widest leading-relaxed italic">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        <div className="flex gap-2 p-1.5 bg-gray-50 rounded-2xl border border-gray-100 italic">
                            <button
                                type="button"
                                onClick={() => setRole('user')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${role === 'user' ? 'bg-white text-rose-600 shadow-md ring-1 ring-gray-100' : 'text-gray-300'}`}
                            >
                                <Utensils className="h-3 w-3" /> Patron
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('admin')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${role === 'admin' ? 'bg-white text-rose-600 shadow-md ring-1 ring-gray-100' : 'text-gray-300'}`}
                            >
                                <Store className="h-3 w-3" /> Proprietor
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="group">
                                <label className="block text-[8px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2 ml-2 italic">Designation</label>
                                <div className="relative">
                                    <User className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-rose-600" />
                                    <input
                                        type="text"
                                        placeholder="ALEXANDER VANE"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-16 pr-8 py-4 bg-gray-50 border border-transparent rounded-xl outline-none font-black text-gray-900 focus:bg-white focus:border-rose-600 transition-all text-xs uppercase tracking-wider italic shadow-inner"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-[8px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2 ml-2 italic">Identification</label>
                                <div className="relative">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-rose-600" />
                                    <input
                                        type="email"
                                        placeholder="OPERATOR@BITEBLISS.COM"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-16 pr-8 py-4 bg-gray-50 border border-transparent rounded-xl outline-none font-black text-gray-900 focus:bg-white focus:border-rose-600 transition-all text-xs uppercase tracking-wider italic shadow-inner"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-[8px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2 ml-2 italic">Security Key</label>
                                <div className="relative">
                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-rose-600" />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-16 pr-8 py-4 bg-gray-50 border border-transparent rounded-xl outline-none font-black text-gray-900 focus:bg-white focus:border-rose-600 transition-all text-xs uppercase tracking-wider shadow-inner"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-rose-600 transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 group/btn italic"
                        >
                            Establish Presence <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform duration-500" />
                        </button>
                    </form>

                    <div className="mt-10 text-center relative z-10">
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 italic">
                            Already exist? {' '}
                            <Link to="/login" className="text-rose-600 hover:text-rose-700 font-black ml-2 underline decoration-2 underline-offset-4 decoration-rose-100">Authorize Now</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
