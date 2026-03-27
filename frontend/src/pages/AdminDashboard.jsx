import { useState, useEffect } from 'react'
import { restaurantAPI, orderAPI } from '../services/api'
import toast from 'react-hot-toast'
import './AdminDashboard.css'

const ORDER_STATUSES = ['Placed','Preparing','Out for Delivery','Delivered','Cancelled']
const STATUS_COLORS = { Placed:'badge-blue', Preparing:'badge-warning', 'Out for Delivery':'badge-brand', Delivered:'badge-success', Cancelled:'badge-error' }

export default function AdminDashboard() {
  const [tab, setTab] = useState('orders')
  const [orders, setOrders] = useState([]); const [ordersLoading, setOrdersLoading] = useState(true)
  const [rForm, setRForm] = useState({ name:'', location:'', cuisine_type:'', description:'', image_url:'', delivery_time:'30-40 min', min_order:0 })
  const [mForm, setMForm] = useState({ restaurant_id:'', name:'', price:'', description:'', category:'', image_url:'', is_veg:false })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (tab==='orders') orderAPI.allOrders().then(r=>setOrders(r.data)).finally(()=>setOrdersLoading(false))
  }, [tab])

  const updateStatus = async (id, status) => {
    try { const { data } = await orderAPI.updateStatus(id, status); setOrders(o=>o.map(x=>x.id===id?data:x)); toast.success('Status updated') }
    catch(e) { toast.error(e.response?.data?.detail || 'Failed') }
  }

  const addRestaurant = async e => {
    e.preventDefault(); setSubmitting(true)
    try { await restaurantAPI.create({...rForm, min_order: parseFloat(rForm.min_order)||0}); toast.success('Restaurant added!'); setRForm({ name:'', location:'', cuisine_type:'', description:'', image_url:'', delivery_time:'30-40 min', min_order:0 }) }
    catch(e) { toast.error(e.response?.data?.detail || 'Failed') } finally { setSubmitting(false) }
  }

  const addMenuItem = async e => {
    e.preventDefault(); setSubmitting(true)
    try { await restaurantAPI.createItem({...mForm, restaurant_id: parseInt(mForm.restaurant_id), price: parseFloat(mForm.price)}); toast.success('Menu item added!'); setMForm({ restaurant_id:'', name:'', price:'', description:'', category:'', image_url:'', is_veg:false }) }
    catch(e) { toast.error(e.response?.data?.detail || 'Failed') } finally { setSubmitting(false) }
  }

  return (
    <div className="page"><div className="container">
      <div className="page-header"><h1>🔑 Admin Dashboard</h1><p>Manage restaurants, menus and orders</p></div>
      <div className="admin-tabs">
        {['orders','add-restaurant','add-menu-item'].map(t=>(
          <button key={t} className={`admin-tab ${tab===t?'active':''}`} onClick={()=>setTab(t)}>
            {t==='orders'?'All Orders':t==='add-restaurant'?'Add Restaurant':'Add Menu Item'}
          </button>
        ))}
      </div>

      {tab==='orders' && (
        ordersLoading ? <div className="page-loader"><div className="spinner"/></div> :
        <div>
          <p style={{marginBottom:16,color:'var(--mid)'}}>{orders.length} total orders</p>
          <div style={{overflowX:'auto'}}>
            <table className="admin-table">
              <thead><tr><th>#</th><th>User</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Change Status</th></tr></thead>
              <tbody>
                {orders.map(o=>(
                  <tr key={o.id}>
                    <td><strong>#{o.id}</strong></td>
                    <td>User #{o.user_id}</td>
                    <td>{o.items.length} items</td>
                    <td><strong>₹{o.total_amount.toFixed(2)}</strong></td>
                    <td><span className={`badge ${o.payment_status==='Paid'?'badge-success':'badge-warning'}`}>{o.payment_status}</span></td>
                    <td><span className={`badge ${STATUS_COLORS[o.status]||'badge-mid'}`}>{o.status}</span></td>
                    <td>
                      <select className="input" style={{padding:'6px 10px',fontSize:13}} value={o.status} onChange={e=>updateStatus(o.id, e.target.value)}>
                        {ORDER_STATUSES.map(s=><option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab==='add-restaurant' && (
        <div className="admin-form card">
          <h3 style={{marginBottom:20}}>Add New Restaurant</h3>
          <form onSubmit={addRestaurant}>
            <div className="form-grid">
              {[['name','Restaurant Name','text',true],['location','Location','text',true],['cuisine_type','Cuisine Type','text',true],['description','Description','text',false],['image_url','Image URL','url',false],['delivery_time','Delivery Time','text',false]].map(([k,label,type,req])=>(
                <div key={k} className="input-group">
                  <label>{label}</label>
                  <input className="input" type={type} required={req} value={rForm[k]} onChange={e=>setRForm({...rForm,[k]:e.target.value})} placeholder={label}/>
                </div>
              ))}
              <div className="input-group">
                <label>Min Order (₹)</label>
                <input className="input" type="number" value={rForm.min_order} onChange={e=>setRForm({...rForm,min_order:e.target.value})} placeholder="0"/>
              </div>
            </div>
            <button className="btn btn-primary" type="submit" disabled={submitting} style={{marginTop:16}}>{submitting?'Adding…':'Add Restaurant'}</button>
          </form>
        </div>
      )}

      {tab==='add-menu-item' && (
        <div className="admin-form card">
          <h3 style={{marginBottom:20}}>Add Menu Item</h3>
          <form onSubmit={addMenuItem}>
            <div className="form-grid">
              <div className="input-group">
                <label>Restaurant ID *</label>
                <input className="input" type="number" required value={mForm.restaurant_id} onChange={e=>setMForm({...mForm,restaurant_id:e.target.value})} placeholder="e.g. 1"/>
              </div>
              {[['name','Item Name','text',true],['price','Price (₹)','number',true],['category','Category','text',false],['description','Description','text',false],['image_url','Image URL','url',false]].map(([k,label,type,req])=>(
                <div key={k} className="input-group">
                  <label>{label}</label>
                  <input className="input" type={type} required={req} value={mForm[k]} onChange={e=>setMForm({...mForm,[k]:e.target.value})} placeholder={label}/>
                </div>
              ))}
              <div className="input-group">
                <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer'}}>
                  <input type="checkbox" checked={mForm.is_veg} onChange={e=>setMForm({...mForm,is_veg:e.target.checked})}/>
                  Vegetarian
                </label>
              </div>
            </div>
            <button className="btn btn-primary" type="submit" disabled={submitting} style={{marginTop:16}}>{submitting?'Adding…':'Add Menu Item'}</button>
          </form>
        </div>
      )}
    </div></div>
  )
}
