import { reactive, readonly } from 'vue'
import { authApi } from '../services/api'

const state = reactive({
  user: null,
  loaded: false,
  loading: false,
})

let pendingLoad = null

const loadUser = async (force = false) => {
  if (state.loaded && !force) return state.user
  if (pendingLoad) return pendingLoad

  state.loading = true
  pendingLoad = authApi
    .user()
    .then(({ data }) => {
      state.user = data
      return data
    })
    .catch((error) => {
      if (error.response?.status !== 401) throw error
      state.user = null
      return null
    })
    .finally(() => {
      state.loaded = true
      state.loading = false
      pendingLoad = null
    })

  return pendingLoad
}

const authenticate = async (action, credentials) => {
  await authApi.csrf()
  const { data } = await action(credentials)
  state.user = data
  state.loaded = true
  return data
}

const login = (credentials) => authenticate(authApi.login, credentials)
const customerLogin = (credentials) => authenticate(authApi.customerLogin, credentials)

const logout = async () => {
  await authApi.csrf()
  await authApi.logout()
  state.user = null
  state.loaded = true
}

export const useAuth = () => ({
  auth: readonly(state),
  loadUser,
  login,
  customerLogin,
  logout,
})
