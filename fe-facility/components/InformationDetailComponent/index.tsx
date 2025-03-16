"use client";
import { Button, Modal, Space, Tooltip } from "antd";
import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";
import { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/router'
// import TableComponentBooked from "../TableComponentBooked";
import { StorageService } from "../../services/storage";
import { Toast } from "primereact/toast";
import {
  addBooking,
  calendarBooking,
  getBookingByUserId,
  getBookingUserByWeek,
} from "../../services/booking.api";
import {
  checkValidSlotFriday,
  checkValidSlotFridayUser,
  checkValidSlotMonday,
  checkValidSlotMondayUser,
  checkValidSlotSaturday,
  checkValidSlotSaturdayUser,
  checkValidSlotSunday,
  checkValidSlotSundayUser,
  checkValidSlotThursday,
  checkValidSlotThursdayUser,
  checkValidSlotTuesday,
  checkValidSlotTuesdayUser,
  checkValidSlotWednesday,
  checkValidSlotWednesdayUser,
  getCurrentDate,
  getCurrentDay,
  getCurrentWeek,
} from "../../utils";
import { current } from "@reduxjs/toolkit";
import {
  FRIDAY,
  MONDAY,
  SATURDAY,
  SUNDAY,
  THURSDAY,
  TUESDAY,
  WEDNESDAY,
} from "../../constant";

import { SlotTime } from "../../data";

const weeks = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const slots = [
  "Slot1",
  "Slot2",
  "Slot3",
  "Slot4",
  "Slot5",
  "Slot6",
  "Slot7",
  "Slot8",
];

const info = (data: any) => {
  Modal.info({
    title: "Thông tin chi tiết",
    content: <div dangerouslySetInnerHTML={{ __html: data }}></div>,
    footer: (
      <div className="relative pb-8">
        <Button
          onClick={() => Modal.destroyAll()}
          className="absolute right-0 bottom-2 bg-blue-500 text-white hover:bg-blue-300"
        >
          OK
        </Button>
      </div>
    ),
  });
};

export default function InfomationDetailComponent({
  detailData,
  showSuccessCategory,
  showErrorCategory,
}: {
  detailData: any;
  showSuccessCategory: any;
  showErrorCategory: any;
}) {
  console.log("====================================");
  console.log(detailData);
  console.log("====================================");

  //booking
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const currentDay = getCurrentDay();

  //booking slot
  const [bookslot, setBookSlot] = useState<string | null>(null);
  const [weekValue, setWeekValue] = useState<string>("");
  const [disableButtonsMonday, setDisableButtonsMonday] =
    useState<boolean>(false);
  const [disableButtonsTuesday, setDisableButtonsTuesday] =
    useState<boolean>(false);
  const [disableButtonsWendsday, setDisableButtonsWendsday] =
    useState<boolean>(false);
  const [disableButtonsThurday, setDisableButtonsThurday] =
    useState<boolean>(false);
  const [disableButtonsFriday, setDisableButtonsFriday] =
    useState<boolean>(false);
  const [disableButtonsSaturday, setDisableButtonsSaturday] =
    useState<boolean>(false);
  const [disableButtonsSunday, setDisableButtonsSunday] =
    useState<boolean>(false);
  const [listBooking, setListBooking] = useState<any>(null);
  const currentWeek: string = getCurrentWeek();
  const [bookingUserByWeek, setBookingUserByWeek] = useState<any>(null);

  useEffect(() => {
    console.log("====================================");
    console.log("valid day::", checkValidSlotThursday("Slot8", listBooking));
    console.log("====================================");
    console.log("====================================");
    console.log("current day::", currentDay);
    console.log("====================================");
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname + window.location.search;
      console.log("Saving current path to localStorage:", currentPath);
      localStorage.setItem("previousPath", currentPath);
    }
    if (!weekValue) {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const isoWeek = getISOWeek(currentDate);

      // Format the ISO week to "YYYY-Www"
      const formattedWeekValue = `${year}-W${isoWeek
        .toString()
        .padStart(2, "0")}`;

      setWeekValue(formattedWeekValue);
    }
    console.log("====================================");
  }, [weekValue]);

  useEffect(() => {
    if (currentWeek === weekValue) {
      if (currentDay === MONDAY) {
        setDisableButtonsMonday(true);
        setDisableButtonsTuesday(false);
        setDisableButtonsWendsday(false);
        setDisableButtonsThurday(false);
        setDisableButtonsFriday(false);
        setDisableButtonsSaturday(false);
        setDisableButtonsSunday(false);
      } else if (currentDay === TUESDAY) {
        setDisableButtonsMonday(true);
        setDisableButtonsTuesday(true);
        setDisableButtonsWendsday(false);
        setDisableButtonsThurday(false);
        setDisableButtonsFriday(false);
        setDisableButtonsSaturday(false);
        setDisableButtonsSunday(false);
      } else if (currentDay === WEDNESDAY) {
        setDisableButtonsMonday(true);
        setDisableButtonsTuesday(true);
        setDisableButtonsWendsday(true);
        setDisableButtonsThurday(false);
        setDisableButtonsFriday(false);
        setDisableButtonsSaturday(false);
        setDisableButtonsSunday(false);
      } else if (currentDay === THURSDAY) {
        setDisableButtonsMonday(true);
        setDisableButtonsTuesday(true);
        setDisableButtonsWendsday(true);
        setDisableButtonsThurday(true);
        setDisableButtonsFriday(false);
        setDisableButtonsSaturday(false);
        setDisableButtonsSunday(false);
      } else if (currentDay === FRIDAY) {
        setDisableButtonsMonday(true);
        setDisableButtonsTuesday(true);
        setDisableButtonsWendsday(true);
        setDisableButtonsThurday(true);
        setDisableButtonsFriday(true);
        setDisableButtonsSaturday(false);
        setDisableButtonsSunday(false);
      } else if (currentDay === SATURDAY) {
        setDisableButtonsMonday(true);
        setDisableButtonsTuesday(true);
        setDisableButtonsWendsday(true);
        setDisableButtonsThurday(true);
        setDisableButtonsFriday(true);
        setDisableButtonsSaturday(true);
        setDisableButtonsSunday(false);
      } else if (currentDay === SUNDAY) {
        setDisableButtonsMonday(true);
        setDisableButtonsTuesday(true);
        setDisableButtonsWendsday(true);
        setDisableButtonsThurday(true);
        setDisableButtonsFriday(true);
        setDisableButtonsSaturday(true);
        setDisableButtonsSunday(true);
      }
    } else {
      // If weekValue is more than two weeks ahead of the current week, disable all buttons
      const currentYear = parseInt(currentWeek.substring(0, 4), 10);
      const currentWeekNum = parseInt(currentWeek.substring(6), 10);
      const targetYear = parseInt(weekValue.substring(0, 4), 10);
      const targetWeekNum = parseInt(weekValue.substring(6), 10);

      // Calculate the difference in weeks
      const weekDifference =
        (targetYear - currentYear) * 52 + (targetWeekNum - currentWeekNum);

      if (weekDifference > 1) {
        // If the difference is greater than 2 weeks, disable all buttons
        setDisableButtonsMonday(true);
        setDisableButtonsTuesday(true);
        setDisableButtonsWendsday(true);
        setDisableButtonsThurday(true);
        setDisableButtonsFriday(true);
        setDisableButtonsSaturday(true);
        setDisableButtonsSunday(true);
      }
    }
  }, [weekValue]);

  useEffect(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const isoWeek = getISOWeek(currentDate);

    // Format the ISO week to "YYYY-Www"
    const formattedWeekValue = `${year}-W${isoWeek
      .toString()
      .padStart(2, "0")}`;

    setWeekValue(formattedWeekValue);

    if (StorageService.getUser()) {
      getBookingUserByWeek(
        currentWeek,
        StorageService.getUser().id,
        detailData?._id
      ).then(
        (res: any) => {
          console.log("====================================");
          console.log("User Booking ::", res.data.booking);
          console.log("====================================");
          setBookingUserByWeek(res.data.booking);
        },
        (error) => { }
      );
    }

    calendarBooking(currentWeek, detailData?._id)
      .then((res: any) => {
        setListBooking(res.data);
      })
      .catch((err: Error) => {
        console.log("====================================");
        console.log("err::", err);
        console.log("====================================");
      });
  }, []);

  // Function to get ISO week number
  const getISOWeek = (date: Date) => {
    const d = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  };

  const handleWeekChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedWeek = event.target.value;

    if (StorageService.getUser()) {
      getBookingUserByWeek(
        event.target.value,
        StorageService.getUser().id,
        detailData?._id
      ).then(
        (res: any) => {
          console.log("====================================");
          console.log("User Booking ::", res.data.booking);
          console.log("====================================");
          setBookingUserByWeek(res.data.booking);
        },
        (error) => { }
      );
    }

    calendarBooking(event.target.value, detailData?._id)
      .then((res: any) => {
        setListBooking(res.data);
      })
      .catch((err: Error) => {
        console.log("====================================");
        console.log("err::", err);
        console.log("====================================");
      });
    setWeekValue(selectedWeek);

    const selectedWeekNumber = parseInt(
      selectedWeek.split("-")[1].substring(1),
      10
    );
    const currentWeekNumber = parseInt(
      currentWeek.split("-")[1].substring(1),
      10
    );

    if (selectedWeekNumber < currentWeekNumber) {
      setDisableButtonsMonday(true);
      setDisableButtonsTuesday(true);
      setDisableButtonsWendsday(true);
      setDisableButtonsThurday(true);
      setDisableButtonsFriday(true);
      setDisableButtonsSaturday(true);
      setDisableButtonsSunday(true);

      console.log("Buttons Disabled");
    } else {
      setDisableButtonsMonday(false);
      setDisableButtonsTuesday(false);
      setDisableButtonsWendsday(false);
      setDisableButtonsThurday(false);
      setDisableButtonsFriday(false);
      setDisableButtonsSaturday(false);
      setDisableButtonsSunday(false);
      console.log("Buttons Enabled");
    }
  };

  const showModal = () => {
    if (StorageService.isLoggedIn() === false) {
      showErrorCategory("You must login in to book room !!!");
      return;
    }
    setOpen(true);
  };

  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleBooking = (data: string) => {
    console.log("====================================");
    console.log("dataTime::", data);
    console.log("====================================");
    const arrayBooking = data.split("#");
    const userId = StorageService.getUser()?.id ?? null;
    const day = getCurrentDate(arrayBooking[1], arrayBooking[2]);
    console.log("====================================");
    console.log("dayTime::", day);
    console.log("====================================");
    const bookingBody = {
      slot: arrayBooking[0],
      weekdays: arrayBooking[1],
      weeks: arrayBooking[2],
      facilityId: detailData?._id,
      booker: userId,
      startDate: day.trim(),
      endDate: day.trim(),
      isComment: false,
      status: 1,
    };

    console.log("====================================");
    console.log("day::", day);
    console.log("====================================");

    if (!userId) {
      window.location.href = '/login';
      return; // Dừng thực hiện code sau khi chuyển hướng
    }


    addBooking(bookingBody)
      .then((res: any) => {
        if (
          res.statusCode === 400 &&
          res.message === "You already have a booking"
        ) {
          showErrorCategory("Booking failed: You already have a booking");
        } else {
          // check login, neu chua thi ve /login
          // neu roi thi chay code
          showSuccessCategory("Booking successfully !!!");
          calendarBooking(weekValue, detailData?._id)
            .then((res: any) => {
              setListBooking(res.data);
            })
            .catch((err: Error) => {
              console.log("====================================");
              console.log("err::", err);
              console.log("====================================");
            });

          if (StorageService.getUser()) {
            getBookingUserByWeek(
              weekValue,
              StorageService.getUser().id,
              detailData?._id
            ).then(
              (res: any) => {
                console.log("====================================");
                console.log("User Booking ::", res.data.booking);
                console.log("====================================");
                setBookingUserByWeek(res.data.booking);
              },
              (error) => { }
            );
          }
        }
      })
      .catch((err) => {
        console.log("====================================");
        console.log("err::", err);
        console.log("====================================");
        showErrorCategory("Bạn đã đặt slot này rồi");
      });

    setOpen(false);
  };

  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <>
      <div className="flex-1 flex flex-col gap-4 items-center">
        <div className="font-bold text-5xl">{detailData?.name}</div>
        <div>
          <span className="font-bold">Phân loại :</span> {detailData?.category?.categoryName}
        </div>

        {/* Hiển thị nội dung chi tiết luôn */}
        <div className="p-4 bg-gray-100 rounded shadow-lg w-full">
          <h2 className="font-bold text-2xl mb-2">Thông tin chi tiết</h2>
          <div dangerouslySetInnerHTML={{ __html: detailData?.description }}></div>
        </div>
      </div>
      {/* modal booking */}
      <div className="flex-1">
        <div>
          <div className="flex items-center justify-end gap-2 my-3">
            <span className="font-bold text-xl"> Tuần và năm </span>
            <input
              className="border border-black p-1 rounded-full"
              type="week"
              value={weekValue}
              onChange={handleWeekChange}
            />
          </div>
          <div className="flex gap-2 justify-end mb-3">
            <Tooltip title="Đã có người đặt">
              <div className="w-1 h-4 bg-red-500"></div>
            </Tooltip>
            <Tooltip title="Chưa có ai đặt">
              <div className="w-1 h-4 bg-blue-500"></div>
            </Tooltip>
            <Tooltip title="Không thể đặt slot này">
              <div className="w-1 h-4 bg-gray-400"></div>
            </Tooltip>
            <Tooltip title="Các slot bạn đã đặt">
              <div className="w-1 h-4 bg-green-800"></div>
            </Tooltip>
          </div>
          <div className="flex justify-center">
            <table className="border">
              <thead>
                <tr>
                  <th className="p-2 border"></th>
                  {weeks.map((week, i) => {
                    return (
                      <th key={i} className="p-2 border">
                        {week}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 9 }, (_, i) => (
                  <tr key={`slot_${i}_Slot1`}>
                    <td className="p-2 border">
                      <Tooltip title={`${SlotTime[`Slot${i + 1}`]}`}>
                        <div className="flex items-center gap-1">
                          {" "}
                          <p className="text-xl">Slot{i + 1}</p>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 512 512"
                          >
                            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
                          </svg>
                        </div>
                      </Tooltip>
                    </td>
                    <td className="p-2 border">
                      <button
                        disabled={
                          disableButtonsMonday ||
                          checkValidSlotMonday(`Slot${i + 1}`, listBooking) ||
                          checkValidSlotMondayUser(
                            `Slot${i + 1}`,
                            bookingUserByWeek
                          )
                        }
                        onClick={() =>
                          handleBooking(`Slot${i + 1}#Monday#${weekValue}`)
                        }
                        className={`p-2 rounded-full text-white px-4 
                        ${checkValidSlotMondayUser(
                          `Slot${i + 1}`,
                          bookingUserByWeek
                        ) === true
                            ? "bg-green-800 hover:bg-green-300 cursor-not-allowed opacity-50"
                            : checkValidSlotMonday(
                              `Slot${i + 1}`,
                              listBooking
                            ) === true
                              ? "bg-red-500 hover:bg-red-300 cursor-not-allowed opacity-50"
                              : "bg-blue-500 hover:bg-blue-300"
                          }
                
                        ${checkValidSlotMonday(`Slot${i + 1}`, listBooking) ===
                            false && disableButtonsMonday
                            ? "bg-gray-400 hover:bg-gray-300 cursor-not-allowed opacity-50"
                            : "bg-blue-500 hover:bg-blue-300"
                          }`}
                      >
                        Đặt
                      </button>
                    </td>

                    <td className="p-2 border">
                      <button
                        disabled={
                          disableButtonsTuesday ||
                          checkValidSlotTuesday(`Slot${i + 1}`, listBooking) ||
                          checkValidSlotTuesdayUser(
                            `Slot${i + 1}`,
                            bookingUserByWeek
                          )
                        }
                        onClick={() =>
                          handleBooking(`Slot${i + 1}#Tuesday#${weekValue}`)
                        }
                        className={`p-2 rounded-full text-white px-4 
                        ${checkValidSlotTuesdayUser(
                          `Slot${i + 1}`,
                          bookingUserByWeek
                        ) === true
                            ? "bg-green-800 hover:bg-green-300 cursor-not-allowed opacity-50"
                            : checkValidSlotTuesday(
                              `Slot${i + 1}`,
                              listBooking
                            ) === true
                              ? "bg-red-500 hover:bg-red-300 cursor-not-allowed opacity-50"
                              : "bg-blue-500 hover:bg-blue-300"
                          }
                
                        ${checkValidSlotTuesday(`Slot${i + 1}`, listBooking) ===
                            false && disableButtonsTuesday
                            ? "bg-gray-400 hover:bg-gray-300 cursor-not-allowed opacity-50"
                            : "bg-blue-500 hover:bg-blue-300"
                          }`}
                      >
                        Đặt
                      </button>
                    </td>

                    <td className="p-2 border">
                      <button
                        disabled={
                          disableButtonsWendsday ||
                          checkValidSlotWednesday(
                            `Slot${i + 1}`,
                            listBooking
                          ) ||
                          checkValidSlotWednesdayUser(
                            `Slot${i + 1}`,
                            bookingUserByWeek
                          )
                        }
                        onClick={() =>
                          handleBooking(`Slot${i + 1}#Wednesday#${weekValue}`)
                        }
                        className={`p-2 rounded-full text-white px-4 
                        ${checkValidSlotWednesdayUser(
                          `Slot${i + 1}`,
                          bookingUserByWeek
                        ) === true
                            ? "bg-green-800 hover:bg-green-300 cursor-not-allowed opacity-50"
                            : checkValidSlotWednesday(
                              `Slot${i + 1}`,
                              listBooking
                            ) === true
                              ? "bg-red-500 hover:bg-red-300 cursor-not-allowed opacity-50"
                              : "bg-blue-500  hover:bg-blue-300"
                          }
                
                        ${checkValidSlotWednesday(
                            `Slot${i + 1}`,
                            listBooking
                          ) === false && disableButtonsWendsday
                            ? "bg-gray-400 hover:bg-gray-300 cursor-not-allowed opacity-50"
                            : "bg-blue-500 hover:bg-blue-300"
                          }`}
                      >
                        Đặt
                      </button>
                    </td>

                    <td className="p-2 border">
                      <button
                        disabled={
                          disableButtonsThurday ||
                          checkValidSlotThursday(`Slot${i + 1}`, listBooking) ||
                          checkValidSlotThursdayUser(
                            `Slot${i + 1}`,
                            bookingUserByWeek
                          )
                        }
                        onClick={() =>
                          handleBooking(`Slot${i + 1}#Thursday#${weekValue}`)
                        }
                        className={`p-2 rounded-full text-white px-4 
                        ${checkValidSlotThursdayUser(
                          `Slot${i + 1}`,
                          bookingUserByWeek
                        ) === true
                            ? "bg-green-800 hover:bg-green-300 cursor-not-allowed opacity-50"
                            : checkValidSlotThursday(
                              `Slot${i + 1}`,
                              listBooking
                            ) === true
                              ? "bg-red-500 hover:bg-red-300 cursor-not-allowed opacity-50"
                              : "bg-blue-500 hover:bg-blue-300"
                          }
                
                        ${checkValidSlotThursday(
                            `Slot${i + 1}`,
                            listBooking
                          ) === false && disableButtonsThurday
                            ? "bg-gray-400 hover:bg-gray-300 cursor-not-allowed opacity-50"
                            : "bg-blue-500 hover:bg-blue-300"
                          }`}
                      >
                        Đặt
                      </button>
                    </td>

                    <td className="p-2 border">
                      <button
                        disabled={
                          disableButtonsFriday ||
                          checkValidSlotFriday(`Slot${i + 1}`, listBooking) ||
                          checkValidSlotFridayUser(
                            `Slot${i + 1}`,
                            bookingUserByWeek
                          )
                        }
                        onClick={() =>
                          handleBooking(`Slot${i + 1}#Friday#${weekValue}`)
                        }
                        className={`p-2 rounded-full text-white px-4 
                        ${checkValidSlotFridayUser(
                          `Slot${i + 1}`,
                          bookingUserByWeek
                        ) === true
                            ? "bg-green-800 hover:bg-green-300 cursor-not-allowed opacity-50"
                            : checkValidSlotFriday(
                              `Slot${i + 1}`,
                              listBooking
                            ) === true
                              ? "bg-red-500 hover:bg-red-300 cursor-not-allowed opacity-50"
                              : "bg-blue-500 hover:bg-blue-300"
                          }
                
                        ${checkValidSlotFriday(`Slot${i + 1}`, listBooking) ===
                            false && disableButtonsFriday
                            ? "bg-gray-400 hover:bg-gray-300 cursor-not-allowed opacity-50"
                            : "bg-blue-500 hover:bg-blue-300"
                          }`}
                      >
                        Đặt
                      </button>
                    </td>

                    <td className="p-2 border">
                      <button
                        disabled={
                          disableButtonsSaturday ||
                          checkValidSlotSaturday(`Slot${i + 1}`, listBooking) ||
                          checkValidSlotSaturdayUser(
                            `Slot${i + 1}`,
                            bookingUserByWeek
                          )
                        }
                        onClick={() =>
                          handleBooking(`Slot${i + 1}#Saturday#${weekValue}`)
                        }
                        className={`p-2 rounded-full text-white px-4 
                        ${checkValidSlotSaturdayUser(
                          `Slot${i + 1}`,
                          bookingUserByWeek
                        ) === true
                            ? "bg-green-800 hover:bg-green-300 cursor-not-allowed opacity-50"
                            : checkValidSlotSaturday(
                              `Slot${i + 1}`,
                              listBooking
                            ) === true
                              ? "bg-red-500 hover:bg-red-300 cursor-not-allowed opacity-50"
                              : "bg-blue-500 hover:bg-blue-300"
                          }
                
                        ${checkValidSlotSaturday(
                            `Slot${i + 1}`,
                            listBooking
                          ) === false && disableButtonsSaturday
                            ? "bg-gray-400 hover:bg-gray-300 cursor-not-allowed opacity-50"
                            : "bg-blue-500 hover:bg-blue-300"
                          }`}
                      >
                        Đặt
                      </button>
                    </td>

                    <td className="p-2 border">
                      <button
                        disabled={
                          disableButtonsSunday ||
                          checkValidSlotSunday(`Slot${i + 1}`, listBooking) ||
                          checkValidSlotSundayUser(
                            `Slot${i + 1}`,
                            bookingUserByWeek
                          )
                        }
                        onClick={() =>
                          handleBooking(`Slot${i + 1}#Sunday#${weekValue}`)
                        }
                        className={`p-2 rounded-full text-white px-4 
                        ${checkValidSlotSundayUser(
                          `Slot${i + 1}`,
                          bookingUserByWeek
                        ) === true
                            ? "bg-green-800 hover:bg-green-300 cursor-not-allowed opacity-50"
                            : checkValidSlotSunday(
                              `Slot${i + 1}`,
                              listBooking
                            ) === true
                              ? "bg-red-500 hover:bg-red-300 cursor-not-allowed opacity-50"
                              : "bg-blue-500 hover:bg-blue-300"
                          }
                
                        ${checkValidSlotSunday(`Slot${i + 1}`, listBooking) ===
                            false && disableButtonsSunday
                            ? "bg-gray-400 hover:bg-gray-300 cursor-not-allowed opacity-50"
                            : "bg-blue-500 hover:bg-blue-300"
                          }`}
                      >
                        Đặt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

