import axios from "axios";

const api = axios.create({
  baseURL: "https://campusfind-aq4o.onrender.com/api",
});

export default api;