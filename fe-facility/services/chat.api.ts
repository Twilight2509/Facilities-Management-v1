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

export function getUnreadMessagesCount() {
    const token = StorageService.getToken()?.replace(/['"]+/g, "") || "";
    return restClient({
        url: "chat/unread/count",
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
    });
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
        params: { userId },
        headers
    })
}
export function markChatAsRead(chatId: string) {
    const tokenWithQuotes = StorageService.getToken();
    const token = tokenWithQuotes ? tokenWithQuotes.replace(/['"]+/g, '') : '';
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    return restClient({
        url: `chat/${chatId}/read`,
        method: "PUT",
        headers
    });
}
export function markAllChatsAsRead(userId: string) {
    const tokenWithQuotes = StorageService.getToken();
    const token = tokenWithQuotes ? tokenWithQuotes.replace(/['"]+/g, '') : '';
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    return restClient({
        url: `chat/${userId}/read-all`,
        method: "PUT",
        headers
    });
}
export function getUnreadChatsCount(userId: string) {
    const tokenWithQuotes = StorageService.getToken();
    const token = tokenWithQuotes ? tokenWithQuotes.replace(/['"]+/g, '') : '';
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    return restClient({
        url: `chat/${userId}/unread-count`,
        method: "GET",
        headers
    });
}