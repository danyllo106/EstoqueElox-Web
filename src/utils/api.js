import axios from 'axios'

const api = axios.create({
  baseURL: 'http://estoque.danyllo106.com'
})

export default api;