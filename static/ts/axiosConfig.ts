import axios, { AxiosRequestConfig } from "axios";

const createAxios = () => {
  const baseURL =
    process.env.NODE_ENV === "production"
      ? "https://syafiqtermizi.com"
      : "http://localhost:8000";

  const axiosConfig: AxiosRequestConfig = {
    baseURL,
    xsrfCookieName: "csrftoken",
    xsrfHeaderName: "X-CSRFTOKEN",
  };

  if (localStorage.getItem("token")) {
    axiosConfig.headers = {
      Authorization: `Token ${localStorage.getItem("token")}`,
    };
  }

  return axios.create(axiosConfig);
};
export default createAxios;
