import axios from "axios";

const baseURL = process.env.NODE_ENV === "production" ? "https://syafiqtermizi.com" : "http://localhost:8000";
const instance = axios.create({
  baseURL,
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFTOKEN",
});

export default instance;
