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

export async function getAllBooking(status: any = null, sort: any = "default", page: number = 1, size: number = 5, name?: any, role?: any) {
  try {
    const response = await restClient({
      url: "booking",
      method: "GET",
      params: {
        status,
        page,
        size,
        name,
        role: role === "default" ? null : role,
        sortBeside: true
      },
    });
    return response; // Trả về dữ liệu từ API
  } catch (error) {
    console.error("Lỗi khi gọi API getAllBooking:", error);
    return null; // Trả về null để tránh lỗi undefined
  }
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
export function updateReportStatus(bookingId: string, reportStatus: number) {
  const tokenWithQuotes = StorageService.getToken();
  const token = tokenWithQuotes ? tokenWithQuotes.replace(/['"]+/g, "") : "";
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  return restClient({
    url: `booking/${bookingId}/report-status`,
    method: "PUT",
    data: { reportStatus },
    headers
  });
}
export function getBookingUserByWeek(
  weeks?: string,
  userId?: string,
  facilityId?: string
) {
  return restClient({
    url: "booking/user/" + userId + "?facilityId=" + facilityId,
    method: "GET",
    params: { weeks },
  });
}
