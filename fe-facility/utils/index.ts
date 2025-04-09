import {
  ENDDATE_SLOT1,
  ENDDATE_SLOT2,
  ENDDATE_SLOT3,
  ENDDATE_SLOT4,
  ENDDATE_SLOT5,
  ENDDATE_SLOT6,
  ENDDATE_SLOT7,
  ENDDATE_SLOT8,
  ENDDATE_SLOT9,
  STARTDATE_SLOT1,
  STARTDATE_SLOT2,
  STARTDATE_SLOT3,
  STARTDATE_SLOT4,
  STARTDATE_SLOT5,
  STARTDATE_SLOT6,
  STARTDATE_SLOT7,
  STARTDATE_SLOT8,
  STARTDATE_SLOT9,
} from "../constant";

export function convertWeekDateToDate(weekDateString: string): string {
  console.log("weekDateString:", weekDateString);

  // Using regex to extract year, week, and dayOfWeek
  const match = weekDateString.match(/^(\d{4})-W(\d{2})-(\w+)$/);

  if (!match) {
    console.error("Invalid weekDateString format:", weekDateString);
    return "Invalid Format";
  }

  const year: number = parseInt(match[1]);
  const week: number = parseInt(match[2]);
  const dayOfWeek: string = match[3];

  console.log("year:", year);
  console.log("week:", week);
  console.log("dayOfWeek:", dayOfWeek);

  // Create a date for the first day of the specified year
  const firstDayOfYear: Date = new Date(year, 0, 1);

  // Calculate the date of the first day of the specified week
  const firstDayOfWeek: Date = new Date(
    firstDayOfYear.getTime() +
      ((week - 1) * 7 - firstDayOfYear.getDay() + 1) * 24 * 60 * 60 * 1000
  );

  // Calculate the date of the specified day of the week
  const day: number =
    dayOfWeek === "Sunday"
      ? 0
      : dayOfWeek === "Monday"
      ? 1
      : dayOfWeek === "Tuesday"
      ? 2
      : dayOfWeek === "Wednesday"
      ? 3
      : dayOfWeek === "Thursday"
      ? 4
      : dayOfWeek === "Friday"
      ? 5
      : 6;

  const targetDate: Date = new Date(
    firstDayOfWeek.getTime() + day * 24 * 60 * 60 * 1000
  );

  // Format the date as "dd/mm/yyyy"
  const dd: string = String(targetDate.getDate()).padStart(2, "0");
  const mm: string = String(targetDate.getMonth() + 1).padStart(2, "0");
  const yyyy: number = targetDate.getFullYear();

  return `${dd}/${mm}/${yyyy}`;
}

export function getCurrentWeek(): string {
  const today: Date = new Date();
  const year: number = today.getFullYear();
  const firstDayOfYear: Date = new Date(year, 0, 1);
  const daysSinceStartOfYear: number = Math.floor(
    (today.getTime() - firstDayOfYear.getTime()) / (1000 * 60 * 60 * 24)
  );
  const isoWeekNumber: number =
    Math.floor(
      (daysSinceStartOfYear + ((firstDayOfYear.getDay() + 6) % 7)) / 7
    ) + 1;

  return year + "-W" + isoWeekNumber.toString().padStart(2, "0");
}

const currentWeek: string = getCurrentWeek();
console.log(currentWeek); // Output: e.g., "2024-W10"

export const getCurrentDay = () => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const currentDate = new Date();
  const currentDay = days[currentDate.getDay()];
  return currentDay;
};

//user
export const checkValidSlotMondayUser = (
  slot: string,
  data: any,
  setDisableButtonsMonday?: any
): boolean => {
  try {
    return !!data?.Monday?.find(
      (res: any) => res.slot === slot && res.status > 0
    );
  } catch (err) {
    return false;
  }
};

export const checkValidSlotTuesdayUser = (slot: string, data: any): boolean => {
  try {
    return !!data?.Tuesday?.find(
      (res: any) => res.slot === slot && res.status > 0
    );
  } catch (err) {
    return false;
  }
};

export const checkValidSlotWednesdayUser = (
  slot: string,
  data: any
): boolean => {
  try {
    return !!data?.Wednesday?.find(
      (res: any) => res.slot === slot && res.status > 0
    );
  } catch (err) {
    return false;
  }
};

export const checkValidSlotThursdayUser = (
  slot: string,
  data: any
): boolean => {
  try {
    return !!data?.Thursday?.find(
      (res: any) => res.slot === slot && res.status > 0
    );
  } catch (err) {
    return false;
  }
};

export const checkValidSlotFridayUser = (slot: string, data: any): boolean => {
  try {
    return !!data?.Friday?.find(
      (res: any) => res.slot === slot && res.status > 0
    );
  } catch (err) {
    return false;
  }
};

