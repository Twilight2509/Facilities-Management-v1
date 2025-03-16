import restClient from "./restClient";
import { StorageService } from "./storage";

export function getCategory(activePage?: any, name?: any, size?: any) {
  const tokenWithQuotes = StorageService.getToken();
  const token = tokenWithQuotes ? tokenWithQuotes.replace(/['"]+/g, "") : "";
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  return restClient({
    url: "category/list",
    params: { page: activePage, name, size },
    headers,
  });
}

export function addCategory(data: any) {
  const tokenWithQuotes = StorageService.getToken();
  const token = tokenWithQuotes ? tokenWithQuotes.replace(/['"]+/g, "") : "";
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  return restClient({
    url: "category/create",
    method: "POST",
    data: data,
    headers,
  });
}

export function editCategory(data: any) {
  const tokenWithQuotes = StorageService.getToken();
  const token = tokenWithQuotes ? tokenWithQuotes.replace(/['"]+/g, "") : "";
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  return restClient({
    url: "category/edit",
    method: "PUT",
    data: data,
    headers,
  });
}

export function deleteCategory(id: string) {
  const tokenWithQuotes = StorageService.getToken();
  const token = tokenWithQuotes ? tokenWithQuotes.replace(/['"]+/g, "") : "";
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  return restClient({
    url: `category/delete?id=${id}`,
    method: "DELETE",
    headers,
  });
}
export function viewUpdate(
  id: string,
  type: string,
  page: number,
  size: number
) {
  const tokenWithQuotes = StorageService.getToken();
  const token = tokenWithQuotes ? tokenWithQuotes.replace(/['"]+/g, "") : "";
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  return restClient({
    url: `log/list?id=${id}`,
    method: "GET",
    params: { type: type, page: page, size: size },
    headers,
  });
}
