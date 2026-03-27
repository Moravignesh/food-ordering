import { useState, useEffect, useRef } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { CheckCircle, Circle, Clock, Package, Truck, Home, XCircle, CreditCard } from 'lucide-react'
import { orderAPI, paymentAPI } from '../services/api'
import toast from 'react-hot-toast'
import './OrderDetail.css'

const STEPS = ['Placed','Preparing','Out for Delivery','Delivered']
const ICONS = [Package, Clock, Truck, Home]
const STATUS_COLORS = { Placed:'badge-blue', Preparing:'badge-warning', 'Out for Delivery':'badge-brand', Delivered:'badge-success', Cancelled:'badge-error' }

export default function OrderDetail() {
  const { id } = useParams(); const [sp] = useSearchParams()
  const [order, setOrder] = useState(null); const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const pollRef = useRef(null)

  const fetchOrder = () => orderAPI.get(id).then(r=>setOrder(r.data)).catch(()=>{})

  useEffect(() => {
    fetchOrder().finally(()=>setLoading(false))
    if (sp.get('payment')==='success') {
      paymentAPI.confirm(id).then(()=>{ toast.success('Payment confirmed!'); fetchOrder() }).catch(()=>{})
    }
    pollRef.current = setInterval(fetchOrder, 10000)
    return () => clearInterval(pollRef.current)
  }, [id])

  const handlePay = async () => {
    setPaying(true)
    try {
      const { data } = await paymentAPI.createSession(id)
      if (data.url.includes('demo=true') || data.url.includes('?payment=')) {
        await paymentAPI.confirm(id); await fetchOrder(); toast.success('Payment confirmed! (Demo mode)')
      } else { window.location.href = data.url }
    } catch(e) { toast.error(e.response?.data?.detail || 'Payment failed') }
    finally { setPaying(false) }
  }

  if (loading) return <div className="page-loader"><div className="spinner"/></div>
  if (!order) return <div className="page"><div className="container"><p>Order not found.</p></div></div>

  const stepIdx = STEPS.indexOf(order.status)
  const isCancelled = order.status === 'Cancelled'

  return (
    <div className="page"><div className="container" style={{maxWidth:760}}>
      <div className="page-header">
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
          <div><h1>Order #{order.id}</h1><p>{new Date(order.created_at).toLocaleString()}</p></div>
          <span className={`badge ${STATUS_COLORS[order.status]||'badge-mid'}`} style={{fontSize:14,padding:'6px 14px'}}>{order.status}</span>
        </div>
      </div>

      {!isCancelled && (
        <div className="card od-tracker">
          <h3 style={{marginBottom:24}}>Order Progress</h3>
          <div className="tracker-steps">
            {STEPS.map((step,i)=>{
              const Icon = ICONS[i]
              const done = stepIdx > i; const active = stepIdx === i
              return (
                <div key={step} className="tracker-step">
                  <div className={`step-circle ${done?'done':''} ${active?'active':''}`}>
                    {done ? <CheckCircle size={22}/> : <Icon size={22}/>}
                  </div>
                  <span className={`step-label ${active?'active':''}`}>{step}</span>
                  {i < STEPS.length-1 && <div className={`step-line ${done?'done':''}`}/>}
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="card" style={{padding:20,marginBottom:16}}>
        <h3 style={{marginBottom:16}}>Order Items</h3>
        {order.items.map(i=>(
          <div key={i.id} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid var(--border)'}}>
            <div style={{display:'flex',gap:12,alignItems:'center'}}>
              {i.menu_item.image_url && <img src={i.menu_item.image_url} style={{width:48,height:48,borderRadius:8,objectFit:'cover'}}/>}
              <div><p style={{fontWeight:600}}>{i.menu_item.name}</p><p className="text-sm text-muted">₹{i.unit_price} × {i.quantity}</p></div>
            </div>
            <span style={{fontWeight:700}}>₹{i.subtotal.toFixed(2)}</span>
          </div>
        ))}
        <div style={{paddingTop:12,display:'flex',flexDirection:'column',gap:6}}>
          {order.promo_code && <div style={{display:'flex',justifyContent:'space-between',color:'var(--success)'}}><span>Promo ({order.promo_code})</span><span>-₹{order.discount_amount.toFixed(2)}</span></div>}
          <div style={{display:'flex',justifyContent:'space-between',fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:17}}><span>Total</span><span>₹{order.total_amount.toFixed(2)}</span></div>
        </div>
      </div>

      <div className="card" style={{padding:20,marginBottom:16}}>
        <h3 style={{marginBottom:12}}>Delivery Details</h3>
        <p className="text-sm"><strong>Address:</strong> {order.delivery_address}</p>
        {order.notes && <p className="text-sm" style={{marginTop:6}}><strong>Notes:</strong> {order.notes}</p>}
      </div>

      <div className="card od-payment">
        <div>
          <h3>Payment</h3>
          <span className={`badge ${order.payment_status==='Paid'?'badge-success':'badge-warning'}`} style={{marginTop:6}}>{order.payment_status}</span>
        </div>
        {order.payment_status !== 'Paid' && order.status !== 'Cancelled' && (
          <button className="btn btn-primary" onClick={handlePay} disabled={paying}>
            <CreditCard size={16}/> {paying ? 'Processing…' : 'Pay Now'}
          </button>
        )}
      </div>
    </div></div>
  )
}