export const checkValidSlotSaturdayUser = (
  slot: string,
  data: any
): boolean => {
  try {
    return !!data?.Saturday?.find(
      (res: any) => res.slot === slot && res.status > 0
    );
  } catch (err) {
    return false;
  }
};

export const checkValidSlotSundayUser = (slot: string, data: any): boolean => {
  try {
    return !!data?.Sunday?.find(
      (res: any) => res.slot === slot && res.status > 0
    );
  } catch (err) {
    return false;
  }
};

//faci
export const checkValidSlotMonday = (
  slot: string,
  data: any,
  setDisableButtonsMonday?: any
): boolean => {
  try {
    return !!data?.Monday?.find(
      (res: any) => res.slot === slot && (res.status === 2 || res.status === 5)
    );
  } catch (err) {
    return false;
  }
};

export const checkValidSlotTuesday = (slot: string, data: any): boolean => {
  try {
    return !!data?.Tuesday?.find(
      (res: any) => res.slot === slot && (res.status === 2 || res.status === 5)
    );
  } catch (err) {
    return false;
  }
};

export const checkValidSlotWednesday = (slot: string, data: any): boolean => {
  try {
    return !!data?.Wednesday?.find(
      (res: any) => res.slot === slot && (res.status === 2 || res.status === 5)
    );
  } catch (err) {
    return false;
  }
};

export const checkValidSlotThursday = (slot: string, data: any): boolean => {
  try {
    return !!data?.Thursday?.find(
      (res: any) => res.slot === slot && (res.status === 2 || res.status === 5)
    );
  } catch (err) {
    return false;
  }
};

export const checkValidSlotFriday = (slot: string, data: any): boolean => {
  try {
    return !!data?.Friday?.find(
      (res: any) => res.slot === slot && (res.status === 2 || res.status === 5)
    );
  } catch (err) {
    return false;
  }
};

export const checkValidSlotSaturday = (slot: string, data: any): boolean => {
  try {
    return !!data?.Saturday?.find(
      (res: any) => res.slot === slot && (res.status === 2 || res.status === 5)
    );
  } catch (err) {
    return false;
  }
};

export const checkValidSlotSunday = (slot: string, data: any): boolean => {
  try {
    return !!data?.Sunday?.find(
      (res: any) => res.slot === slot && (res.status === 2 || res.status === 5)
    );
  } catch (err) {
    return false;
  }
};
// ==========================
// Slot đang chờ xét duyệt (status === 1) - Dùng cho màu vàng cảnh báo
// ==========================

export const checkPendingSlotMonday = (slot: string, data: any): boolean => {
  try {
    return !!data?.Monday?.find((res: any) => res.slot === slot && res.status === 1);
  } catch (err) {
    return false;
  }
};

export const checkPendingSlotTuesday = (slot: string, data: any): boolean => {
  try {
    return !!data?.Tuesday?.find((res: any) => res.slot === slot && res.status === 1);
  } catch (err) {
    return false;
  }
};

export const checkPendingSlotWednesday = (slot: string, data: any): boolean => {
  try {
    return !!data?.Wednesday?.find((res: any) => res.slot === slot && res.status === 1);
  } catch (err) {
    return false;
  }
};

export const checkPendingSlotThursday = (slot: string, data: any): boolean => {
  try {
    return !!data?.Thursday?.find((res: any) => res.slot === slot && res.status === 1);
  } catch (err) {
    return false;
  }
};

export const checkPendingSlotFriday = (slot: string, data: any): boolean => {
  try {
    return !!data?.Friday?.find((res: any) => res.slot === slot && res.status === 1);
  } catch (err) {
    return false;
  }
};

export const checkPendingSlotSaturday = (slot: string, data: any): boolean => {
  try {
    return !!data?.Saturday?.find((res: any) => res.slot === slot && res.status === 1);
  } catch (err) {
    return false;
  }
};

export const checkPendingSlotSunday = (slot: string, data: any): boolean => {
  try {
    return !!data?.Sunday?.find((res: any) => res.slot === slot && res.status === 1);
  } catch (err) {
    return false;
  }
};


type Weekday =
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";

const weekdayOffset: Record<Weekday, number> = {
  Monday: 0,
  Tuesday: 1,
  Wednesday: 2,
  Thursday: 3,
  Friday: 4,
  Saturday: 5,
  Sunday: 6,
};

