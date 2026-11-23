import { reactive, readonly } from 'vue'
import { cartApi } from '../services/api'

const state = reactive({
  data: null,
  loaded: false,
  loading: false,
})

let pendingLoad = null

const setCart = (response) => {
  state.data = response.data
  state.loaded = true
  return state.data
}

const loadCart = async (force = false) => {
  if (state.loaded && !force) return state.data
  if (pendingLoad) return pendingLoad

  state.loading = true
  pendingLoad = cartApi
    .get()
    .then(setCart)
    .finally(() => {
      state.loading = false
      pendingLoad = null
    })

  return pendingLoad
}

const addItem = (productId, quantity = 1) => cartApi.add({ product_id: productId, quantity }).then(setCart)
const updateItem = (id, quantity) => cartApi.update(id, { quantity }).then(setCart)
const removeItem = (id) => cartApi.remove(id).then(setCart)

const resetCart = () => {
  state.data = null
  state.loaded = false
  state.loading = false
  pendingLoad = null
}

export const useCart = () => ({
  cart: readonly(state),
  loadCart,
  addItem,
  updateItem,
  removeItem,
  resetCart,
})
