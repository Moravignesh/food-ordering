import { ChefHat } from 'lucide-react'
import { Link } from 'react-router-dom'
export default function Footer() {
  return (
    <footer style={{background:'var(--dark)',color:'#aaa',padding:'20px 0',marginTop:'auto'}}>
      <div className="container" style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
        <div style={{display:'flex',alignItems:'center',gap:8,fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:17,color:'#fff'}}><ChefHat size={22}/>FoodRush</div>
        <p style={{fontSize:13}}>© 2024 FoodRush. Built for evaluation.</p>
        <div style={{display:'flex',gap:20}}><Link to="/restaurants" style={{fontSize:13,color:'#aaa'}}>Restaurants</Link><Link to="/orders" style={{fontSize:13,color:'#aaa'}}>Orders</Link></div>
      </div>
    </footer>
  )
}