export const getCurrentDate = (weekdays: string, weeks: string): string => {
  const [yearStr, weekStr] = weeks.trim().split("-W");
  const year = parseInt(yearStr, 10);
  const week = parseInt(weekStr, 10);

  if (!Object.keys(weekdayOffset).includes(weekdays)) {
    console.error("❌ Invalid weekday:", weekdays);
    return "Invalid Date";
  }

  const jan4 = new Date(Date.UTC(year, 0, 4));
  const dayOfWeek = jan4.getUTCDay() || 7;
  const startOfWeek1 = new Date(jan4);
  startOfWeek1.setUTCDate(jan4.getUTCDate() - (dayOfWeek - 1));

  const offset = weekdayOffset[weekdays as Weekday];

  const targetDate = new Date(startOfWeek1);
  targetDate.setUTCDate(startOfWeek1.getUTCDate() + (week - 1) * 7 + offset);

  if (isNaN(targetDate.getTime())) {
    console.error("❌ Invalid date generated:", targetDate);
    return "Invalid Date";
  }

  return targetDate.toISOString().split("T")[0]; // "YYYY-MM-DD"
};


export const formatDate = (dateString: string) => {
  // Parse the dateString into a Date object
  const date = new Date(dateString);

  // Get the day, month, and year
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  // Return the formatted date
  return `${day}/${month}/${year}`;
};

export const formatDateVN = (dateString: string) => {
  // Parse the dateString into a Date object
  const date = new Date(dateString);

  // Adjust for Vietnamese timezone (UTC+7)
  const vietnameseDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);

  // Get the day, month, and year
  const day = vietnameseDate.getDate().toString().padStart(2, "0");
  const month = (vietnameseDate.getMonth() + 1).toString().padStart(2, "0");
  const year = vietnameseDate.getFullYear();

  // Get the hours, minutes, and seconds
  const hours = vietnameseDate.getHours().toString().padStart(2, "0");
  const minutes = vietnameseDate.getMinutes().toString().padStart(2, "0");
  const seconds = vietnameseDate.getSeconds().toString().padStart(2, "0");

  // Return the formatted date and time
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

interface SlotData {
  _id: string;
  slot: string;
  reportStatus: number;
}

interface BookingData {
  Sunday?: SlotData[];
  Monday?: SlotData[];
  Tuesday?: SlotData[];
  Wednesday?: SlotData[];
  Thursday?: SlotData[];
  Friday?: SlotData[];
  Saturday?: SlotData[];
}

interface ReportStatusResult {
  reportStatus: number; // Thay status thành reportStatus
  id: string | null;
}

// Kiểm tra reportStatus cho user
export const checkReportStatusMondayUser = (slot: string, data: BookingData): ReportStatusResult => {
  const slotData = data?.Monday?.find((res) => res.slot === slot);
  if (slotData) {
    return { reportStatus: slotData.reportStatus, id: slotData._id }; // Thay status thành reportStatus
  }
  return { reportStatus: 3, id: null }; // Trống
};

export const checkReportStatusTuesdayUser = (slot: string, data: BookingData): ReportStatusResult => {
  const slotData = data?.Tuesday?.find((res) => res.slot === slot); // Sửa Monday thành Tuesday
  if (slotData) {
    return { reportStatus: slotData.reportStatus, id: slotData._id }; // Thay status thành reportStatus
  }
  return { reportStatus: 3, id: null }; // Trống
};

export const checkReportStatusWednesdayUser = (slot: string, data: BookingData): ReportStatusResult => {
  const slotData = data?.Wednesday?.find((res) => res.slot === slot); // Sửa Monday thành Wednesday
  if (slotData) {
    return { reportStatus: slotData.reportStatus, id: slotData._id }; // Thay status thành reportStatus
  }
  return { reportStatus: 3, id: null }; // Trống
};

export const checkReportStatusThursdayUser = (slot: string, data: BookingData): ReportStatusResult => {
  const slotData = data?.Thursday?.find((res) => res.slot === slot); // Sửa Monday thành Thursday
  if (slotData) {
    return { reportStatus: slotData.reportStatus, id: slotData._id }; // Thay status thành reportStatus
  }
  return { reportStatus: 3, id: null }; // Trống
};

export const checkReportStatusFridayUser = (slot: string, data: BookingData): ReportStatusResult => {
  const slotData = data?.Friday?.find((res) => res.slot === slot); // Sửa Monday thành Friday
  if (slotData) {
    return { reportStatus: slotData.reportStatus, id: slotData._id }; // Thay status thành reportStatus
  }
  return { reportStatus: 3, id: null }; // Trống
};

export const checkReportStatusSaturdayUser = (slot: string, data: BookingData): ReportStatusResult => {
  const slotData = data?.Saturday?.find((res) => res.slot === slot); // Sửa Monday thành Saturday
  if (slotData) {
    return { reportStatus: slotData.reportStatus, id: slotData._id }; // Thay status thành reportStatus
  }
  return { reportStatus: 3, id: null }; // Trống
};

export const checkReportStatusSundayUser = (slot: string, data: BookingData): ReportStatusResult => {
  const slotData = data?.Sunday?.find((res) => res.slot === slot);
  if (slotData) {
    return { reportStatus: slotData.reportStatus, id: slotData._id }; // Thay status thành reportStatus
  }
  return { reportStatus: 3, id: null }; // Trống
};