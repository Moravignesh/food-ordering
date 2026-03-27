import { Link } from 'react-router-dom'
import { ArrowRight, Clock, Shield, Star, Zap } from 'lucide-react'
import './Home.css'
export default function Home() {
  const cuisines = ['🍕 Italian','🍔 American','🍜 Asian','🌮 Mexican','🍱 Japanese','🍛 Indian']
  const features = [
    {icon:<Zap size={26}/>,title:'Lightning Fast',desc:'Avg delivery in under 30 minutes'},
    {icon:<Star size={26}/>,title:'Top Rated',desc:'Curated restaurants with 4+ ratings'},
    {icon:<Shield size={26}/>,title:'Secure Payments',desc:'Stripe-powered secure checkout'},
    {icon:<Clock size={26}/>,title:'Live Tracking',desc:'Real-time order status updates'},
  ]
  return (
    <div>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-content fade-in">
            <span className="badge badge-brand" style={{marginBottom:16}}>🔥 Hot & Fresh Delivery</span>
            <h1>Order Food You <em>Love</em>,<br/>Delivered Fast</h1>
            <p>Browse hundreds of restaurants, pick your favourites, and get hot food delivered to your door.</p>
            <div className="hero-btns">
              <Link to="/restaurants" className="btn btn-primary btn-lg">Explore Restaurants <ArrowRight size={16}/></Link>
              <Link to="/register" className="btn btn-outline btn-lg">Get Started Free</Link>
            </div>
            <div className="hero-stats">
              <div><strong>50+</strong><span>Restaurants</span></div>
              <div><strong>500+</strong><span>Menu Items</span></div>
              <div><strong>30 min</strong><span>Avg Delivery</span></div>
            </div>
          </div>
          <div className="hero-img-wrap fade-in">
            <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=700&q=80" alt="Food"/>
            <div className="hero-float-card">⭐ 4.8 Average Rating</div>
          </div>
        </div>
      </section>

      <section style={{padding:'56px 0',background:'#fff'}}>
        <div className="container">
          <h2 style={{textAlign:'center',fontSize:26,marginBottom:28}}>What Are You Craving?</h2>
          <div style={{display:'flex',flexWrap:'wrap',gap:12,justifyContent:'center'}}>
            {cuisines.map(c=><Link key={c} to={`/restaurants?cuisine=${c.split(' ')[1]}`} className="cuisine-chip">{c}</Link>)}
          </div>
        </div>
      </section>

      <section style={{padding:'64px 0'}}>
        <div className="container">
          <h2 style={{textAlign:'center',fontSize:26,marginBottom:36}}>Why Choose FoodRush?</h2>
          <div className="grid-4">
            {features.map(f=>(
              <div key={f.title} className="card feature-card fade-in">
                <div className="feature-icon">{f.icon}</div>
                <h3 style={{fontSize:16,marginBottom:6}}>{f.title}</h3>
                <p style={{color:'var(--mid)',fontSize:13}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container" style={{textAlign:'center'}}>
          <h2 style={{color:'#fff',fontSize:34,marginBottom:12}}>Ready to Order?</h2>
          <p style={{opacity:.9,marginBottom:28,fontSize:16}}>Join thousands of happy customers</p>
          <Link to="/restaurants" className="btn" style={{background:'#fff',color:'var(--brand)',fontWeight:700,padding:'14px 32px'}}>Browse Restaurants <ArrowRight size={16}/></Link>
        </div>
      </section>
    </div>
  )
}
