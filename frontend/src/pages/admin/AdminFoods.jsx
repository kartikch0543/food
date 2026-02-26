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
    const [price, setPrice] = useState('');
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
        setPrice('');
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
            <div className="text-center p-24 bg-white rounded-[5rem] shadow-2xl">
                <ShieldAlert className="h-24 w-24 text-red-100 mx-auto mb-10" />
                <h1 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter mb-4 leading-none">Manifest <br /> Restricted.</h1>
                <p className="text-gray-400 font-bold text-[11px] uppercase tracking-widest mb-12 italic">Establishment not found in registry.</p>
                <Link to="/admin/restaurants" className="bg-rose-600 text-white px-12 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-700 transition-all shadow-xl shadow-rose-100">Back to Portfolio</Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-rose-50/5 pb-32">
            {/* Header section - Balanced Plus (Now scrolls away as requested) */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-8 py-6 flex flex-col lg:flex-row justify-between items-center gap-10">
                    <div className="flex items-center gap-8">
                        <Link to="/admin/restaurants" className="p-5 bg-gray-50 text-gray-400 rounded-[2rem] hover:bg-rose-600 hover:text-white transition-all transform hover:-translate-x-3 shadow-sm border border-gray-100">
                            <ArrowLeft className="h-6 w-6" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-rose-600 font-black text-[10px] uppercase tracking-widest italic bg-rose-50 px-3 py-1 rounded-lg">Inventory Management</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 uppercase tracking-tighter italic leading-tight">{restaurant.name} <span className="text-rose-600">Manifest.</span></h1>
                        </div>
                    </div>

                    <div className="relative w-full lg:w-[440px] group">
                        <Search className="absolute left-7 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-rose-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search dish archive..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-16 pr-8 py-6 bg-gray-50 border border-gray-100 rounded-[2.5rem] focus:bg-white focus:ring-12 focus:ring-rose-500/5 outline-none font-bold text-base shadow-inner transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 mt-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Form Section - Proportional */}
                <div className="lg:col-span-4">
                    <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-gray-100 overflow-hidden relative group/form">
                        <div className="absolute top-0 right-0 p-10 text-rose-500/5 group-hover:rotate-6 transition-transform duration-[2000ms]">
                            <Soup className="h-44 w-44 -mr-12 -mt-12 transform -rotate-12" />
                        </div>

                        <h2 className="text-2xl font-black text-gray-900 mb-12 uppercase tracking-tighter flex items-center gap-4 italic relative z-10 leading-tight">
                            {isEditing ? <><Edit className="h-7 w-7 text-rose-600" /> Refine Recipe</> : <><Plus className="h-7 w-7 text-rose-600" /> New Creation</>}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4 italic mb-1 block">Culinary Designation</label>
                                <input required type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Saffron Risotto" className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-12 focus:ring-rose-500/5 transition-all outline-none font-bold text-lg" />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.4em] ml-4 italic">Master Exhibition Asset</label>
                                <div className="relative group/upload bg-rose-50/10 border-2 border-dashed border-rose-100 rounded-[2.5rem] p-12 flex flex-col items-center gap-5 hover:bg-rose-50/30 transition-all cursor-pointer">
                                    <input type="file" onChange={e => setImage(e.target.files?.[0] || '')} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                                    <div className="bg-white p-6 rounded-2xl shadow-xl group-hover/upload:scale-110 transition-transform">
                                        <ImageIcon className="h-8 w-8 text-rose-600" />
                                    </div>
                                    <span className="text-[10px] font-black text-rose-900 uppercase tracking-widest text-center italic">
                                        {image instanceof File ? image.name : typeof image === 'string' && image ? 'Update Visual Asset' : 'Launch Master Visual'}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4 italic mb-1 block">Price Point</label>
                                    <div className="relative">
                                        <IndianRupee className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-rose-600" />
                                        <input required type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" className="w-full pl-14 pr-4 py-5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-12 focus:ring-rose-500/5 transition-all outline-none font-black text-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4 italic mb-1 block">Classification</label>
                                    <input required type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="Signature" className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-12 focus:ring-rose-500/5 transition-all outline-none font-black text-xs uppercase tracking-wider" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4 italic mb-1 block">Narrative / Description</label>
                                <textarea required value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the sensory profile..." className="w-full px-8 py-7 bg-gray-50 border border-gray-100 rounded-[2rem] h-48 resize-none outline-none font-medium italic text-gray-500 text-sm focus:bg-white focus:ring-12 focus:ring-rose-500/5 transition-all leading-relaxed" />
                            </div>

                            <div className="flex items-center gap-5 p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 italic shadow-inner">
                                <div className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" id="avail" checked={isAvailable} onChange={e => setIsAvailable(e.target.checked)} className="sr-only peer" />
                                    <div className="w-16 h-9 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-emerald-600"></div>
                                </div>
                                <label htmlFor="avail" className="text-[11px] font-black uppercase tracking-widest text-gray-500 cursor-pointer">{isAvailable ? 'Active for Service' : 'Manifest Inactive'}</label>
                            </div>

                            <div className="flex flex-col gap-5 pt-8">
                                <button type="submit" className="w-full bg-rose-600 text-white py-7 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.4em] hover:bg-rose-700 shadow-2xl shadow-rose-900/10 active:scale-95 transition-all flex items-center justify-center gap-5 italic group">
                                    {isEditing ? <><Sparkles className="h-6 w-6 group-hover:rotate-12 transition-transform" /> Commit Refinement</> : <><Plus className="h-6 w-6 group-hover:rotate-90 transition-transform" /> Expand Portfolio</>}
                                </button>
                                {isEditing && (
                                    <button type="button" onClick={resetForm} className="w-full text-gray-400 font-black text-[11px] uppercase tracking-widest py-3 hover:text-red-500 transition-colors flex items-center justify-center gap-3">
                                        <X className="h-4 w-4" /> Abort Refinement
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* Grid Canvas - Multi-scale */}
                <div className="lg:col-span-8">
                    {filteredFoods.length === 0 ? (
                        <div className="text-center p-48 bg-white rounded-[5rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                            <Utensils className="h-28 w-28 text-gray-50 mb-12" />
                            <h2 className="text-3xl font-black text-gray-200 uppercase tracking-widest italic tracking-tighter">No Culinary Assets Found</h2>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {filteredFoods.map(f => (
                                <div key={f._id} className="group bg-white rounded-[4rem] overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl hover:shadow-black/[0.03] transition-all duration-700 flex flex-col">
                                    <div className="h-72 relative overflow-hidden">
                                        <ImageWithFallback src={f.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2.5s]" alt="" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                        <div className="absolute top-10 right-10 flex flex-col gap-5 opacity-0 group-hover:opacity-100 transform translate-x-12 group-hover:translate-x-0 transition-all duration-500">
                                            <button onClick={() => handleEdit(f)} className="p-5 bg-white text-gray-900 rounded-[1.5rem] shadow-2xl hover:bg-rose-600 hover:text-white transition-all transform hover:-rotate-6"><Edit className="h-6 w-6" /></button>
                                            <button onClick={() => handleDelete(f._id)} className="p-5 bg-white text-red-600 rounded-[1.5rem] shadow-2xl hover:bg-red-600 hover:text-white transition-all transform hover:rotate-6"><Trash2 className="h-6 w-6" /></button>
                                        </div>

                                        <div className={`absolute bottom-8 left-8 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl flex items-center gap-3 ring-1 ring-white/20 italic ${f.isAvailable ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
                                            {f.isAvailable ? <><Check className="h-4 w-4" /> In Service</> : <><X className="h-4 w-4" /> Manifest Restricted</>}
                                        </div>
                                    </div>

                                    <div className="p-10 flex flex-col flex-1">
                                        <div className="flex justify-between items-start gap-6 mb-8">
                                            <div className="flex-1 min-w-0">
                                                <span className="text-[10px] font-black bg-rose-50 text-rose-600 px-5 py-2 rounded-xl uppercase tracking-widest mb-4 inline-block italic border border-rose-100">{f.category}</span>
                                                <h3 className="text-2xl md:text-3xl font-black text-gray-900 group-hover:text-rose-600 transition-colors uppercase tracking-tighter italic leading-tight whitespace-normal break-words">{f.name}</h3>
                                            </div>
                                            <div className="flex-shrink-0 flex items-center gap-1.5 font-black text-gray-900 italic bg-gray-50 px-5 py-3 rounded-2xl border border-gray-100 shadow-sm">
                                                <IndianRupee className="h-4 w-4 text-rose-600" />
                                                <p className="text-2xl md:text-3xl tracking-tighter leading-none">{f.price.toFixed(2)}</p>
                                            </div>
                                        </div>
                                        <p className="text-gray-400 text-base font-medium italic line-clamp-3 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
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
