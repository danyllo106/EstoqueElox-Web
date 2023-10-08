import axios from 'axios'
//const baseURL =  baseURL: 'https://estoquecaminhao.danyllo106.com'
export const baseURL = 'https://estoquecaminhao.danyllo106.com';
export const api = axios.create({
  baseURL
})
