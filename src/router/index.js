import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import PublicLayout from '../layouts/PublicLayout.vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import HomeView from '../views/public/HomeView.vue'
import ProductsView from '../views/public/ProductsView.vue'
import RegisterMemberView from '../views/public/RegisterMemberView.vue'
import TestimonialView from '../views/public/TestimonialView.vue'
import AboutUsView from '../views/public/AboutUsView.vue'
import ProfileView from '../views/public/ProfileView.vue'
import CustomerLoginView from '../views/public/CustomerLoginView.vue'
import CartView from '../views/public/CartView.vue'
import CheckoutView from '../views/public/CheckoutView.vue'
import OrdersView from '../views/public/OrdersView.vue'
import OrderDetailView from '../views/public/OrderDetailView.vue'
import AdminLoginView from '../views/admin/AdminLoginView.vue'
import DashboardView from '../views/admin/DashboardView.vue'
import ResourceIndexView from '../views/admin/ResourceIndexView.vue'
import ResourceFormView from '../views/admin/ResourceFormView.vue'
import OrdersIndexView from '../views/admin/OrdersIndexView.vue'
import AdminOrderDetailView from '../views/admin/OrderDetailView.vue'
import BankAccountsView from '../views/admin/BankAccountsView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const resourceRoutes = [
  ['products', 'Katalog Produk'],
  ['members', 'Data Member'],
  ['testimonials', 'Data Pesan & Kesan'],
  ['about-us', 'Tentang Kami'],
].flatMap(([resource, title]) => [
  {
    path: resource,
    name: `admin.${resource}.index`,
    component: ResourceIndexView,
    meta: { resource, title },
  },
  {
    path: `${resource}/create`,
    name: `admin.${resource}.create`,
    component: ResourceFormView,
    meta: { resource, title: `Tambah ${title}` },
  },
  {
    path: `${resource}/:id/edit`,
    name: `admin.${resource}.edit`,
    component: ResourceFormView,
    meta: { resource, title: `Edit ${title}` },
  },
])

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    {
      path: '/',
      component: PublicLayout,
      children: [
        { path: '', name: 'home', component: HomeView, meta: { title: 'Sudut Flora' } },
        { path: 'products', name: 'products', component: ProductsView, meta: { title: 'Produk' } },
        {
          path: 'login',
          name: 'login',
          component: CustomerLoginView,
          meta: { customerGuestOnly: true, title: 'Login Member' },
        },
        {
          path: 'register-member',
          name: 'register-member',
          component: RegisterMemberView,
          meta: { title: 'Daftar Member' },
        },
        {
          path: 'testimoni',
          name: 'testimoni',
          component: TestimonialView,
          meta: { title: 'Pesan & Kesan' },
        },
        { path: 'about-us', name: 'about-us', component: AboutUsView, meta: { title: 'Tentang Kami' } },
        {
          path: 'profile',
          name: 'profile',
          component: ProfileView,
          meta: { requiresCustomer: true, title: 'Profil Member' },
        },
        { path: 'cart', name: 'cart', component: CartView, meta: { requiresCustomer: true, title: 'Keranjang' } },
        { path: 'checkout', name: 'checkout', component: CheckoutView, meta: { requiresCustomer: true, title: 'Checkout' } },
        { path: 'orders', name: 'orders', component: OrdersView, meta: { requiresCustomer: true, title: 'Riwayat Order' } },
        {
          path: 'orders/:id',
          name: 'order-detail',
          component: OrderDetailView,
          meta: { requiresCustomer: true, title: 'Detail Order' },
        },
      ],
    },
    {
      path: '/admin/login',
      name: 'admin.login',
      component: AdminLoginView,
      meta: { guestOnly: true, title: 'Login Admin' },
    },
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        { path: '', name: 'admin.dashboard', component: DashboardView, meta: { title: 'Dashboard' } },
        { path: 'orders', name: 'admin.orders.index', component: OrdersIndexView, meta: { title: 'Data Order' } },
        { path: 'orders/:id', name: 'admin.orders.show', component: AdminOrderDetailView, meta: { title: 'Detail Order' } },
        { path: 'bank-accounts', name: 'admin.bank-accounts', component: BankAccountsView, meta: { title: 'Rekening Bank' } },
        ...resourceRoutes,
      ],
    },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView, meta: { title: 'Halaman Tidak Ditemukan' } },
  ],
})

router.beforeEach(async (to) => {
  const { auth, loadUser } = useAuth()

  if (
    to.matched.some((record) => record.meta.requiresAuth || record.meta.requiresCustomer) ||
    to.meta.guestOnly ||
    to.meta.customerGuestOnly
  ) {
    await loadUser()
  }

  if (to.matched.some((record) => record.meta.requiresAuth) && !auth.user) {
    return { name: 'admin.login', query: { redirect: to.fullPath } }
  }

  if (to.meta.guestOnly && auth.user?.role === 'admin') {
    return { name: 'admin.dashboard' }
  }

  if (to.meta.guestOnly && auth.user) return { name: 'home' }

  if (to.meta.customerGuestOnly && auth.user?.role === 'customer') {
    return { name: 'profile' }
  }

  if (to.meta.customerGuestOnly && auth.user) return { name: 'home' }

  if (to.matched.some((record) => record.meta.requiresAdmin) && auth.user?.role !== 'admin') {
    return { name: 'home' }
  }

  if (to.matched.some((record) => record.meta.requiresCustomer)) {
    if (!auth.user) return { name: 'login', query: { redirect: to.fullPath } }
    if (auth.user.role !== 'customer') return { name: 'home' }
  }

  document.title = `${to.meta.title ?? 'Sudut Flora'} | Sudut Flora`
  return true
})

export default router
