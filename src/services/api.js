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
}
