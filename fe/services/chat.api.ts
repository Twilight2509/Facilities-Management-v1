import restClient from "./restClient";
import { StorageService } from "./storage";

export function chat(data: any) {
    const tokenWithQuotes = StorageService.getToken();
    const token = tokenWithQuotes ? tokenWithQuotes.replace(/['"]+/g, '') : '';
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    return restClient({
        url: "chat/create",
        method: "POST",
        data: data,
        headers
    })
}

export function getListUser() {
    const tokenWithQuotes = StorageService.getToken();
    const token = tokenWithQuotes ? tokenWithQuotes.replace(/['"]+/g, '') : '';
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    return restClient({
        url: "chat/list-user",
        method: "GET",
        headers
    })
}

export function getListUserMessage() {
    const tokenWithQuotes = StorageService.getToken();
    const token = tokenWithQuotes ? tokenWithQuotes.replace(/['"]+/g, '') : '';
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    return restClient({
        url: "chat/list-user-message",
        method: "GET",
        headers
    })
}

export function getListAdminMessage(userId: any) {
    const tokenWithQuotes = StorageService.getToken();
    const token = tokenWithQuotes ? tokenWithQuotes.replace(/['"]+/g, '') : '';
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    return restClient({
        url: "chat/list-admin-message",
        method: "GET",
        params: {userId},
        headers
    })
}