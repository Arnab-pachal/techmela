import axios from "axios"
export const axiosInstance =axios.create({
    baseURL:'https://techmelaback.onrender.com',
    withCredentials:true,
    
})