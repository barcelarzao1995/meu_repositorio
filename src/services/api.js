// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.0.44:3001/api', // substitua pelo IP do seu backend na mesma rede
});

export default api;
