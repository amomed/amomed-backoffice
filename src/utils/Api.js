import axios from "axios";

const dev_url_ios = "http://127.0.0.1:3000/api/"
const dev_url = "http://localhost:3000/api/"

const Api = axios.create({
    baseURL: dev_url_ios
});

export default Api