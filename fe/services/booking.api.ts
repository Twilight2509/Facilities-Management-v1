import restClient from "./restClient";
import { StorageService } from "./storage";

export function addBooking(data: any) {
  return restClient({
    url: "booking",
    method: "POST",
    data: data,
  });
}

export function getBookingByUserId(
  id: number,
  page: number = 1,
  size: number = 12,
  name?: any
) {
  return restClient({
    url: "booking/user/" + id,
    method: "GET",
    params: { page, size, name },
  });
}

export function getAllBooking(
  status: any = null,
  sort: any = "default",
  page: number | any = 1,
  size: number | any = 5,
  name?: any,
  role?: any
) {
  return restClient({
    url: "booking",
    method: "GET",
    params: {
      status,
      // sort: sort === "default" ? null : sort,
      page,
      size,
      name,
      role: role === "default" ? null : role,
      sortBeside : true
    },
  });
}

export function editBooking(data: any, id: string) {
  const tokenWithQuotes = StorageService.getToken();
  const token = tokenWithQuotes ? tokenWithQuotes.replace(/['"]+/g, "") : "";
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  return restClient({
    url: "booking/" + id,
    method: "PUT",
    data,
    headers,
  });
}

export function calendarBooking(weeks?: string, faciId?: string) {
  console.log("====================================");
  console.log("faciId: ", faciId);
  console.log("====================================");

  return restClient({
    url: "booking/status/" + faciId,
    method: "GET",
    params: { weeks },
  });
}

export function getBookingUserByWeek(
  weeks?: string,
  userId?: string,
  facilityId?: string
) {
  return restClient({
    url: "booking/user/" + userId+"?facilityId="+facilityId,
    method: "GET",
    params: { weeks },
  });
}
