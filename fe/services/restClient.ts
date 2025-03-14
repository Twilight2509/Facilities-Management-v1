import axios, { AxiosError } from "axios";
import { StorageService } from "./storage";

const BASE_URL = "http://localhost:5152";

export default function restClient({
  url,
  method = "GET",
  params,
  data,
  headers
}: {
  url: string;
  method?: "POST" | "GET" | "PUT" | "PATCH" | "DELETE";
  params?: object;
  data?: any;
  headers? : any
}) {
  return axios({
    url: `${BASE_URL}/${url}`,
    method,
    params,
    data,
    headers 
  }).catch((err)=>{
    if(StorageService.isExpired() === true){
      StorageService.signout()
    }
  })
}
