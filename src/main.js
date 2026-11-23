import { createApp } from 'vue'
import AOS from 'aos'
import 'aos/dist/aos.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap'
import './styles/main.css'
import './styles/admin.css'
import './styles/app.css'
import App from './App.vue'
import router from './router'

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

if (!reduceMotion) {
  AOS.init({ once: true })
}

router.afterEach(() => {
  document.querySelector('.navbar-collapse.show')?.classList.remove('show')

  if (!reduceMotion) {
    window.requestAnimationFrame(() => AOS.refreshHard())
  }
})

createApp(App).use(router).mount('#app')
