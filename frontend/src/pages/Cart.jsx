import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, Tag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { orderAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import './Cart.css'

export default function Cart() {
  const { cart, updateItem, removeItem, fetchCart } = useCart()
  const { user } = useAuth(); const navigate = useNavigate()
  const [address, setAddress] = useState(user?.address || '')
  const [promo, setPromo] = useState(''); const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const handleOrder = async () => {
    if (!address.trim()) { toast.error('Please enter delivery address'); return }
    setLoading(true)
    try {
      const { data } = await orderAPI.place({ delivery_address: address, notes, promo_code: promo || null })
      toast.success('Order placed successfully!')
      await fetchCart()
      navigate(`/orders/${data.id}`)
    } catch(e) { toast.error(e.response?.data?.detail || 'Failed to place order') }
    finally { setLoading(false) }
  }

  if (cart.items.length === 0) return (
    <div className="page"><div className="container">
      <div className="empty-state"><ShoppingBag size={56}/><h3>Your cart is empty</h3><p>Add items from a restaurant to get started</p>
        <Link to="/restaurants" className="btn btn-primary" style={{marginTop:20}}>Browse Restaurants</Link></div>
    </div></div>
  )

  return (
    <div className="page"><div className="container">
      <div className="page-header"><h1>Your Cart</h1><p>{cart.items.length} item(s) from {cart.items[0]?.menu_item?.restaurant_id && 'a restaurant'}</p></div>
      <div className="cart-layout">
        <div className="cart-items">
          {cart.items.map(item=>(
            <div key={item.id} className="cart-item card fade-in">
              {item.menu_item.image_url && <img src={item.menu_item.image_url} alt={item.menu_item.name} className="cart-item-img"/>}
              <div className="cart-item-info">
                <h4>{item.menu_item.name}</h4>
                <p className="text-muted text-sm">₹{item.menu_item.price} each</p>
              </div>
              <div className="cart-item-actions">
                <div className="qty-ctrl">
                  <button onClick={()=>item.quantity===1?removeItem(item.id):updateItem(item.id,item.quantity-1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={()=>updateItem(item.id,item.quantity+1)}>+</button>
                </div>
                <span className="cart-item-sub">₹{(item.menu_item.price*item.quantity).toFixed(2)}</span>
                <button className="btn-icon-danger" onClick={()=>removeItem(item.id)}><Trash2 size={16}/></button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary card">
          <h3 style={{marginBottom:20}}>Order Summary</h3>
          <div className="input-group" style={{marginBottom:14}}>
            <label>Delivery Address *</label>
            <textarea className="input" rows={3} placeholder="Enter your full delivery address" value={address} onChange={e=>setAddress(e.target.value)} style={{resize:'vertical'}}/>
          </div>
          <div className="input-group" style={{marginBottom:14}}>
            <label>Promo Code</label>
            <div style={{display:'flex',gap:8}}>
              <input className="input" placeholder="e.g. SAVE10, WELCOME20" value={promo} onChange={e=>setPromo(e.target.value.toUpperCase())}/>
            </div>
            <p className="text-xs text-muted">Available: SAVE10, WELCOME20, FLAT50</p>
          </div>
          <div className="input-group" style={{marginBottom:20}}>
            <label>Special Instructions</label>
            <input className="input" placeholder="Any special requests…" value={notes} onChange={e=>setNotes(e.target.value)}/>
          </div>
          <div className="summary-row"><span>Subtotal</span><span>₹{cart.total.toFixed(2)}</span></div>
          <div className="summary-row"><span>Delivery</span><span style={{color:'var(--success)'}}>Free</span></div>
          <div className="summary-row total"><span>Total</span><span>₹{cart.total.toFixed(2)}</span></div>
          <button className="btn btn-primary w-full" style={{marginTop:16}} onClick={handleOrder} disabled={loading}>
            {loading ? 'Placing Order…' : `Place Order · ₹${cart.total.toFixed(2)}`}
          </button>
          <p className="text-xs text-muted" style={{textAlign:'center',marginTop:8}}>You can pay after placing the order</p>
        </div>
      </div>
    </div></div>
  )
}
