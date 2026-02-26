import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Plus, Edit, Trash2, Eye, MapPin, Store, LayoutGrid, List, Search, IndianRupee, ImageIcon, ShieldCheck, Sparkles, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ImageWithFallback } from '../../components/common/ImageWithFallback';

export function AdminRestaurants() {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const { user } = useAuth();

    // Form State
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState('');
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');

    const fetchRestaurants = async () => {
        setLoading(true);
        try {
            const data = await api.restaurants.getAll();
            setRestaurants(data);
        } catch (error) {
            console.error('Failed to fetch restaurants:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('address', address);
        formData.append('category', category);
        formData.append('price', price);
        formData.append('isActive', 'true');
        if (image instanceof File) {
            formData.append('image', image);
        } else if (typeof image === 'string') {
            formData.append('image', image);
        }

        try {
            if (isEditing) {
                await api.restaurants.update(currentId, formData);
            } else {
                await api.restaurants.create(formData);
            }
            resetForm();
            fetchRestaurants();
        } catch (error) {
            console.error('Operation failed:', error);
            alert('Failed to save restaurant.');
        }
    };

    const handleEdit = (r) => {
        setIsEditing(true);
        setCurrentId(r._id);
        setName(r.name);
        setImage(r.image);
        setDescription(r.description);
        setAddress(r.address);
        setCategory(r.category || '');
        setPrice(r.price || '');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (confirm('Delete this restaurant and all associated menu items? This action is IRREVERSIBLE.')) {
            try {
                await api.restaurants.delete(id);
                fetchRestaurants();
            } catch (error) {
                console.error('Delete failed:', error);
            }
        }
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentId('');
        setName('');
        setImage('');
        setDescription('');
        setAddress('');
        setCategory('');
        setPrice('');
    };

    const filteredRestaurants = restaurants.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && restaurants.length === 0) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-6">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-rose-600 border-solid"></div>
                <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.3em] italic">Accessing Portfolio...</p>
            </div>
        </div>
    );

    const isOwner = user?.role === 'owner';
    const hasRestaurant = isOwner && restaurants.length > 0;

    return (
        <div className="min-h-screen bg-[#fafafa] pb-32">
            {/* Header Sticky Container - Balanced Plus */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-[90px] z-[40]">
                <div className="max-w-7xl mx-auto px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-2 w-2 rounded-full bg-rose-600 animate-pulse" />
                            <span className="text-[10px] font-black text-rose-600 uppercase tracking-[0.4em] italic">
                                {isOwner ? 'Brand Management' : 'Global Operations'}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter italic leading-tight">
                            {isOwner ? 'Establishment' : 'All Brands'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-6 w-full md:w-auto">
                        <div className="relative group flex-1 md:flex-none md:w-96">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-rose-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search index..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-16 pr-8 py-5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-12 focus:ring-rose-500/5 outline-none font-bold text-base transition-all shadow-sm"
                            />
                        </div>
                        <div className="flex bg-gray-100/50 p-1.5 rounded-2xl border border-gray-200 shadow-inner">
                            <button onClick={() => setViewMode('grid')} className={`p-3.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white shadow-md text-rose-600' : 'text-gray-400 hover:text-rose-500'}`}><LayoutGrid className="h-5 w-5" /></button>
                            <button onClick={() => setViewMode('list')} className={`p-3.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white shadow-md text-rose-600' : 'text-gray-400 hover:text-rose-500'}`}><List className="h-5 w-5" /></button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 mt-16 grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Form Management - Proportional */}
                <div className="lg:col-span-4 order-2 lg:order-1">
                    {(!hasRestaurant || isEditing) ? (
                        <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden group">
                            <div className="absolute top-0 right-0 p-10 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-[2000ms]">
                                <Store className="h-40 w-40 text-rose-900" />
                            </div>

                            <h2 className="text-2xl font-black text-gray-900 mb-10 uppercase tracking-tighter italic flex items-center gap-4 relative z-10">
                                {isEditing ? <Edit className="h-6 w-6 text-rose-600" /> : <Plus className="h-6 w-6 text-rose-600" />}
                                {isEditing ? 'Refine Identity' : 'Launch New Brand'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2 mb-3 block">Official Name</label>
                                    <input required type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Urban Tandoor" className="w-full px-7 py-5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-12 focus:ring-rose-500/5 transition-all outline-none font-bold text-lg" />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2 mb-3 block">Category</label>
                                        <input type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="Fusion" className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-12 focus:ring-rose-500/5 transition-all outline-none font-black text-sm uppercase tracking-widest" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2 mb-3 block">Price Context</label>
                                        <div className="relative">
                                            <IndianRupee className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-rose-600" />
                                            <input type="text" value={price} onChange={e => setPrice(e.target.value)} placeholder="500 for 2" className="w-full pl-12 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-12 focus:ring-rose-500/5 transition-all outline-none font-bold text-sm" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2 mb-3 block">Master Asset / Visual</label>
                                    <div className="relative group/upload bg-rose-50/10 border-2 border-dashed border-rose-100 rounded-[2rem] p-12 flex flex-col items-center gap-4 hover:bg-rose-50/30 hover:border-rose-200 transition-all cursor-pointer">
                                        <input type="file" onChange={e => setImage(e.target.files?.[0] || '')} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                                        <div className="bg-white p-5 rounded-2xl shadow-xl group-hover/upload:scale-110 transition-transform">
                                            <ImageIcon className="h-8 w-8 text-rose-600" />
                                        </div>
                                        <span className="text-[10px] font-black text-rose-900 uppercase tracking-widest text-center">
                                            {image instanceof File ? image.name : typeof image === 'string' && image ? 'Update Master Visual' : 'Deploy Master Visual'}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2 mb-3 block">Geography / Address</label>
                                    <textarea required value={address} onChange={e => setAddress(e.target.value)} placeholder="Location coordinates..." className="w-full px-7 py-6 bg-gray-50 border border-gray-100 rounded-2xl h-28 resize-none outline-none font-bold text-sm focus:bg-white focus:ring-12 focus:ring-rose-500/5 transition-all" />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2 mb-3 block">Brand Narrative</label>
                                    <textarea required value={description} onChange={e => setDescription(e.target.value)} placeholder="The story behind the service..." className="w-full px-7 py-6 bg-gray-50 border border-gray-100 rounded-2xl h-40 resize-none outline-none font-medium italic text-gray-500 text-sm focus:bg-white focus:ring-12 focus:ring-rose-500/5 transition-all leading-relaxed" />
                                </div>

                                <div className="flex flex-col gap-4 pt-6">
                                    <button type="submit" className="w-full bg-rose-600 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-rose-700 shadow-2xl shadow-rose-100/50 active:scale-95 transition-all flex items-center justify-center gap-4 group">
                                        {isEditing ? <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" /> : <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />}
                                        {isEditing ? 'Refine Identity' : 'Deploy Brand'}
                                    </button>
                                    {isEditing && (
                                        <button type="button" onClick={resetForm} className="w-full text-gray-400 font-black text-[10px] uppercase tracking-widest py-3 hover:text-red-500 transition-colors flex items-center justify-center gap-3">
                                            <X className="h-4 w-4" /> Abort Manifest Change
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border-t-8 border-rose-600 overflow-hidden relative group">
                            <div className="absolute top-0 right-0 p-12 text-rose-600/5 group-hover:rotate-12 transition-transform duration-1000">
                                <ShieldCheck className="h-48 w-48 -mr-12 -mt-12" />
                            </div>
                            <div className="relative z-10">
                                <span className="text-rose-500 font-black text-[10px] uppercase tracking-[0.4em] italic mb-6 block">Identity Protection Active</span>
                                <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-6 leading-tight text-gray-900">Security <span className="text-rose-600">Lock.</span></h2>
                                <p className="text-gray-400 font-bold text-[11px] uppercase tracking-widest leading-relaxed mb-12 italic">Your primary establishment is live. Select 'Refine' from the catalog to modify global assets.</p>
                                <div className="p-8 bg-rose-50 rounded-[2rem] border border-rose-100 italic">
                                    <p className="text-rose-400 text-[9px] font-black uppercase tracking-[0.4em] mb-4">Strategic Insight</p>
                                    <p className="text-sm font-medium leading-relaxed text-rose-900/80 tracking-tight">"Brands with high-resolution exhibition imagery see 3x more commitment. Ensure your visual catalog remains sharp."</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Listing Canvas - Multi-scale */}
                <div className="lg:col-span-8 order-1 lg:order-2">
                    {filteredRestaurants.length === 0 ? (
                        <div className="text-center p-40 bg-white rounded-[4rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                            <Store className="h-24 w-24 text-gray-50 mb-10" />
                            <h2 className="text-3xl font-black text-gray-200 uppercase tracking-widest italic tracking-tighter">No Active Portions</h2>
                        </div>
                    ) : viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {filteredRestaurants.map(r => (
                                <div key={r._id} className="group bg-white rounded-[3.5rem] overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl hover:shadow-black/[0.03] transition-all duration-700 flex flex-col">
                                    <div className="h-72 relative overflow-hidden">
                                        <ImageWithFallback src={r.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2.5s]" alt="" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                        <div className="absolute top-8 right-8 flex flex-col gap-4 opacity-0 group-hover:opacity-100 translate-x-10 group-hover:translate-x-0 transition-all duration-500">
                                            <button onClick={() => handleEdit(r)} className="p-4 bg-white text-gray-900 rounded-2xl shadow-xl hover:bg-rose-600 hover:text-white transition-all transform hover:-rotate-6"><Edit className="h-5 w-5" /></button>
                                            <button onClick={() => handleDelete(r._id)} className="p-4 bg-white text-red-600 rounded-2xl shadow-xl hover:bg-red-600 hover:text-white transition-all transform hover:rotate-6"><Trash2 className="h-5 w-5" /></button>
                                        </div>
                                        <div className="absolute bottom-8 left-8 translate-y-12 group-hover:translate-y-0 transition-transform duration-700">
                                            <span className="bg-rose-600 text-white px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl italic">
                                                {r.category || 'Elite Class'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-10 flex flex-col flex-1">
                                        <div className="mb-6">
                                            <h3 className="text-3xl font-black text-gray-900 group-hover:text-rose-600 transition-colors uppercase tracking-tighter italic leading-tight whitespace-normal break-words mb-3">{r.name}</h3>
                                            <div className="flex items-center gap-3 text-gray-400 text-[10px] font-black uppercase tracking-widest italic bg-gray-50 px-4 py-2 rounded-xl w-fit">
                                                <MapPin className="h-4 w-4 text-rose-500" /> {r.address}
                                            </div>
                                        </div>
                                        <p className="text-gray-400 text-sm font-medium italic line-clamp-2 mb-10 leading-relaxed opacity-80">"{r.description}"</p>
                                        <Link to={`/admin/restaurants/${r._id}/foods`} className="mt-auto w-full flex items-center justify-center gap-4 py-6 bg-rose-600 text-white rounded-[1.8rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-rose-700 transition-all shadow-xl shadow-rose-900/10 group/btn italic">
                                            Manage Assets <Eye className="h-5 w-5 group-hover/btn:scale-125 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-[3.5rem] border border-gray-100 overflow-hidden shadow-sm">
                            <div className="overflow-x-auto no-scrollbar">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.4em] border-b border-gray-100 italic">
                                        <tr>
                                            <th className="px-10 py-7">Brand Entity</th>
                                            <th className="px-10 py-7">Geography</th>
                                            <th className="px-10 py-7 text-right">Fulfillment</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filteredRestaurants.map(r => (
                                            <tr key={r._id} className="hover:bg-rose-50/10 transition-all group">
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center gap-6">
                                                        <div className="h-20 w-20 rounded-[1.5rem] overflow-hidden shadow-md ring-8 ring-gray-100/50 group-hover:ring-rose-100/50 transition-all">
                                                            <ImageWithFallback src={r.image} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" />
                                                        </div>
                                                        <div>
                                                            <span className="font-black text-2xl text-gray-900 uppercase italic tracking-tighter block group-hover:text-rose-600 transition-colors mb-1">{r.name}</span>
                                                            <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest italic">{r.category}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest italic leading-relaxed block max-w-[240px] bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">{r.address}</span>
                                                </td>
                                                <td className="px-10 py-8 text-right">
                                                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                                                        <Link to={`/admin/restaurants/${r._id}/foods`} className="p-4 text-white bg-rose-600 rounded-2xl hover:bg-rose-700 transition-all shadow-xl"><Eye className="h-5 w-5" /></Link>
                                                        <button onClick={() => handleEdit(r)} className="p-4 text-indigo-600 bg-indigo-50 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-lg"><Edit className="h-5 w-5" /></button>
                                                        <button onClick={() => handleDelete(r._id)} className="p-4 text-red-600 bg-red-50 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-lg"><Trash2 className="h-5 w-5" /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
