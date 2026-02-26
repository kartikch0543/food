import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Search, Star, Clock, ArrowRight, Plus, Check, Frown, Sparkles, Filter } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { FoodSkeleton, RestaurantSkeleton } from '../components/common/Skeleton';

export function Home() {
    const [restaurants, setRestaurants] = useState([]);
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const { cart, addItem } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user && (user.role === 'admin' || user.role === 'owner')) {
            navigate('/admin/dashboard');
        }
    }, [user, navigate]);

    useEffect(() => {
        setLoading(true);
        Promise.all([api.restaurants.getAll(), api.foods.getByRestaurant('all')]).then(([restData, foodData]) => {
            setRestaurants(restData || []);
            setFoods(foodData || []);
        }).catch(err => {
            console.error('Frontend error fetching data:', err);
        }).finally(() => {
            setLoading(false);
        });
    }, []);

    const categories = ['All', 'Veg', 'Non-Veg', 'Italian', 'Fast Food', 'Japanese', 'Mexican'];

    const filteredRestaurants = restaurants.filter(r => {
        const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.category?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || r.category?.toLowerCase().includes(selectedCategory.toLowerCase());
        return matchesSearch && matchesCategory;
    });

    const filteredFoods = foods.filter(f => {
        const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.category?.toLowerCase().includes(searchTerm.toLowerCase());

        const isVegNonVegFilter = selectedCategory === 'Veg' || selectedCategory === 'Non-Veg';
        const foodRestCategory = f.restaurantId?.category || '';

        const matchesCategory = selectedCategory === 'All' ||
            (isVegNonVegFilter ? f.category?.toLowerCase() === selectedCategory.toLowerCase() : foodRestCategory.toLowerCase() === selectedCategory.toLowerCase());

        return matchesSearch && matchesCategory;
    });

    const handleAddToCart = async (e, food) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
            navigate('/login');
            return;
        }
        await addItem(food);
    };

    return (
        <div className="min-h-screen bg-[#fafafa]">
            {/* Hero Section - Balanced Mid-Plus */}
            <div className="relative pt-16 pb-20 px-8 md:px-16 overflow-hidden bg-white">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-rose-50/20 blur-[120px] rounded-full -mr-16 -z-10" />

                <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="z-10 animate-in fade-in slide-in-from-left duration-700">
                        <div className="inline-flex items-center gap-3 mb-8 bg-rose-50/60 border border-rose-100 px-5 py-2.5 rounded-2xl">
                            <Sparkles className="h-5 w-5 text-rose-600" />
                            <span className="text-[11px] font-black text-rose-600 uppercase tracking-widest italic">The Future of Flavor</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 tracking-tighter uppercase italic leading-[0.9]">
                            Elite Taste. <br /> <span className="text-rose-600">Zero Effort.</span>
                        </h1>

                        <p className="text-xl text-gray-400 font-bold max-w-lg mb-10 leading-relaxed italic tracking-tight">
                            "Curating the city's finest culinary experiences, delivered with precision to your doorstep."
                        </p>

                        <div className="relative group w-full md:w-[640px]">
                            <div className="absolute -inset-1 bg-rose-600/10 rounded-full blur-md group-hover:bg-rose-600/20 transition-all duration-500" />
                            <div className="relative">
                                <Search className="absolute left-8 top-1/2 -translate-y-1/2 h-7 w-7 text-rose-600" />
                                <input
                                    type="text"
                                    placeholder="Search by restaurant or flavor..."
                                    className="w-full pl-20 pr-10 py-7 bg-white border border-gray-100 rounded-full focus:border-rose-600 outline-none font-black text-2xl tracking-tighter transition-all placeholder:text-gray-200 shadow-2xl shadow-rose-100/10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="relative hidden lg:block animate-in fade-in zoom-in duration-1000 delay-200">
                        <img
                            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&w=800"
                            className="relative w-full h-[580px] object-contain drop-shadow-[0_45px_65px_rgba(0,0,0,0.1)] hover:scale-[1.03] transition-all duration-1000"
                            alt="Signature Dish"
                        />
                        <div className="absolute top-10 -left-6 bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-gray-100 shadow-2xl animate-bounce duration-[4s]">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Live Tracking</span>
                            </div>
                            <div className="h-2 w-24 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full w-2/3 bg-rose-600 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Toolbar - Compact Balanced */}
            <div className="sticky top-[90px] z-30 bg-white/80 backdrop-blur-2xl border-b border-gray-100 overflow-x-auto no-scrollbar shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-center">
                    <div className="flex items-center gap-6 min-w-max">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-8 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${selectedCategory === cat
                                    ? 'bg-rose-600 text-white shadow-xl shadow-rose-100'
                                    : 'text-gray-400 hover:text-rose-600 hover:bg-rose-50'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 py-20 space-y-32">
                {/* Restaurants Section */}
                <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="flex items-center gap-8 mb-16">
                        <div className="flex flex-col text-left">
                            <span className="text-[11px] font-black text-rose-600 uppercase tracking-[0.4em] italic mb-2">Prime Portfolio</span>
                            <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">Curated <span className="text-rose-600">Brands.</span></h2>
                        </div>
                        <div className="flex-1 h-px bg-gray-100" />
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                            {[1, 2, 3, 4].map(i => <RestaurantSkeleton key={i} />)}
                        </div>
                    ) : filteredRestaurants.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                            {filteredRestaurants.map((restaurant) => (
                                <Link
                                    to={`/restaurant/${restaurant._id}`}
                                    key={restaurant._id}
                                    className="group bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-rose-100/40 transition-all duration-700 h-full flex flex-col relative"
                                >
                                    <div className="h-64 relative overflow-hidden">
                                        <ImageWithFallback
                                            src={restaurant.image}
                                            alt={restaurant.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                        />
                                        <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm border border-gray-100">
                                            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                                            <span className="text-xs font-black italic">4.9</span>
                                        </div>
                                    </div>

                                    <div className="p-9 flex flex-col flex-1">
                                        <div className="flex items-center gap-4 mb-5">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">{restaurant.category || 'Elite'}</span>
                                            <div className="h-1.5 w-1.5 rounded-full bg-gray-200" />
                                            <span className="text-[10px] font-black text-emerald-500 uppercase italic">Active</span>
                                        </div>
                                        <h3 className="text-2xl font-black text-gray-900 uppercase italic leading-tight mb-4 group-hover:text-rose-600 transition-colors tracking-tighter">{restaurant.name}</h3>
                                        <p className="text-gray-400 font-bold text-xs line-clamp-2 leading-relaxed italic mb-10 opacity-80">"{restaurant.description}"</p>

                                        <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                                            <div className="flex items-center gap-3 text-gray-400 font-black text-[10px] uppercase tracking-widest">
                                                <Clock className="h-5 w-5 text-rose-600/60" /> 25 MINS
                                            </div>
                                            <div className="text-rose-600 font-black text-[11px] uppercase flex items-center gap-3 group-hover:translate-x-2 transition-transform">
                                                Explore <ArrowRight className="h-5 w-5" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-24 bg-white rounded-[4rem] border border-gray-100 shadow-sm flex flex-col items-center">
                            <Frown className="h-20 w-20 text-gray-100 mb-10" />
                            <h3 className="text-3xl font-black text-gray-200 uppercase tracking-widest italic tracking-tighter">No Brands Active</h3>
                        </div>
                    )}
                </section>

                {/* Products Section */}
                <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                    <div className="flex items-center gap-8 mb-16">
                        <div className="flex flex-col text-left">
                            <span className="text-[11px] font-black text-rose-600 uppercase tracking-[0.4em] italic mb-2">Signature Assets</span>
                            <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">Elite <span className="text-rose-600">Menu.</span></h2>
                        </div>
                        <div className="flex-1 h-px bg-gray-100" />
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                            {[1, 2, 3, 4].map(i => <FoodSkeleton key={i} />)}
                        </div>
                    ) : filteredFoods.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                            {filteredFoods.map((food) => {
                                const inCart = cart?.items.some(i => (i.foodId?._id || i.foodId) === food._id);
                                return (
                                    <div
                                        key={food._id}
                                        onClick={() => navigate(`/restaurant/${food.restaurantId?._id || food.restaurantId}`)}
                                        className="group bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-rose-100/40 transition-all duration-700 h-full flex flex-col cursor-pointer relative"
                                    >
                                        <div className="h-56 relative overflow-hidden">
                                            <ImageWithFallback
                                                src={food.image}
                                                alt={food.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                            />
                                            <div className="absolute bottom-5 right-5 bg-rose-600 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-xl italic tracking-tight">
                                                ₹{food.price}
                                            </div>
                                        </div>
                                        <div className="p-9 flex flex-col flex-1">
                                            <span className="text-rose-400 font-black text-[10px] uppercase tracking-[0.3em] mb-3 block italic">{food.category}</span>
                                            <h3 className="text-2xl font-black text-gray-900 uppercase italic leading-tight mb-4 group-hover:text-rose-600 transition-colors tracking-tighter">{food.name}</h3>
                                            <p className="text-gray-400 font-bold text-[11px] line-clamp-2 italic mb-10 opacity-80 leading-relaxed">"{food.description}"</p>

                                            <button
                                                onClick={(e) => handleAddToCart(e, food)}
                                                className={`mt-auto flex items-center justify-center gap-4 w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all transform active:scale-95 ${inCart
                                                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                                    : 'bg-rose-600 text-white hover:bg-rose-700 shadow-xl shadow-rose-900/10'
                                                    }`}
                                            >
                                                {inCart ? <><Check className="h-5 w-5" /> In Folder</> : <><Plus className="h-5 w-5" /> Add Asset</>}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center p-24 bg-rose-50/10 rounded-[3rem] border-2 border-dashed border-rose-100">
                            <h3 className="text-2xl font-black text-gray-300 uppercase italic tracking-tighter">Inventory lookup empty</h3>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
