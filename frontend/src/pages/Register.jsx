import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChefHat } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import './Auth.css'
export default function Register() {
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'', address:'' })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth(); const navigate = useNavigate()
  const handle = async e => {
    e.preventDefault(); setLoading(true)
    try { await register(form); navigate('/restaurants') }
    catch(err) { toast.error(err.response?.data?.detail || 'Registration failed') }
    finally { setLoading(false) }
  }
  const f = (k,v) => setForm({...form,[k]:v})
  return (
    <div className="auth-page">
      <div className="auth-card card fade-in">
        <div className="auth-header"><ChefHat size={38} color="var(--brand)"/><h2>Create Account</h2><p>Join FoodRush today</p></div>
        <form onSubmit={handle}>
          {[['name','Full Name','text','John Doe'],['email','Email','email','you@example.com'],['password','Password','password','••••••••'],['phone','Phone (optional)','tel','9876543210'],['address','Delivery Address (optional)','text','123 Main St']].map(([key,label,type,ph])=>(
            <div key={key} className="input-group" style={{marginBottom:12}}>
              <label>{label}</label>
              <input className="input" type={type} placeholder={ph} value={form[key]} onChange={e=>f(key,e.target.value)} required={!['phone','address'].includes(key)}/>
            </div>
          ))}
          <button className="btn btn-primary w-full" style={{marginTop:8}} disabled={loading}>{loading?'Creating…':'Create Account'}</button>
        </form>
        <p className="auth-footer">Have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  )
}
