import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
// import queryString from "query-string";

export const baseURL = "http://10.0.2.2:5000/api/v1";

const BackendAPI = axios.create({
    baseURL,
});

export default BackendAPI;

const PrivateAPI = axios.create({
    baseURL,
    // paramsSerializer: {
    //     encode: params => queryString.stringify(params),
    // },
});

PrivateAPI.interceptors.request.use(async (config: any) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
        console.warn("No token available");
        return config;
    }

    return {
        ...config,
        headers: {
            ...config.headers,
            token,
        },
    };
});

export { PrivateAPI };
