import axios from "axios";

const dev_url_ios = "http://127.0.0.1:3000/api/"
const dev_url = "http://localhost:3000/api/"
const prod_url = "https://amomedbackend.com//api/"

const Api = axios.create({
    baseURL: prod_url
});

export default Api