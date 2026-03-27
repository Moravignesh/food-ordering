import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Star, Clock, MapPin } from 'lucide-react'
import { restaurantAPI } from '../services/api'
import './Restaurants.css'
export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sp] = useSearchParams()
  useEffect(() => {
    const cuisine = sp.get('cuisine') || ''
    setLoading(true)
    restaurantAPI.list({ search, cuisine }).then(r=>setRestaurants(r.data)).catch(()=>{}).finally(()=>setLoading(false))
  }, [search, sp])
  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>All Restaurants</h1>
          <p>Discover amazing food near you</p>
        </div>
        <div className="search-bar">
          <Search size={18} className="search-icon"/>
          <input className="search-input" placeholder="Search restaurants or cuisines…" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        {loading ? <div className="page-loader"><div className="spinner"/></div> : (
          restaurants.length === 0 ? (
            <div className="empty-state"><Search size={48}/><h3>No restaurants found</h3><p>Try a different search</p></div>
          ) : (
            <div className="grid-3">
              {restaurants.map(r=>(
                <Link to={`/restaurants/${r.id}`} key={r.id} className="r-card card fade-in">
                  <div className="r-img-wrap">
                    <img src={r.image_url||'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400'} alt={r.name}/>
                    <span className="r-cuisine badge badge-brand">{r.cuisine_type}</span>
                  </div>
                  <div className="r-body">
                    <h3 className="r-name">{r.name}</h3>
                    <p className="r-desc">{r.description}</p>
                    <div className="r-meta">
                      <span><Star size={13} fill="currentColor"/> {r.rating || 'New'}</span>
                      <span><Clock size={13}/> {r.delivery_time}</span>
                      <span><MapPin size={13}/> {r.location.split(',')[0]}</span>
                    </div>
                    {r.min_order > 0 && <p className="r-min">Min order: ₹{r.min_order}</p>}
                  </div>
                </Link>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  )
}
