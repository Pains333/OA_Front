import axios from "axios";
import {useAuthStore} from "@/stores/auth.js";

class Http{
    constructor(){
        this.instance = axios.create({
            baseURL: import.meta.env.VITE_BASE_URL,
            timeout: 5000,
        })

        this.instance.interceptors.request.use((config) => {
            const token = useAuthStore().token
            if (token){
                config.headers.Authorization = 'JWT ' + token
            }
            return config
        })
    }

    post(path, data){
        return new Promise(async (resolve, reject) => {
            try{
                let result = await this.instance.post(path, data)
                resolve(result.data)
            }catch (err){
                let detail = err.response.data.detail
                reject(detail)
            }
        })
    }

    get(path, params){
        return new Promise(async (resolve, reject) => {
            try{
                let result = await this.instance.get(path, {params})
                resolve(result.data)
            }catch (err){
                let detail = err.response.data.detail
                reject(detail)
            }
        })
    }

    put(path, data){
        return new Promise(async (resolve, reject) => {
            try{
                let result = await this.instance.put(path, data)
                resolve(result.data)
            }catch (err){
                let detail = err.response.data.detail
                reject(detail)
            }
        })
    }

    delete(path){
        return new Promise(async (resolve, reject) => {
            try{
                let result = await this.instance.delete(path)
                resolve(result)
            }catch (err){
                let detail = err.response.data.detail
                reject(detail)
            }
        })
    }

    downloadFile(path, params){
        return new Promise(async (resolve, reject) => {
            try{
                let result = await this.instance.get(path, {
                    params,
                    responseType: "blob"
                })
                resolve(result)
            }catch(err){
                let detail = err.response.data.detail;
                reject(detail)
            }
        })
    }
}

export default new Http()