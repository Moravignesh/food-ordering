import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { cartAPI } from '../services/api'
import { useAuth } from './AuthContext'
const CartContext = createContext(null)
export function CartProvider({ children }) {
  const { user } = useAuth()
  const [cart, setCart] = useState({ items: [], total: 0 })
  const [loading, setLoading] = useState(false)
  const fetchCart = useCallback(async () => {
    if (!user) { setCart({ items: [], total: 0 }); return }
    try { setLoading(true); const { data } = await cartAPI.get(); setCart(data) }
    catch { setCart({ items: [], total: 0 }) } finally { setLoading(false) }
  }, [user])
  useEffect(() => { fetchCart() }, [fetchCart])
  const addToCart = async (menuItemId, qty=1) => { await cartAPI.add({ menu_item_id: menuItemId, quantity: qty }); await fetchCart() }
  const updateItem = async (id, qty) => { await cartAPI.update(id, qty); await fetchCart() }
  const removeItem = async (id) => { await cartAPI.remove(id); await fetchCart() }
  const clearCart = async () => { await cartAPI.clear(); setCart({ items: [], total: 0 }) }
  return <CartContext.Provider value={{ cart, loading, fetchCart, addToCart, updateItem, removeItem, clearCart, itemCount: cart.items.reduce((s,i)=>s+i.quantity,0) }}>{children}</CartContext.Provider>
}
export const useCart = () => useContext(CartContext)
