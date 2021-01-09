import axios from "axios";

const instance = axios.create({
  baseURL: "https://syafiqtermizi.com",
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFTOKEN",
});

export default instance;
