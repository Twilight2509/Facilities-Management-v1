import restClient from "./restClient";
import { StorageService } from "./storage";


function getAuthHeaders() {
    const tokenWithQuotes = StorageService.getToken();
    const token = tokenWithQuotes ? tokenWithQuotes.replace(/['"]+/g, "") : "";
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export function getAllReports() {
    return restClient({
        url: "report/",
        method: "GET",
        headers: getAuthHeaders(),
    });
}

export function getReportById(id: any) {
    return restClient({
        url: `report/${id}`,
        method: "GET",
        headers: getAuthHeaders(),
    });
}

export function getReportByBookingId(bookingId: any) {
    return restClient({
        url: `report/search/${bookingId}`,
        method: "GET",
        headers: getAuthHeaders(),
    });
}

export function createReport(formData: any) {
    return restClient({
        url: "report/create",
        method: "POST",
        headers: {
            ...getAuthHeaders(),
            "Content-Type": "multipart/form-data",
        },
        data: formData,
    });
}

export function updateReport(id: any, formData: any) {
    return restClient({
        url: `report/update/${id}`,
        method: "PUT",
        headers: {
            ...getAuthHeaders(),
            "Content-Type": "multipart/form-data",
        },
        data: formData,
    });
}

export function deleteReport(id: any) {
    return restClient({
        url: `report/delete/${id}`,
        method: "DELETE",
        headers: getAuthHeaders(),
    });
}
