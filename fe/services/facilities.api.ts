import restClient from "./restClient";
import { StorageService } from "./storage";

export function getFacilities(
  activePage?: number | null,
  name?: string | null,
  status : number | string = 1
) {
  return restClient({
    url: "facility/list",
    params: { page: activePage, name , status  },
  });
}

export function getFacilityDetail(id: String) {
  return restClient({
    url: `facility/detail/${id}`,
  });
}

export function addFacility(data: any) {
  const tokenWithQuotes = StorageService.getToken();
  const token = tokenWithQuotes ? tokenWithQuotes.replace(/['"]+/g, "") : "";
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  return restClient({
    url: "facility/create",
    method: "POST",
    data: data,
    headers,
  });
}

export function updateFacility(data: any) {
  const tokenWithQuotes = StorageService.getToken();
  const token = tokenWithQuotes ? tokenWithQuotes.replace(/['"]+/g, "") : "";
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  return restClient({
    url: "facility/update",
    method: "PUT",
    data: data,
    headers,
  });
}

export function deleteFacility(id: string) {
  const tokenWithQuotes = StorageService.getToken();
  const token = tokenWithQuotes ? tokenWithQuotes.replace(/['"]+/g, "") : "";
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  return restClient({
    url: "facility/delete?id=" + id,
    method: "DELETE",
    headers,
  });
}

export function facilityById(id: string) {
  return restClient({
    url: "facility/detail/" + id,
    method: "GET",
  });
}

export function searchFacility(
  name?: any,
  categoryId?: string,
  page?: number,
  size?: number,
  status : number | string = 1
) {
  return restClient({
    url: "facility/list",
    method: "GET",
    params: {
      page,
      size: 12,
      name,
      categoryId,
      status
    },
  });
}

export function updateStatusFaci(id:string){
  const tokenWithQuotes = StorageService.getToken();
  const token = tokenWithQuotes ? tokenWithQuotes.replace(/['"]+/g, "") : "";
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  return restClient({
    url: "facility/delete",
    method: "DELETE",
    params : {id},
    headers
  });
}
