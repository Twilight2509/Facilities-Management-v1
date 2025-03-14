import restClient from "./restClient";
import { StorageService } from "./storage";

const tokenWithQuotes = StorageService.getToken();
const token = tokenWithQuotes ? tokenWithQuotes.replace(/['"]+/g, "") : "";
const headers = token ? { Authorization: `Bearer ${token}` } : {};

export function userStatic() {
  return restClient({
    url: "users/stastic-by-role",
    method: "GET",
    headers,
  });
}

export function faciStatic() {
  return restClient({
    url: "facility/stastic-by-category",
    method: "GET",
    headers,
  });
}

export function statisticStaticByYear(year?: number, status?: number) {
  if (status && status > 0) {
    return restClient({
      url: "booking/dashboard/month",
      params: { status, year },
    });
  }
  return restClient({
    url: "booking/dashboard/month",
    params: { year },
  });
}

export function statisticStaticByWeek(
  startDate?: string,
  endDate?: string,
  status?: number
) {
  if (status && status > 0) {
    return restClient({
      url: "booking/dashboard/week",
      params: { status, startDate, endDate },
    });
  }
  return restClient({
    url: "booking/dashboard/week",
    params: { startDate, endDate },
  });
}
