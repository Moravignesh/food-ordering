import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'
const AuthContext = createContext(null)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('user')) } catch { return null } })
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) { authAPI.me().then(r=>setUser(r.data)).catch(()=>{localStorage.removeItem('token');localStorage.removeItem('user')}).finally(()=>setLoading(false)) }
    else setLoading(false)
  }, [])
  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password })
    localStorage.setItem('token', data.access_token); localStorage.setItem('user', JSON.stringify(data.user)); setUser(data.user)
    toast.success(`Welcome back, ${data.user.name}!`); return data
  }
  const register = async (formData) => {
    const { data } = await authAPI.register(formData)
    localStorage.setItem('token', data.access_token); localStorage.setItem('user', JSON.stringify(data.user)); setUser(data.user)
    toast.success(`Welcome, ${data.user.name}!`); return data
  }
  const logout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); setUser(null); toast.success('Logged out') }
  return <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.is_admin }}>{children}</AuthContext.Provider>
}
export const useAuth = () => useContext(AuthContext)
