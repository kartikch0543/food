import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { ArrowLeft, Plus, Check, Star, Tag, Utensils, Info, IndianRupee, Clock, Heart, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

export function RestaurantMenu() {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addItem, cart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            setLoading(true);
            Promise.all([api.restaurants.getById(id), api.foods.getByRestaurant(id)]).then(
                ([rest, fds]) => {
                    setRestaurant(rest || null);
                    setFoods(fds.filter(f => f.isAvailable));
                    setLoading(false);
                }
            ).catch(err => {
                console.error(err);
                setLoading(false);
            });
        }
    }, [id]);

    const handleAddToCart = async (food) => {
        if (!user) {
            navigate('/login');
            return;
        }
        await addItem(food);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-6">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-rose-600 border-solid"></div>
                <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest italic">Syncing Menu...</p>
            </div>
        </div>
    );

    if (!restaurant) return (
        <div className="min-h-screen flex items-center justify-center bg-[#fafafa] px-6">
            <div className="text-center p-12 bg-white rounded-[2rem] border border-gray-100 shadow-xl">
                <Info className="h-12 w-12 text-rose-100 mx-auto mb-6" />
                <h1 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter mb-2">Not Found</h1>
                <p className="text-gray-400 font-bold text-[9px] uppercase tracking-widest mb-8 italic">This kitchen is currently offline.</p>
                <Link to="/" className="inline-block px-8 py-3 bg-rose-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg">Back Home</Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fafafa] pb-24">
            {/* Header Sticky Container - Thinner */}
            <div className="sticky top-[73px] z-50 bg-white/70 backdrop-blur-2xl border-b border-gray-100 px-6 py-2.5">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2.5 text-gray-900 font-black text-[9px] hover:text-rose-600 transition-all group uppercase tracking-widest italic">
                        <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
                        Back to Hub
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[8px] font-black uppercase tracking-widest border border-emerald-100">
                            <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" /> Accepting Orders
                        </div>
                        <button className="p-2.5 bg-gray-50 rounded-xl text-gray-400 hover:text-rose-600 transition-all">
                            <Heart className="h-3.5 w-3.5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Banner Section - Mid Scale */}
            <div className="h-[400px] relative overflow-hidden flex items-end pb-12 px-8">
                <ImageWithFallback
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />

                <div className="max-w-7xl mx-auto w-full relative z-10 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="bg-rose-600 text-white px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest italic">
                            Signature Brand
                        </span>
                        <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-xl flex gap-1 text-amber-400 border border-white/20">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} className={`h-3 w-3 ${i === 5 ? 'opacity-30' : 'fill-current'}`} />)}
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
                        <div className="max-w-2xl">
                            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-none mb-6 drop-shadow-xl">{restaurant.name}</h1>
                            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                                <div className="flex items-center gap-2 text-rose-400 font-black text-[10px] uppercase italic">
                                    <Tag className="h-4 w-4" /> {restaurant.category || 'Fine Dining'}
                                </div>
                                <div className="flex items-center gap-2 text-emerald-400 font-black text-[10px] uppercase italic">
                                    <IndianRupee className="h-4 w-4" /> {restaurant.price || 'Market'}
                                </div>
                                <div className="flex items-center gap-2 text-white/70 font-black text-[10px] uppercase italic">
                                    <Clock className="h-4 w-4" /> 25' Delivery
                                </div>
                            </div>
                        </div>

                        <div className="lg:max-w-xs bg-white/10 backdrop-blur-3xl border border-white/10 p-6 rounded-[2rem] text-white shadow-xl">
                            <p className="text-[8px] font-black uppercase tracking-widest text-rose-500 mb-2 italic">About</p>
                            <p className="text-xs font-bold leading-relaxed italic opacity-90 tracking-tight">
                                "{restaurant.description}"
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Section - Refined Grid */}
            <div className="max-w-7xl mx-auto px-6 mt-16">
                <div className="flex items-center gap-4 mb-12">
                    <div className="flex flex-col">
                        <span className="text-[8px] font-black text-rose-600 uppercase tracking-[0.3em] italic mb-1">Today's Selections</span>
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter flex items-center gap-3 italic leading-none">
                            <Utensils className="h-6 w-6 text-rose-600" /> Culinary <span className="text-rose-600">Assets.</span>
                        </h2>
                    </div>
                    <div className="flex-1 h-px bg-gray-100" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {foods.map(food => {
                        const cartItem = cart?.items.find(i => (i.foodId?._id || i.foodId) === food._id);
                        const inCart = !!cartItem;

                        return (
                            <div key={food._id} className="group bg-white rounded-[1.5rem] border border-gray-100 overflow-hidden flex flex-col relative hover:shadow-xl transition-all duration-500">
                                <div className="h-44 relative overflow-hidden">
                                    <ImageWithFallback
                                        src={food.image}
                                        alt={food.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/95 px-3 py-1.5 rounded-lg text-gray-900 font-black text-[10px] shadow-sm">
                                        ₹{food.price.toFixed(2)}
                                    </div>
                                </div>

                                <div className="p-5 flex flex-col flex-1">
                                    <span className="text-rose-400 font-black text-[8px] uppercase tracking-widest mb-2 block italic">{food.category}</span>
                                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter leading-tight italic mb-2">{food.name}</h3>
                                    <p className="text-gray-400 font-bold text-[9px] leading-relaxed italic line-clamp-2 mb-6 opacity-70">
                                        "{food.description}"
                                    </p>

                                    <button
                                        onClick={() => handleAddToCart(food)}
                                        className={`mt-auto w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all active:scale-95 ${inCart
                                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                            : 'bg-rose-600 text-white shadow-md'
                                            }`}
                                    >
                                        {inCart ? (
                                            <>
                                                <Check className="h-3 w-3" /> In Cart ({cartItem.quantity})
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="h-3 w-3" /> Add Item
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
