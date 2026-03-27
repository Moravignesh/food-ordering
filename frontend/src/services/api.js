import axios from 'axios'
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' })
api.interceptors.request.use(c => { const t = localStorage.getItem('token'); if(t) c.headers.Authorization=`Bearer ${t}`; return c })
api.interceptors.response.use(r=>r, e=>{ if(e.response?.status===401){ localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href='/login' } return Promise.reject(e) })

export const authAPI = {
  register: d => api.post('/auth/register',d),
  login: d => api.post('/auth/login',d),
  me: () => api.get('/auth/me'),
}
export const restaurantAPI = {
  list: p => api.get('/restaurants',{params:p}),
  get: id => api.get(`/restaurants/${id}`),
  create: d => api.post('/restaurants',d),
  menu: (id,p) => api.get(`/restaurants/${id}/menu`,{params:p}),
  createItem: d => api.post('/menu-items',d),
  updateItem: (id,d) => api.put(`/menu-items/${id}`,d),
}
export const cartAPI = {
  get: () => api.get('/cart'),
  add: d => api.post('/cart/add',d),
  update: (id,qty) => api.patch(`/cart/update/${id}?quantity=${qty}`),
  remove: id => api.delete(`/cart/remove/${id}`),
  clear: () => api.delete('/cart/clear'),
}
export const orderAPI = {
  place: d => api.post('/orders',d),
  list: () => api.get('/orders'),
  get: id => api.get(`/orders/${id}`),
  updateStatus: (id,status) => api.patch(`/orders/${id}/status`,{status}),
  allOrders: p => api.get('/orders/admin/all',{params:p}),
}
export const paymentAPI = {
  createSession: id => api.post(`/payments/create-session/${id}`),
  confirm: id => api.post(`/payments/confirm/${id}`),
}
export const reviewAPI = {
  create: d => api.post('/reviews',d),
  list: id => api.get(`/reviews/restaurant/${id}`),
}
export default api
