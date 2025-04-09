import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000', // 🔁 Change to your backend base URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // set to true if using cookies
});

export default api;
