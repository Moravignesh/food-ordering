import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, User, LogOut, ChefHat, Menu, X, LayoutDashboard } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import './Navbar.css'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()
  const loc = useLocation()
  const [open, setOpen] = useState(false)
  const active = p => loc.pathname === p || loc.pathname.startsWith(p+'/') ? 'active' : ''
  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo"><ChefHat size={26} /><span>FoodRush</span></Link>
        <div className={`navbar-links ${open?'open':''}`}>
          <Link to="/" className={loc.pathname==='/'?'active':''} onClick={()=>setOpen(false)}>Home</Link>
          <Link to="/restaurants" className={active('/restaurants')} onClick={()=>setOpen(false)}>Restaurants</Link>
          {isAdmin && <Link to="/admin" className={active('/admin')} onClick={()=>setOpen(false)}>Admin</Link>}
        </div>
        <div className="navbar-actions">
          {user ? (<>
            <Link to="/cart" className="cart-btn" title="Cart">
              <ShoppingCart size={20} />
              {itemCount>0 && <span className="cart-badge">{itemCount}</span>}
            </Link>
            <Link to="/orders" className="icon-btn" title="My Orders"><User size={20}/></Link>
            <button className="icon-btn" title="Logout" onClick={()=>{logout();navigate('/')}}><LogOut size={20}/></button>
          </>) : (<>
            <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
          </>)}
          <button className="mobile-toggle" onClick={()=>setOpen(!open)}>{open?<X size={22}/>:<Menu size={22}/>}</button>
        </div>
      </div>
    </nav>
  )
}
