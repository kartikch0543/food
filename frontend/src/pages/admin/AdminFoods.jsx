import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { Plus, Edit, Trash2, ArrowLeft, Utensils, Search, IndianRupee, Check, ShieldAlert, Sparkles, X, ImageIcon, Soup } from 'lucide-react';
import { ImageWithFallback } from '../../components/common/ImageWithFallback';

export function AdminFoods() {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [isEditing, setIsEditing] = useState(false);
    const [currentFoodId, setCurrentFoodId] = useState('');
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [price, setPrice] = useState(0);
    const [category, setCategory] = useState('');
    const [isAvailable, setIsAvailable] = useState(true);
    const [description, setDescription] = useState('');

    const fetchFoods = async () => {
        if (!id) return;
        try {
            const [r, f] = await Promise.all([
                api.restaurants.getById(id),
                api.foods.getByRestaurant(id)
            ]);
            setRestaurant(r || null);
            setFoods(f);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchFoods();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!id) return;

        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', String(price));
        formData.append('category', category);
        formData.append('isAvailable', String(isAvailable));
        formData.append('description', description);
        if (image instanceof File) {
            formData.append('image', image);
        } else if (typeof image === 'string') {
            formData.append('image', image);
        }

        try {
            if (isEditing) {
                await api.foods.update(currentFoodId, formData);
            } else {
                await api.foods.create(id, formData);
            }
            resetForm();
            fetchFoods();
        } catch (error) {
            console.error('Operation failed:', error);
            alert(error.response?.data?.message || 'Failed to save dish.');
        }
    };

    const handleEdit = (f) => {
        setIsEditing(true);
        setCurrentFoodId(f._id);
        setName(f.name);
        setImage(f.image);
        setPrice(f.price);
        setCategory(f.category);
        setIsAvailable(f.isAvailable);
        setDescription(f.description || '');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (foodId) => {
        if (confirm('Delete this masterpiece from the menu?')) {
            try {
                await api.foods.delete(foodId);
                fetchFoods();
            } catch (error) {
                console.error('Delete failed:', error);
            }
        }
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentFoodId('');
        setName('');
        setImage('');
        setPrice(0);
        setCategory('');
        setIsAvailable(true);
        setDescription('');
    };

    const filteredFoods = foods.filter(f =>
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-6">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-rose-600 border-solid"></div>
                <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.3em] italic">Auditing Menu Assets...</p>
            </div>
        </div>
    );

    if (!restaurant) return (
        <div className="min-h-screen flex items-center justify-center bg-rose-50/20">
            <div className="text-center p-20 bg-white rounded-[5rem] shadow-2xl">
                <ShieldAlert className="h-20 w-20 text-red-100 mx-auto mb-10" />
                <h1 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter mb-4">Manifest Restricted</h1>
                <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-10 italic">This establishment does not exist in our registry.</p>
                <Link to="/admin/restaurants" className="bg-rose-600 text-white px-10 py-5 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-rose-700 transition-all">Back to Portfolio</Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-rose-50/5 pb-32">
            {/* Header Sticky Container */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-[73px] z-[40]">
                <div className="max-w-7xl mx-auto px-10 py-5 flex flex-col lg:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-8">
                        <Link to="/admin/restaurants" className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-rose-600 hover:text-white transition-all transform hover:-translate-x-2">
                            <ArrowLeft className="h-6 w-6" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-rose-600 font-black text-[9px] uppercase tracking-[0.2em] italic">Est. Inventory Management</span>
                            </div>
                            <h1 className="text-5xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">{restaurant.name} <span className="text-rose-600">Manifest.</span></h1>
                        </div>
                    </div>

                    <div className="relative w-full lg:w-96 group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-rose-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search dish archive..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-16 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-[2rem] focus:bg-white focus:ring-12 focus:ring-rose-500/5 outline-none font-bold text-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-10 mt-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Form Section */}
                <div className="lg:col-span-4">
                    <div className="bg-white p-12 rounded-[4.5rem] shadow-2xl border border-rose-50 overflow-hidden relative group/form">
                        <div className="absolute top-0 right-0 p-8">
                            <Soup className="h-24 w-24 text-rose-50 -mr-6 -mt-6 transform -rotate-12" />
                        </div>

                        <h2 className="text-2xl font-black text-gray-900 mb-10 uppercase tracking-tighter flex items-center gap-4 italic relative z-10">
                            {isEditing ? <><Edit className="h-6 w-6 text-rose-600" /> Refine Recipe</> : <><Plus className="h-6 w-6 text-rose-600" /> New Creation</>}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4 italic">Culinary Name</label>
                                <input required type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Saffron Risotto" className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-[1.8rem] focus:bg-white focus:ring-12 focus:ring-rose-500/5 transition-all outline-none font-bold text-lg" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4 italic">Exhibition Image</label>
                                <div className="relative group/upload bg-rose-50/20 border-2 border-dashed border-rose-100 rounded-[2.5rem] p-10 flex flex-col items-center gap-4 hover:bg-rose-50 transition-all cursor-pointer">
                                    <input type="file" onChange={e => setImage(e.target.files?.[0] || '')} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                                    <div className="bg-white p-4 rounded-2xl shadow-xl group-hover/upload:scale-110 transition-transform">
                                        <ImageIcon className="h-8 w-8 text-rose-600" />
                                    </div>
                                    <span className="text-[10px] font-black text-rose-900 uppercase tracking-widest text-center">
                                        {image instanceof File ? image.name : typeof image === 'string' && image ? 'Update Visual' : 'Upload Presentation'}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4 italic">Price Point</label>
                                    <div className="relative">
                                        <IndianRupee className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-rose-600" />
                                        <input required type="number" step="0.01" value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full pl-12 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-[1.8rem] focus:bg-white focus:ring-12 focus:ring-rose-500/5 transition-all outline-none font-black text-lg" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4 italic">Classification</label>
                                    <input required type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="Signature" className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-[1.8rem] focus:bg-white focus:ring-12 focus:ring-rose-500/5 transition-all outline-none font-black text-[11px] uppercase tracking-[0.2em]" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4 italic">Flavor Profile / Description</label>
                                <textarea required value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the sensory experience..." className="w-full px-8 py-6 bg-gray-50 border border-gray-100 rounded-[2.5rem] h-40 resize-none outline-none font-medium italic text-gray-500 focus:bg-white focus:ring-12 focus:ring-rose-500/5 transition-all" />
                            </div>

                            <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                                <div className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" id="avail" checked={isAvailable} onChange={e => setIsAvailable(e.target.checked)} className="sr-only peer" />
                                    <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-rose-600"></div>
                                </div>
                                <label htmlFor="avail" className="text-[11px] font-black uppercase tracking-widest text-gray-500 cursor-pointer italic">Live for Service</label>
                            </div>

                            <div className="flex flex-col gap-4 pt-6">
                                <button type="submit" className="w-full bg-rose-600 text-white py-6 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-rose-700 shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4">
                                    {isEditing ? <><Sparkles className="h-5 w-5" /> Commit Refinement</> : <><Plus className="h-5 w-5" /> Expand Menucard</>}
                                </button>
                                {isEditing && (
                                    <button type="button" onClick={resetForm} className="w-full text-gray-400 font-black text-[10px] uppercase tracking-widest py-2 hover:text-red-500 transition-colors flex items-center justify-center gap-2">
                                        <X className="h-4 w-4" /> Cancel Refinement
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* Grid Canvas */}
                <div className="lg:col-span-8">
                    {filteredFoods.length === 0 ? (
                        <div className="text-center p-40 bg-white rounded-[5rem] border-4 border-dashed border-rose-100 flex flex-col items-center justify-center">
                            <Utensils className="h-24 w-24 text-rose-50 mb-10" />
                            <h2 className="text-4xl font-black text-gray-200 uppercase tracking-widest italic tracking-tighter">No Culinary Assets</h2>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {filteredFoods.map(f => (
                                <div key={f._id} className="group bg-white rounded-[4rem] overflow-hidden shadow-sm border border-rose-50 hover:shadow-2xl transition-all duration-700 flex flex-col">
                                    <div className="h-64 relative overflow-hidden">
                                        <ImageWithFallback src={f.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" alt="" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                        <div className="absolute top-8 right-8 flex flex-col gap-4 opacity-0 group-hover:opacity-100 transform translate-x-10 group-hover:translate-x-0 transition-all duration-500">
                                            <button onClick={() => handleEdit(f)} className="p-4 bg-white text-rose-600 rounded-2xl shadow-xl hover:bg-rose-600 hover:text-white transition-all transform hover:-rotate-6"><Edit className="h-5 w-5" /></button>
                                            <button onClick={() => handleDelete(f._id)} className="p-4 bg-white text-red-600 rounded-2xl shadow-xl hover:bg-red-600 hover:text-white transition-all transform hover:rotate-6"><Trash2 className="h-5 w-5" /></button>
                                        </div>

                                        <div className={`absolute bottom-6 left-8 px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl flex items-center gap-2 ring-1 ring-white/20 ${f.isAvailable ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
                                            {f.isAvailable ? <><Check className="h-4 w-4" /> Available</> : <><X className="h-4 w-4" /> Sold Out</>}
                                        </div>
                                    </div>

                                    <div className="p-10 flex flex-col flex-1">
                                        <div className="flex justify-between items-start gap-4 mb-6">
                                            <div>
                                                <span className="text-[9px] font-black bg-rose-50 text-rose-600 px-4 py-1.5 rounded-xl uppercase tracking-widest mb-3 inline-block italic border border-rose-100">{f.category}</span>
                                                <h3 className="text-3xl font-black text-gray-900 group-hover:text-rose-600 transition-colors uppercase tracking-tighter italic leading-none">{f.name}</h3>
                                            </div>
                                            <div className="flex items-center gap-1 font-black text-gray-900 italic">
                                                <IndianRupee className="h-6 w-6 text-rose-600" />
                                                <p className="text-4xl tracking-tighter leading-none">{f.price.toFixed(2)}</p>
                                            </div>
                                        </div>
                                        <p className="text-gray-400 text-sm font-medium italic line-clamp-2 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                                            "{f.description}"
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
