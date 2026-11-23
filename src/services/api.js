import { http } from '../lib/http'

const unwrap = ({ data }) => data

export const publicApi = {
  products: (limit) => http.get('/api/v1/products', { params: limit ? { limit } : {} }).then(unwrap),
  aboutUs: () => http.get('/api/v1/about-us').then(unwrap),
  registerMember: (payload) =>
    http
      .get('/sanctum/csrf-cookie')
      .then(() => http.post('/api/v1/members', payload))
      .then(unwrap),
  submitTestimonial: (payload) => http.post('/api/v1/testimonials', payload).then(unwrap),
}

export const authApi = {
  csrf: () => http.get('/sanctum/csrf-cookie'),
  login: (payload) => http.post('/api/v1/auth/login', payload).then(unwrap),
  customerLogin: (payload) => http.post('/api/v1/auth/customer/login', payload).then(unwrap),
  user: () => http.get('/api/v1/auth/user').then(unwrap),
  logout: () => http.post('/api/v1/auth/logout').then(unwrap),
}

export const cartApi = {
  get: () => http.get('/api/v1/cart').then(unwrap),
  add: (payload) => http.post('/api/v1/cart/items', payload).then(unwrap),
  update: (id, payload) => http.patch(`/api/v1/cart/items/${id}`, payload).then(unwrap),
  remove: (id) => http.delete(`/api/v1/cart/items/${id}`).then(unwrap),
}

export const orderApi = {
  list: () => http.get('/api/v1/orders').then(unwrap),
  find: (id) => http.get(`/api/v1/orders/${id}`).then(unwrap),
  checkout: (payload) => http.post('/api/v1/orders', payload).then(unwrap),
  bankAccounts: () => http.get('/api/v1/bank-accounts').then(unwrap),
  submitPayment: (id, payload) => http.post(`/api/v1/orders/${id}/payment`, payload).then(unwrap),
}

export const adminApi = {
  dashboard: () => http.get('/api/v1/admin/dashboard').then(unwrap),
  list: (resource, page = 1) => http.get(`/api/v1/admin/${resource}`, { params: { page } }).then(unwrap),
  find: (resource, id) => http.get(`/api/v1/admin/${resource}/${id}`).then(unwrap),
  create: (resource, payload) => http.post(`/api/v1/admin/${resource}`, payload).then(unwrap),
  update: (resource, id, payload, usesFormData = false) => {
    if (usesFormData) {
      payload.append('_method', 'PUT')
      return http.post(`/api/v1/admin/${resource}/${id}`, payload).then(unwrap)
    }

    return http.put(`/api/v1/admin/${resource}/${id}`, payload).then(unwrap)
  },
  remove: (resource, id) => http.delete(`/api/v1/admin/${resource}/${id}`).then(unwrap),
  orders: (params = {}) => http.get('/api/v1/admin/orders', { params }).then(unwrap),
  order: (id) => http.get(`/api/v1/admin/orders/${id}`).then(unwrap),
  updateOrderStatus: (id, status) => http.patch(`/api/v1/admin/orders/${id}/status`, { status }).then(unwrap),
  addOrderPayment: (id, payload) => http.post(`/api/v1/admin/orders/${id}/payment`, payload).then(unwrap),
  verifyOrderPayment: (id) => http.post(`/api/v1/admin/orders/${id}/payment/verify`).then(unwrap),
  rejectOrderPayment: (id, payload) => http.post(`/api/v1/admin/orders/${id}/payment/reject`, payload).then(unwrap),
  bankAccounts: () => http.get('/api/v1/admin/bank-accounts').then(unwrap),
  createBankAccount: (payload) => http.post('/api/v1/admin/bank-accounts', payload).then(unwrap),
  updateBankAccount: (id, payload) => http.put(`/api/v1/admin/bank-accounts/${id}`, payload).then(unwrap),
  updateBankAccountStatus: (id, is_active) =>
    http.patch(`/api/v1/admin/bank-accounts/${id}/status`, { is_active }).then(unwrap),
}
