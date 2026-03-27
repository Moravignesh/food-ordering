import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Star, Clock, MapPin, Plus, Minus, ShoppingCart, Leaf } from 'lucide-react'
import { restaurantAPI, reviewAPI } from '../services/api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import './RestaurantDetail.css'

export default function RestaurantDetail() {
  const { id } = useParams(); const navigate = useNavigate()
  const [restaurant, setRestaurant] = useState(null)
  const [menu, setMenu] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('menu')
  const [myRating, setMyRating] = useState(5)
  const [myComment, setMyComment] = useState('')
  const { addToCart } = useCart(); const { user } = useAuth()
  const [qty, setQty] = useState({})

  useEffect(() => {
    Promise.all([restaurantAPI.get(id), restaurantAPI.menu(id), reviewAPI.list(id)])
      .then(([r,m,rv]) => { setRestaurant(r.data); setMenu(m.data); setReviews(rv.data) })
      .catch(() => navigate('/restaurants'))
      .finally(() => setLoading(false))
  }, [id])

  const handleAdd = async (item) => {
    if (!user) { toast.error('Please login to add items'); navigate('/login'); return }
    try {
      await addToCart(item.id, qty[item.id]||1)
      toast.success(`${item.name} added to cart!`)
    } catch(e) { toast.error(e.response?.data?.detail || 'Failed to add') }
  }

  const submitReview = async () => {
    if (!user) { toast.error('Login to review'); return }
    try {
      const { data } = await reviewAPI.create({ restaurant_id: parseInt(id), rating: myRating, comment: myComment })
      setReviews(prev => [data, ...prev.filter(r => r.user_id !== user.id)])
      toast.success('Review submitted!')
    } catch { toast.error('Failed to submit review') }
  }

  if (loading) return <div className="page-loader"><div className="spinner"/></div>
  if (!restaurant) return null

  const categories = [...new Set(menu.map(i=>i.category).filter(Boolean))]
  
  return (
    <div className="page">
      <div className="container">
        <div className="rd-hero card">
          <img src={restaurant.image_url||'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900'} alt={restaurant.name} className="rd-hero-img"/>
          <div className="rd-hero-body">
            <div>
              <span className="badge badge-brand" style={{marginBottom:8}}>{restaurant.cuisine_type}</span>
              <h1 style={{fontSize:28,marginBottom:6}}>{restaurant.name}</h1>
              <p style={{color:'var(--mid)',marginBottom:12}}>{restaurant.description}</p>
              <div className="rd-meta">
                <span><Star size={15} fill="#f59e0b" color="#f59e0b"/> {restaurant.rating || 'New'}</span>
                <span><Clock size={15}/> {restaurant.delivery_time}</span>
                <span><MapPin size={15}/> {restaurant.location}</span>
              </div>
            </div>
            <button className="btn btn-primary" onClick={()=>navigate('/cart')}><ShoppingCart size={16}/> View Cart</button>
          </div>
        </div>

        <div className="rd-tabs">
          {['menu','reviews'].map(t=><button key={t} className={`rd-tab ${activeTab===t?'active':''}`} onClick={()=>setActiveTab(t)}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>)}
        </div>

        {activeTab==='menu' && (
          <div>
            {categories.length > 0 ? categories.map(cat=>(
              <div key={cat} className="menu-section">
                <h2 className="menu-cat-title">{cat}</h2>
                <div className="menu-grid">
                  {menu.filter(i=>i.category===cat).map(item=>(
                    <div key={item.id} className="menu-item card fade-in">
                      {item.image_url && <img src={item.image_url} alt={item.name} className="menu-item-img"/>}
                      <div className="menu-item-body">
                        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:8}}>
                          <div>
                            <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:4}}>
                              {item.is_veg ? <Leaf size={14} color="var(--success)"/> : <span style={{fontSize:12,color:'#ef4444'}}>🍖</span>}
                              <h4 className="menu-item-name">{item.name}</h4>
                            </div>
                            <p className="menu-item-desc">{item.description}</p>
                          </div>
                          <span className="menu-item-price">₹{item.price}</span>
                        </div>
                        <div className="menu-item-actions">
                          <div className="qty-ctrl">
                            <button onClick={()=>setQty({...qty,[item.id]:Math.max(1,(qty[item.id]||1)-1)})}>-</button>
                            <span>{qty[item.id]||1}</span>
                            <button onClick={()=>setQty({...qty,[item.id]:(qty[item.id]||1)+1})}>+</button>
                          </div>
                          <button className="btn btn-primary btn-sm" onClick={()=>handleAdd(item)}><Plus size={14}/> Add</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )) : (
              <div className="menu-grid">
                {menu.map(item=>(
                  <div key={item.id} className="menu-item card fade-in">
                    {item.image_url && <img src={item.image_url} alt={item.name} className="menu-item-img"/>}
                    <div className="menu-item-body">
                      <div style={{display:'flex',justifyContent:'space-between',gap:8}}>
                        <div><h4 className="menu-item-name">{item.name}</h4><p className="menu-item-desc">{item.description}</p></div>
                        <span className="menu-item-price">₹{item.price}</span>
                      </div>
                      <div className="menu-item-actions">
                        <div className="qty-ctrl">
                          <button onClick={()=>setQty({...qty,[item.id]:Math.max(1,(qty[item.id]||1)-1)})}>-</button>
                          <span>{qty[item.id]||1}</span>
                          <button onClick={()=>setQty({...qty,[item.id]:(qty[item.id]||1)+1})}>+</button>
                        </div>
                        <button className="btn btn-primary btn-sm" onClick={()=>handleAdd(item)}><Plus size={14}/> Add</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab==='reviews' && (
          <div>
            {user && (
              <div className="card" style={{padding:24,marginBottom:24}}>
                <h3 style={{marginBottom:16}}>Write a Review</h3>
                <div style={{display:'flex',gap:8,marginBottom:12}}>
                  {[1,2,3,4,5].map(n=><button key={n} onClick={()=>setMyRating(n)} style={{fontSize:24,background:'none',border:'none',cursor:'pointer',opacity:n<=myRating?1:.3}}>⭐</button>)}
                </div>
                <textarea className="input" rows={3} placeholder="Share your experience…" value={myComment} onChange={e=>setMyComment(e.target.value)} style={{marginBottom:12,resize:'vertical'}}/>
                <button className="btn btn-primary" onClick={submitReview}>Submit Review</button>
              </div>
            )}
            {reviews.length === 0 ? <div className="empty-state"><Star size={48}/><h3>No reviews yet</h3><p>Be the first to review!</p></div>
            : reviews.map(rv=>(
              <div key={rv.id} className="card" style={{padding:20,marginBottom:12}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                  <strong>{rv.user.name}</strong>
                  <span>{'⭐'.repeat(rv.rating)}</span>
                </div>
                <p style={{color:'var(--mid)',fontSize:14}}>{rv.comment}</p>
                <p style={{fontSize:12,color:'#aaa',marginTop:6}}>{new Date(rv.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
