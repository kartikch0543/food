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
            <div className="flex flex-col items-center gap-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-rose-600 border-solid"></div>
                <p className="text-gray-400 font-black text-xs uppercase tracking-[0.4em] italic">Syncing Menu Archive...</p>
            </div>
        </div>
    );

    if (!restaurant) return (
        <div className="min-h-screen flex items-center justify-center bg-[#fafafa] px-10">
            <div className="text-center p-24 bg-white rounded-[4rem] border border-gray-100 shadow-2xl">
                <Info className="h-20 w-20 text-rose-100 mx-auto mb-10" />
                <h1 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter mb-6 leading-none">Manifest <br /> <span className="text-rose-600">Restricted.</span></h1>
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-12 italic opacity-60">This kitchen asset is currently offline.</p>
                <Link to="/" className="inline-block px-12 py-5 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-rose-700 transition-all shadow-xl shadow-rose-200/50 italic">Return to Portfolio</Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fafafa] pb-32">
            {/* Header Sticky Container - Balanced Plus */}
            <div className="sticky top-[90px] z-50 bg-white/80 backdrop-blur-2xl border-b border-gray-100 px-10 py-5">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-4 text-gray-900 font-black text-[11px] hover:text-rose-600 transition-all group uppercase tracking-[0.3em] italic leading-none">
                        <ArrowLeft className="h-5 w-5 group-hover:-translate-x-2 transition-transform" />
                        Return to Hub
                    </Link>
                    <div className="flex items-center gap-10">
                        <div className="hidden md:flex items-center gap-3.5 px-6 py-2.5 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 leading-none shadow-sm">
                            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" /> Operational
                        </div>
                        <button className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-rose-600 hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-rose-100">
                            <Heart className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Banner Section - Mid-Plus Scale */}
            <div className="h-[580px] relative overflow-hidden flex items-end pb-20 px-12">
                <ImageWithFallback
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="absolute inset-0 w-full h-full object-cover scale-[1.02] hover:scale-105 transition-transform duration-[20s]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-gray-900/60 to-transparent" />

                <div className="max-w-7xl mx-auto w-full relative z-10 animate-in fade-in slide-in-from-top-10 duration-[1.2s]">
                    <div className="flex items-center gap-5 mb-10">
                        <div className="bg-rose-600 text-white px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest italic shadow-2xl">
                            Signature Brand
                        </div>
                        <div className="bg-white/10 backdrop-blur-md px-5 py-2 rounded-xl flex gap-2 text-amber-500 border border-white/20 shadow-xl">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} className={`h-4.5 w-4.5 ${i === 5 ? 'opacity-30' : 'fill-current'}`} />)}
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-16">
                        <div className="max-w-4xl">
                            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-[0.85] mb-10 drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">{restaurant.name}</h1>
                            <div className="flex flex-wrap items-center gap-x-16 gap-y-8">
                                <div className="flex items-center gap-4 text-rose-400 font-black text-sm uppercase italic tracking-[0.3em]">
                                    <Tag className="h-6 w-6" /> {restaurant.category || 'Fine Dining'}
                                </div>
                                <div className="flex items-center gap-4 text-emerald-400 font-black text-sm uppercase italic tracking-[0.3em]">
                                    <IndianRupee className="h-6 w-6" /> {restaurant.price || 'Market Rates'}
                                </div>
                                <div className="flex items-center gap-4 text-white/80 font-black text-sm uppercase italic tracking-[0.3em]">
                                    <Clock className="h-6 w-6 text-rose-500" /> 25' Fulfillment
                                </div>
                            </div>
                        </div>

                        <div className="lg:max-w-md bg-white/10 backdrop-blur-3xl border border-white/20 p-10 rounded-[3rem] text-white shadow-2xl hover:bg-white/15 transition-all">
                            <p className="text-[11px] font-black uppercase tracking-[0.5em] text-rose-500 mb-4 italic leading-none">Operational Insight</p>
                            <p className="text-base font-bold leading-relaxed italic opacity-90 tracking-tight">
                                "{restaurant.description}"
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Section - Refined Proportional Grid */}
            <div className="max-w-7xl mx-auto px-10 mt-32">
                <div className="flex items-center gap-10 mb-20">
                    <div className="flex flex-col">
                        <span className="text-[11px] font-black text-rose-600 uppercase tracking-[0.5em] italic mb-2">Today's Selections</span>
                        <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter flex items-center gap-6 italic leading-none">
                            <Utensils className="h-10 w-10 text-rose-600" /> Culinary <span className="text-rose-600">Assets.</span>
                        </h2>
                    </div>
                    <div className="flex-1 h-[2px] bg-gray-100" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                    {foods.map(food => {
                        const cartItem = cart?.items.find(i => (i.foodId?._id || i.foodId) === food._id);
                        const inCart = !!cartItem;

                        return (
                            <div key={food._id} className="group bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden flex flex-col relative hover:shadow-2xl hover:shadow-black/[0.03] transition-all duration-700 shadow-sm">
                                <div className="h-60 relative overflow-hidden">
                                    <ImageWithFallback
                                        src={food.image}
                                        alt={food.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2.5s]"
                                    />
                                    <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-2xl text-gray-900 font-black text-xs shadow-xl border border-gray-100 italic">
                                        ₹{food.price.toFixed(2)}
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:opacity-0 transition-opacity" />
                                </div>

                                <div className="p-9 flex flex-col flex-1">
                                    <span className="text-rose-400 font-black text-[11px] uppercase tracking-[0.4em] mb-4 block italic">{food.category}</span>
                                    <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter leading-tight italic mb-4 group-hover:text-rose-600 transition-colors">{food.name}</h3>
                                    <p className="text-gray-400 font-bold text-xs leading-relaxed italic line-clamp-2 mb-12 opacity-80">
                                        "{food.description}"
                                    </p>

                                    <button
                                        onClick={() => handleAddToCart(food)}
                                        className={`mt-auto w-full flex items-center justify-center gap-4 py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-xl active:scale-95 italic ${inCart
                                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                            : 'bg-rose-600 text-white hover:bg-rose-700 shadow-rose-900/10'
                                            }`}
                                    >
                                        {inCart ? (
                                            <>
                                                <Check className="h-5 w-5" /> In Folder ({cartItem.quantity})
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="h-5 w-5" /> Add Asset
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
