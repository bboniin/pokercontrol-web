import axios from "axios";

const api = axios.create({
  baseURL: "http://209.97.150.15:3333",
  //    baseURL: "http://localhost:3333",
});

export default api;
