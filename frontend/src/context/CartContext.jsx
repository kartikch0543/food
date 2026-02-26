import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
    const { user } = useAuth();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchCart = async () => {
        if (user) {
            try {
                const c = await api.cart.get();
                setCart(c);
            } catch (err) {
                console.error('Failed to fetch cart', err);
            }
        } else {
            setCart(null);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCart();
    }, [user]);

    const addItem = async (food, quantity = 1) => {
        if (!user) return;
        const updatedCart = await api.cart.addItem(food._id, quantity);
        setCart(updatedCart);
    };

    const removeItem = async (foodId) => {
        if (!user) return;
        const updatedCart = await api.cart.removeItem(foodId);
        setCart(updatedCart);
    };

    const clearCart = async () => {
        if (!user) return;
        await api.cart.clear();
        setCart({ userId: user._id, items: [] });
    };

    return (
        <CartContext.Provider value={{ cart, loading, addItem, removeItem, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
