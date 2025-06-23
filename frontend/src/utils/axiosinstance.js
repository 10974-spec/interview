import axios from "axios";
import { BASE_URL, API_PATHS } from "./apiPaths";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 80000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
   
});

//****REQUEST INTERCEPTOR*****//

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

//***RESPONSE INTERCEPTER****//

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        //****Handle Common errors globaly****//
        if (error.response){
            if (error.response.status === 401){
                //redirect to login page
                window.location.href = "/"
            }else if (error.response.status === 500){
                //handle 500 error
                console.error("Server error. Please try again later");

            }
        }else if (error.code === "ECONNABORTED"){
            console.error("Connection timeout. Please try again.");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
