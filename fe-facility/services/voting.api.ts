import restClient from "./restClient";
import { StorageService } from "./storage";

interface IComment {
    content : string;
    facility : string;
    star : number;
}

const tokenWithQuotes = StorageService.getToken();
const token = tokenWithQuotes ? tokenWithQuotes.replace(/['"]+/g, "") : "";
const headers = token ? { Authorization: `Bearer ${token}` } : {};

export function checkComment(facilityId: string) {
  return restClient({
    url: "comment/check-permission",
    params: { facilityId },
    headers
  });
}

export function addComment(data : IComment) {
    return restClient({
        url: "comment/create",
        method : "POST",
        data,
        headers
      });
}

export function getCommentByFacilityId(facilityId: string,page ?: any ,size ?: number){
    return restClient({
        url: "comment/list",
        params: {facilityId,page,size},
        headers
      });
}
