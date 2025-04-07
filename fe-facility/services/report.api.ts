import restClient from "./restClient";
import { StorageService } from "./storage";

export function getAllReport(){
    return restClient({
        url:`report`,
        method:`GET`
    })
}