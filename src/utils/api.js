import axios from 'axios'

const api = axios.create({
  baseURL: 'https://estoque.danyllo106.com'
})

export default api;