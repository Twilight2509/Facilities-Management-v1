import restClient from "./restClient";
import { StorageService } from "./storage";

export function getNotification(page: number,size:number){
    const tokenWithQuotes = StorageService.getToken();
    const token = tokenWithQuotes ? tokenWithQuotes.replace(/['"]+/g, '') : '';
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    return restClient({
        url: "notification",
        method: "GET",
       params: { page: page,
        size: size},
        headers
    })
}
export function readNotification() {
    const tokenWithQuotes = StorageService.getToken();
    const token = tokenWithQuotes ? tokenWithQuotes.replace(/['"]+/g, '') : '';
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    return restClient({
        url: "notification/update-read-all",
        method: "PUT",
        headers
    })
}