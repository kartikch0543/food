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
            {/* Header Sticky Container */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-[73px] z-[40]">
                <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-rose-600 animate-pulse" />
                            <span className="text-[10px] font-black text-rose-600 uppercase tracking-[0.3em] italic">
                                {isOwner ? 'Brand Management' : 'Global Operations'}
                            </span>
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">
                            {isOwner ? 'Establishment' : 'All Brands'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative group flex-1 md:flex-none md:w-80">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-rose-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search index..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-6 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-8 focus:ring-rose-500/5 outline-none font-bold text-sm transition-all shadow-sm"
                            />
                        </div>
                        <div className="flex bg-gray-100/50 p-1 rounded-xl border border-gray-200">
                            <button onClick={() => setViewMode('grid')} className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-md text-rose-600' : 'text-gray-400 hover:text-rose-500'}`}><LayoutGrid className="h-4 w-4" /></button>
                            <button onClick={() => setViewMode('list')} className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-md text-rose-600' : 'text-gray-400 hover:text-rose-500'}`}><List className="h-4 w-4" /></button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Form Management */}
                <div className="lg:col-span-4 order-2 lg:order-1">
                    {(!hasRestaurant || isEditing) ? (
                        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-700">
                                <Store className="h-24 w-24 text-rose-900" />
                            </div>

                            <h2 className="text-xl font-black text-gray-900 mb-8 uppercase tracking-tighter italic flex items-center gap-3 relative z-10">
                                {isEditing ? <Edit className="h-5 w-5 text-rose-600" /> : <Plus className="h-5 w-5 text-rose-600" />}
                                {isEditing ? 'Refine Identity' : 'Launch New Brand'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                <div>
                                    <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1 mb-2 block">Official Name</label>
                                    <input required type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Urban Tandoor" className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-8 focus:ring-rose-500/5 transition-all outline-none font-bold text-base" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1 mb-2 block">Cuisine</label>
                                        <input type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="Fusion" className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-8 focus:ring-rose-500/5 transition-all outline-none font-black text-[10px] uppercase tracking-widest" />
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1 mb-2 block">Avg Ticket</label>
                                        <div className="relative">
                                            <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-3 w-3 text-rose-600" />
                                            <input type="text" value={price} onChange={e => setPrice(e.target.value)} placeholder="500 for 2" className="w-full pl-9 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-8 focus:ring-rose-500/5 transition-all outline-none font-bold text-[10px]" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1 mb-2 block">Master Asset / Image</label>
                                    <div className="relative group/upload bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center gap-3 hover:bg-rose-50/30 hover:border-rose-200 transition-all cursor-pointer">
                                        <input type="file" onChange={e => setImage(e.target.files?.[0] || '')} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                                        <ImageIcon className="h-6 w-6 text-gray-300 group-hover/upload:text-rose-500 transition-colors" />
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest group-hover/upload:text-rose-600">
                                            {image instanceof File ? image.name : typeof image === 'string' && image ? 'Change Master Image' : 'Click to Upload'}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1 mb-2 block">HQ Address</label>
                                    <textarea required value={address} onChange={e => setAddress(e.target.value)} placeholder="Location coordinates..." className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl h-24 resize-none outline-none font-bold text-xs focus:bg-white focus:ring-8 focus:ring-rose-500/5 transition-all" />
                                </div>

                                <div>
                                    <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1 mb-2 block">Brand Narrative</label>
                                    <textarea required value={description} onChange={e => setDescription(e.target.value)} placeholder="The story behind the service..." className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl h-32 resize-none outline-none font-medium italic text-gray-500 text-xs focus:bg-white focus:ring-8 focus:ring-rose-500/5 transition-all" />
                                </div>

                                <div className="flex flex-col gap-3 pt-4">
                                    <button type="submit" className="w-full bg-rose-600 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-rose-700 shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                                        {isEditing ? <Sparkles className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                                        {isEditing ? 'Update Identity' : 'Deploy Brand'}
                                    </button>
                                    {isEditing && (
                                        <button type="button" onClick={resetForm} className="w-full text-gray-400 font-black text-[9px] uppercase tracking-widest py-2 hover:text-red-500 transition-colors flex items-center justify-center gap-2">
                                            <X className="h-3 w-3" /> Abort Changes
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="bg-rose-600 p-10 rounded-[2.5rem] shadow-2xl text-white overflow-hidden">
                            <div className="absolute top-0 right-0 opacity-10">
                                <ShieldCheck className="h-32 w-32 -mr-6 -mt-6" />
                            </div>
                            <div className="relative z-10">
                                <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-4 leading-none">Security Lock</h2>
                                <p className="text-white/70 font-bold text-[10px] uppercase tracking-widest leading-relaxed mb-10 italic">Your primary establishment is live. To modify global settings, select 'Refine' from the catalog menu below.</p>
                                <div className="p-6 bg-white/10 rounded-2xl border border-white/20 italic">
                                    <p className="text-rose-200 text-[8px] font-black uppercase tracking-widest mb-3">Intelligence</p>
                                    <p className="text-[11px] font-medium leading-relaxed opacity-90">"Brands with high-resolution imagery see 3x more engagement. Ensure your catalog remains visually striking."</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Listing Canvas */}
                <div className="lg:col-span-8 order-1 lg:order-2">
                    {filteredRestaurants.length === 0 ? (
                        <div className="text-center p-32 bg-white rounded-[3rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                            <Store className="h-16 w-16 text-gray-100 mb-8" />
                            <h2 className="text-2xl font-black text-gray-200 uppercase tracking-widest italic tracking-tighter">No Brands Found</h2>
                        </div>
                    ) : viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {filteredRestaurants.map(r => (
                                <div key={r._id} className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 flex flex-col">
                                    <div className="h-60 relative overflow-hidden">
                                        <ImageWithFallback src={r.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]" alt="" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <div className="absolute top-6 right-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                            <button onClick={() => handleEdit(r)} className="p-3 bg-white text-gray-900 rounded-xl shadow-lg hover:bg-rose-600 hover:text-white transition-all"><Edit className="h-4 w-4" /></button>
                                            <button onClick={() => handleDelete(r._id)} className="p-3 bg-white text-red-600 rounded-xl shadow-lg hover:bg-red-600 hover:text-white transition-all"><Trash2 className="h-4 w-4" /></button>
                                        </div>
                                        <div className="absolute bottom-5 left-6 translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
                                            <span className="bg-rose-600 text-white px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl">
                                                {r.category || 'Premium Service'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-8 flex flex-col flex-1">
                                        <div className="mb-4">
                                            <h3 className="text-2xl font-black text-gray-900 group-hover:text-rose-600 transition-colors uppercase tracking-tighter italic whitespace-nowrap overflow-hidden text-ellipsis mb-2">{r.name}</h3>
                                            <div className="flex items-center gap-2 text-gray-400 text-[9px] font-black uppercase tracking-widest italic">
                                                <MapPin className="h-3 w-3" /> {r.address}
                                            </div>
                                        </div>
                                        <p className="text-gray-400 text-[11px] font-medium italic line-clamp-2 mb-8 leading-relaxed">"{r.description}"</p>
                                        <Link to={`/admin/restaurants/${r._id}/foods`} className="mt-auto w-full flex items-center justify-center gap-3 py-4 bg-gray-50 text-gray-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] border border-gray-100 hover:bg-gray-900 hover:text-white transition-all shadow-sm">
                                            Manage Assets <Eye className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-gray-400 text-[9px] font-black uppercase tracking-[0.3em] border-b border-gray-100">
                                        <tr>
                                            <th className="px-8 py-5">Brand Entity</th>
                                            <th className="px-8 py-5">Geography</th>
                                            <th className="px-8 py-5 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filteredRestaurants.map(r => (
                                            <tr key={r._id} className="hover:bg-gray-50/50 transition-all group">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-5">
                                                        <div className="h-14 w-14 rounded-2xl overflow-hidden shadow-sm ring-4 ring-gray-100/50">
                                                            <ImageWithFallback src={r.image} className="h-full w-full object-cover" alt="" />
                                                        </div>
                                                        <div>
                                                            <span className="font-black text-lg text-gray-900 uppercase italic tracking-tighter block group-hover:text-rose-600 transition-colors">{r.name}</span>
                                                            <span className="text-[8px] font-black text-rose-400 uppercase tracking-widest">{r.category}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic leading-relaxed block max-w-[180px] overflow-hidden text-ellipsis whitespace-nowrap">{r.address}</span>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Link to={`/admin/restaurants/${r._id}/foods`} className="p-2.5 text-gray-900 bg-gray-100 rounded-xl hover:bg-gray-900 hover:text-white transition-all"><Eye className="h-4 w-4" /></Link>
                                                        <button onClick={() => handleEdit(r)} className="p-2.5 text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"><Edit className="h-4 w-4" /></button>
                                                        <button onClick={() => handleDelete(r._id)} className="p-2.5 text-red-600 bg-red-50 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Trash2 className="h-4 w-4" /></button>
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
