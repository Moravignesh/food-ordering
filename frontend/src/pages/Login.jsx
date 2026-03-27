import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChefHat, Mail, Lock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import './Auth.css'
export default function Login() {
  const [form, setForm] = useState({ email:'', password:'' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth(); const navigate = useNavigate()
  const handle = async e => {
    e.preventDefault(); setLoading(true)
    try { await login(form.email, form.password); navigate('/restaurants') }
    catch(err) { toast.error(err.response?.data?.detail || 'Login failed') }
    finally { setLoading(false) }
  }
  return (
    <div className="auth-page">
      <div className="auth-card card fade-in">
        <div className="auth-header"><ChefHat size={38} color="var(--brand)"/><h2>Welcome Back</h2><p>Sign in to your account</p></div>
        <div className="demo-row">
          <button className="btn btn-ghost btn-sm" onClick={()=>setForm({email:'user@foodapp.com',password:'user123'})}>👤 Demo User</button>
          <button className="btn btn-ghost btn-sm" onClick={()=>setForm({email:'admin@foodapp.com',password:'admin123'})}>🔑 Demo Admin</button>
        </div>
        <form onSubmit={handle}>
          <div className="input-group" style={{marginBottom:14}}>
            <label>Email</label>
            <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/>
          </div>
          <div className="input-group" style={{marginBottom:20}}>
            <label>Password</label>
            <input className="input" type="password" placeholder="••••••••" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required/>
          </div>
          <button className="btn btn-primary w-full" disabled={loading}>{loading?'Signing in…':'Sign In'}</button>
        </form>
        <p className="auth-footer">No account? <Link to="/register">Create one</Link></p>
      </div>
    </div>
  )
}
