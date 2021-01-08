import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8000",
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFTOKEN",
});

export default instance;
