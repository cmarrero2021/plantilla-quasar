import { boot } from 'quasar/wrappers'
import axios from 'axios'
import { Notify } from 'quasar'
import { useRouter } from 'vue-router'
const api = axios.create({
  baseURL: process.env.API_BASE_URL
})
export default boot(({ app, router }) => {
  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('accessToken')
        Notify.create({
          type: 'negative',
          message: 'Autenticación no válida',
          caption: 'Por favor, inicie sesión nuevamente',
          position: 'top',
          timeout: 2000
        })
        router.push('/login')
      }
      return Promise.reject(error)
    }
  )
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})
export { api }
