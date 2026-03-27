import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, ChevronRight, Clock } from 'lucide-react'
import { orderAPI } from '../services/api'
import './Orders.css'
const STATUS_COLORS = { Placed:'badge-blue', Preparing:'badge-warning', 'Out for Delivery':'badge-brand', Delivered:'badge-success', Cancelled:'badge-error' }
export default function Orders() {
  const [orders, setOrders] = useState([]); const [loading, setLoading] = useState(true)
  useEffect(() => { orderAPI.list().then(r=>setOrders(r.data)).finally(()=>setLoading(false)) }, [])
  if (loading) return <div className="page-loader"><div className="spinner"/></div>
  return (
    <div className="page"><div className="container">
      <div className="page-header"><h1>My Orders</h1><p>Track and manage your orders</p></div>
      {orders.length===0 ? (
        <div className="empty-state"><Package size={56}/><h3>No orders yet</h3><p>Place your first order!</p>
          <Link to="/restaurants" className="btn btn-primary" style={{marginTop:20}}>Order Now</Link></div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          {orders.map(o=>(
            <Link to={`/orders/${o.id}`} key={o.id} className="order-row card fade-in">
              <div className="order-row-left">
                <div className="order-icon"><Package size={20}/></div>
                <div>
                  <h4>Order #{o.id}</h4>
                  <p className="text-sm text-muted">{o.items.length} item(s) · {new Date(o.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <span className={`badge ${STATUS_COLORS[o.status]||'badge-mid'}`}>{o.status}</span>
                <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700}}>₹{o.total_amount.toFixed(2)}</span>
                <ChevronRight size={18} color="var(--mid)"/>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div></div>
  )
}
