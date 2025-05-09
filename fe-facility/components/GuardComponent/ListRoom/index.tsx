"use client";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import { Editor, EditorTextChangeEvent } from "primereact/editor";
import { SlotTime } from "../../../data";
import {
  FileUpload,
  FileUploadProps,
  FileUploadSelectEvent,
} from "primereact/fileupload";
import { classNames } from "primereact/utils";
import { icon } from "@fortawesome/fontawesome-svg-core";
import {
  Button,
  Modal,
  Pagination,
  PaginationProps,
  Spin,
  Tooltip,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileCsv,
  faMagnifyingGlass,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, set, useForm } from "react-hook-form";
import {
  addFacility,
  deleteFacility,
  getFacilities,
  hardDeleteFacility,
  updateFacility,
  updateStatusFaci,
} from "../../../services/facilities.api";
import { getCategory, viewUpdate } from "../../../services/category.api";
import { Toast } from "primereact/toast";
import { StorageService } from "../../../services/storage";
import {
  checkPendingSlotMonday,
  checkPendingSlotTuesday,
  checkPendingSlotWednesday,
  checkPendingSlotThursday,
  checkPendingSlotFriday,
  checkPendingSlotSaturday,
  checkPendingSlotSunday,
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
  checkReportStatusMondayUser,
  checkReportStatusTuesdayUser,
  checkReportStatusWednesdayUser,
  checkReportStatusThursdayUser,
  checkReportStatusFridayUser,
  checkReportStatusSaturdayUser,
  checkReportStatusSundayUser,
  getCurrentDate,
  getCurrentDay,
  getCurrentWeek,
} from "../../../utils";
import {
  addBooking,
  calendarBooking,
  getBookingByUserId,
  getBookingUserByWeek,
} from "../../../services/booking.api";
import {
  FRIDAY,
  MONDAY,
  SATURDAY,
  SUNDAY,
  THURSDAY,
  TUESDAY,
  WEDNESDAY,
} from "../../../constant";

import { ReviewReport } from "../ReportComponent/ReviewReport";

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

interface City {
  name: string;
  code: string;
}

const MAX_FILE_SIZE = 2000000;

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const addFacilitySchema = z.object({
  name: z
    .string()
    .trim()
    .max(100, "Maximum character is 100 characters !!!")
    .refine((categoryName) => categoryName.trim().length > 0, {
      message: "Name is required.",
    }),
  shortName: z
    .string()
    .trim()
    .max(50, "Maximum character is 50 characters !!!")
    .refine((categoryName) => categoryName.trim().length > 0, {
      message: "Short name is required.",
    }),
  category: z
    .string()
    .trim()
    .max(100, "Maximum character is 100 characters !!!")
    .refine((categoryName) => categoryName.trim().length > 0, {
      message: "Category is required.",
    }),
  address: z
    .string()
    .trim()
    .max(300, "Maximum character is 300 characters !!!")
    .refine((categoryName) => categoryName.trim().length > 0, {
      message: "Address is required.",
    }),
});

const updateFacilitySchema = z.object({
  name: z
    .string()
    .trim()
    .max(100, "Maximum character is 100 characters !!!")
    .refine((categoryName) => categoryName.trim().length > 0, {
      message: "Name is required.",
    }),
  category: z
    .string()
    .trim()
    .max(100, "Maximum character is 100 characters !!!")
    .refine((categoryName) => categoryName.trim().length > 0, {
      message: "Category is required.",
    }),
  address: z
    .string()
    .trim()
    .max(300, "Maximum character is 300 characters !!!")
    .refine((categoryName) => categoryName.trim().length > 0, {
      message: "Address is required.",
    }),
});

type addFacilitySchemaType = z.infer<typeof addFacilitySchema>;
type updateFacilitySchemaType = z.infer<typeof updateFacilitySchema>;

export default function ListRoom({
  detailData,
  showSuccessCategory,
  showErrorCategory,
}: {
  detailData: any;
  showSuccessCategory: any;
  showErrorCategory: any;
}) {
  const [localDetailData, setLocalDetailData] = useState(detailData);

  console.log("====================================");
  console.log(localDetailData);
  console.log("====================================");


  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [weekValue, setWeekValue] = useState<string>("");
  const currentDay = getCurrentDay();
  const refAdd = useRef<FileUpload | null>(null);
  const refUpdate = useRef<FileUpload | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [textValue, setTextValue] = useState<string>("");
  const [img, setImg] = useState<File | null>(null);
  const [imgUpdate, setImgUpdate] = useState<File | null>(null);
  const [location, setLocation] = useState<string>("");
  const [shortTitle, setShortTitle] = useState<string>("");
  const [description, setDescription] = useState<string | null>("");
  const [descriptionUpdate, setDescriptionUpdate] = useState<string | null>("");
  const [listCategory, setListCategory] = useState<any>();
  const [listFacility, setListFacility] = useState<any[]>([]);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [isLoadingAddFormCategory, setIsLoadingAddFormCategory] =
    useState(false);
  const [isLoadingUpdateFormCategory, setisLoadingUpdateFormCategory] =
    useState(false);
  const [dataUpdaate, setDataUpdaate] = useState<any>();
  const [activePage, setActivePage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [text, setText] = useState<string>("");

  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibles, setModalVisibles] = useState(false);
  const [viewData, setViewData] = useState<any>([null]);

  const [idFaci, setIdFaci] = useState<string | null>(null);

  const [isModalOpenChangeInactive, setIsModalOpenChangeInactive] =
    useState(false);

  const [file, setFile] = useState<File | null>(null);

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

  const showModalInactive = () => {
    setIsModalOpenChangeInactive(true);
  };
  const formatDateShort = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    return `${day}/${month}`;
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
      facilityId: localDetailData?._id,
      booker: userId,
      startDate: day.trim(),
      endDate: day.trim(),
      isComment: false,
      status: 1,
    };

    console.log("====================================");
    console.log("day::", day);
    console.log("====================================");
    addBooking(bookingBody)
      .then((res: any) => {
        if (
          res.statusCode === 400 &&
          res.message === "You already have a booking"
        ) {
          showErrorCategory("Booking failed: You already have a booking");
        } else {
          showSuccessCategory("Booking successfully !!!");
          calendarBooking(weekValue, localDetailData?._id)
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
              localDetailData?._id
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

  useEffect(() => {
    if (!weekValue) {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const isoWeek = getISOWeek(currentDate);

      const formattedWeekValue = `${year}-W${isoWeek.toString().padStart(2, "0")}`;
      setWeekValue(formattedWeekValue);
    }
    // Loại bỏ hoàn toàn logic kiểm tra ngày hiện tại và vô hiệu hóa nút
  }, [weekValue]);

  const handleOkInactive = () => {
    if (typeof idFaci === "string") {
      updateStatusFaci(idFaci)
        .then(() => {
          showSuccessCategory("Change status successfully !!!");
          getFacilities(activePage, null, "").then(
            (res: any) => {
              setListFacility(res.data.items);
              setTotalPage(res.data.totalPage);
            },
            (err) => {
              setActivePage(1);
              setTotalPage(0);
              console.log(err);
            }
          );
        })
        .catch((err) => {
          showErrorCategory("Change status failed !!!");
        });
    } else {
      showErrorCategory("Change status failed !!!");
    }

    setIsModalOpenChangeInactive(false);
  };

  const handleCancelInactive = () => {
    setIsModalOpenChangeInactive(false);
  };

  const showModalView = (id: any) => {
    viewUpdate(id, "Facility", 1, 1000)
      .then((res) => {
        setViewData(res?.data?.items);
      })
      .catch((err) => { });
    console.log("--------------------");

    console.log(viewData);

    setModalVisible(true);
  };
  const handleOkV = () => {
    setModalVisible(false);
  };
  const showModalViews = (id: any) => {
    viewUpdate(id, "Facility", 1, 1000)
      .then((res) => {
        setViewData(res?.data?.items);
      })
      .catch((err) => { });
    console.log("--------------------");

    console.log(viewData);

    setModalVisibles(true);
  };
  const handleCancelV = () => {
    setModalVisible(false);
  };
  const handleOkS = () => {
    setModalVisibles(false);
  };

  const handleCancelS = () => {
    setModalVisibles(false);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<addFacilitySchemaType>({
    resolver: zodResolver(addFacilitySchema),
  });

  const {
    register: registerUpdate,
    handleSubmit: handleSubmitUpdate,
    formState: { errors: errorsUpdate },
    reset: resetUpdate,
  } = useForm<updateFacilitySchemaType>({
    resolver: zodResolver(updateFacilitySchema),
  });

  const toastAddCategory = useRef<any>(null);

  const handleDelete = (id: string) => {
    deleteFacility(id).then(
      () => {
        showSuccessCategory("Delete facility successfully !!!");
        getFacilities(1, null, "").then(
          (res: any) => {
            setListFacility(res.data.items);
            setActivePage(1);
            setTotalPage(res.data.totalPage);
          },
          (err) => {
            setActivePage(1);
            setTotalPage(0);
            console.log(err);
          }
        );
      },
      (err) => {
        showErrorCategory("Delete facility failed !!!");
      }
    );
  };

  const handleSearch = (text: any) => {
    setText(text.trim());
    getFacilities(1, text.trim(), "").then(
      (res: any) => {
        setListFacility(res.data.items || []);
        setActivePage(1);
        setTotalPage(res.data.totalPage);
      },
      (err) => {
        setActivePage(1);
        setTotalPage(0);
        console.log(err);
      }
    );
  };

  useEffect(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const isoWeek = getISOWeek(currentDate);

    const formattedWeekValue = `${year}-W${isoWeek.toString().padStart(2, "0")}`;

    setWeekValue(formattedWeekValue);

    if (StorageService.getUser()) {
      getBookingUserByWeek(
        currentWeek,
        StorageService.getUser().id,
        localDetailData?._id
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

    calendarBooking(currentWeek, localDetailData?._id)
      .then((res: any) => {
        setListBooking(res.data);
      })
      .catch((err: Error) => {
        console.log("====================================");
        console.log("err::", err);
        console.log("====================================");
      });
  }, [localDetailData]);

  useEffect(() => {
    console.log("====================================");
    console.log("valid day::", checkValidSlotThursday("Slot8", listBooking));
    console.log("====================================");
    console.log("====================================");
    console.log("current day::", currentDay);
    console.log("====================================");
    if (!weekValue) {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const isoWeek = getISOWeek(currentDate);

      const formattedWeekValue = `${year}-W${isoWeek.toString().padStart(2, "0")}`;

      setWeekValue(formattedWeekValue);
    }
    console.log("====================================");
  }, [weekValue]);

  const getISOWeek = (date: Date) => {
    const d = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  };

  const handleSelectedFile = (e: FileUploadSelectEvent) => {
    setImg(e.files[0]);
  };

  const onChangePage: PaginationProps["onChange"] = (pageNumber: number) => {
    setActivePage(pageNumber);
    console.log("Page: ", pageNumber);
    getFacilities(pageNumber, text, "").then(
      (res: any) => {
        setListFacility(res.data.items);
        setTotalPage(res.data.totalPage);
      },
      (err) => {
        setActivePage(1);
        setTotalPage(0);
        console.log(err);
      }
    );
  };

  const handleCancelUpdate = () => {
    setImgUpdate(null);
    refUpdate.current?.setFiles([]);
    setDescriptionUpdate("");
    resetUpdate();
    setOpenUpdate(false);
  };

  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  };

  const handleCancel = () => {
    setDescription("");
    setImg(null);
    reset();
    refAdd.current?.setFiles([]);
    setOpen(false);
  };

  const showModalUpdate = (data: any) => {
    console.log(data);
    setDataUpdaate(data);
    setOpenUpdate(true);
  };

  const onSubmit = (data: any) => {
    setIsLoadingAddFormCategory(true);
    if (description && description.trim().length === 0) {
      showErrorCategory("Description must not be empty.");
      setIsLoadingAddFormCategory(false);
    } else if (Object.keys(errors).length === 0 && img) {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("category", data.category);
      formData.append("location", data.address);
      formData.append("description", description || "");
      formData.append("img", img);
      addFacility(formData)
        .then((res) => {
          handleCancel();
          reset();
          showSuccessCategory("Add facility successfully !!!");
          setIsLoadingAddFormCategory(false);
          getFacilities(activePage, null, "").then(
            (res: any) => {
              setListFacility(res.data.items);
              setTotalPage(res.data.totalPage);
            },
            (err) => {
              setActivePage(1);
              setTotalPage(0);
              console.log(err);
            }
          );
        })
        .catch((err) => {
          handleCancel();
          showErrorCategory(
            err.response.data.message || "Error adding facility !!! "
          );
          setIsLoadingAddFormCategory(false);
        });
    } else {
      showErrorCategory("Image must be less than 2MB and not empty !!");
      setIsLoadingAddFormCategory(false);
    }
  };

  const onSubmitUpdate = (data: any) => {
    setisLoadingUpdateFormCategory(true);
    if (descriptionUpdate && descriptionUpdate.trim().length === 0) {
      showErrorCategory("Description must not be empty.");
      setisLoadingUpdateFormCategory(false);
    } else if (Object.keys(errorsUpdate).length === 0) {
      const formData = new FormData();
      formData.append("id", dataUpdaate._id);
      formData.append("name", data.name);
      formData.append("category", data.category);
      formData.append("location", data.address);
      formData.append("description", descriptionUpdate || "");
      if (imgUpdate) {
        formData.append("img", imgUpdate);
      }
      updateFacility(formData)
        .then((res) => {
          if (res?.status === 200) {
            handleCancelUpdate();
            resetUpdate();
            showSuccessCategory("Update facility successfully !!!");
            setisLoadingUpdateFormCategory(false);
            setImgUpdate(null);
            getFacilities(activePage, null, "").then(
              (res) => {
                setListFacility(res?.data.items);
                setTotalPage(res?.data.totalPage);
              },
              (err) => {
                setActivePage(1);
                setTotalPage(0);
                console.log(err);
              }
            );
          } else {
            showErrorCategory(res?.data.message || "Facility name Exist");
            setisLoadingUpdateFormCategory(false);
          }
        })
        .catch((err) => {
          handleCancelUpdate();
          showErrorCategory(
            err.response.data.message || "Error updating facility !!! "
          );
          setisLoadingUpdateFormCategory(false);
        });
    } else {
      showErrorCategory("Image must be less than 2MB and not empty !!");
      setisLoadingUpdateFormCategory(false);
    }
  };

  const handleSelectedFileUpdate = (e: FileUploadSelectEvent) => {
    setImgUpdate(e.files[0]);
  };

  useLayoutEffect(() => {
    setIsSpinning(true);
    getCategory()
      .then((res: any) => {
        console.log(res);
        setListCategory(res.data.item);
      })
      .catch((error) => {
        console.log(error);
      });
    getFacilities(1, null, "").then(
      (res: any) => {
        setListFacility(res.data.items);
        setActivePage(1);
        setTotalPage(res.data.totalPage);
        setIsSpinning(false);
      },
      (err) => {
        setActivePage(1);
        setTotalPage(0);
        console.log(err);
        setIsSpinning(false);
      }
    );
  }, []);

  const handleChangeStatus = (
    statusCurrent: number,
    changeStatus: number,
    data: any
  ) => {
    setIdFaci(data._id);

    if (statusCurrent !== changeStatus) {
      if (statusCurrent === 1) {
        showModalInactive();
        return;
      }

      updateStatusFaci(data._id)
        .then(() => {
          showSuccessCategory("Change status successfully !!!");
          getFacilities(activePage, null, "").then(
            (res: any) => {
              setListFacility(res.data.items);
              setActivePage(activePage);
              setTotalPage(res.data.totalPage);
            },
            (err) => {
              setActivePage(1);
              setTotalPage(0);
            }
          );
        })
        .catch((err) => {
          showErrorCategory(err.response?.data?.message);
        });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleExcelSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!file) {
      showErrorCategory("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5152/facility/import", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        showSuccessCategory("Import facility successfully !!!");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      showErrorCategory("Import facility error !!!");
    }
  };
  const handleWeekChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedWeek = event.target.value;

    if (StorageService.getUser()) {
      getBookingUserByWeek(
        event.target.value,
        StorageService.getUser().id,
        localDetailData?._id
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

    calendarBooking(event.target.value, localDetailData?._id)
      .then((res: any) => {
        setListBooking(res.data);
      })
      .catch((err: Error) => {
        console.log("====================================");
        console.log("err::", err);
        console.log("====================================");
      });
    setWeekValue(selectedWeek);
  };

  const showModal = () => {
    if (StorageService.isLoggedIn() === false) {
      showErrorCategory("You must login in to book room !!!");
      return;
    }
    setOpen(true);
  };


  // Thay đổi tên state và hàm để phù hợp với ReviewReport
  const [isReviewReportOpen, setIsReviewReportOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const handleOpenReviewModal = (bookingId: string) => {
    // Tìm booking trong listBooking dựa trên ID
    const booking = Object.values(listBooking)
      .flat()
      .find((item: any) => item._id === bookingId);

    if (booking) {
      setSelectedBooking(booking);
      setIsReviewReportOpen(true);
    } else {
      showErrorCategory("Không tìm thấy thông tin booking!");
    }
  };

  const handleReviewReportClose = () => {
    setIsReviewReportOpen(false);
    setSelectedBooking(null);
  };
  return (
    <>
      <div className="">
        <div>
          <div className="border flex flex-col justify-center">
            <div className="border text-center">
              <p className="text-2xl p-2 bg-orange-500 text-white font-semibold">
                Quản lý phòng , sân thể dục
              </p>
            </div>
            <div className="flex justify-between bg-blue-100">
              <div className="py-2 flex justify-end bg-blue-100">
                <input
                  type="text"
                  className="outline-none border border-gray-300 h-7 p-1 rounded-full"
                  placeholder="Điền kí tự để tìm kiếm ..."
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
            <table>
              <thead className="border">
                <tr>
                  <th className="p-5 border">#</th>
                  <th className="p-5 border">Tên phòng (sân)</th>
                  <th className="p-5 border"></th>
                  <th className="p-5 border">Tình trạng hiện tại</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {Array.isArray(listFacility) &&
                  listFacility.length > 0 &&
                  listFacility.map((facility, index) => (
                    <tr className="" key={index}>
                      <td className="p-5 border text-center">
                        <p>{index + 1}</p>
                      </td>
                      <td className="p-5 border text-center">
                        <p className="cursor-pointer hover:text-gray-400 flex items-center justify-center gap-1">
                          <span>{facility?.name}</span>
                        </p>
                      </td>
                      <td className="p-5 border text-center"></td>
                      <td className="border">
                        <div className="flex flex-col items-center gap-2 w-full py-1">
                          <button
                            onClick={() => {
                              setLocalDetailData(facility);
                              showModal();
                            }}
                            className="bg-green-500 hover:bg-green-300 text-white font-semibold px-5 py-2 rounded-md"
                          >
                            Kiểm tra lịch
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {isSpinning === true ? (
              <ProgressSpinner
                className="w-52 h-52 my-10"
                strokeWidth="3"
                fill="var(--surface-ground)"
                animationDuration=".5s"
              />
            ) : (
              <>
                {!Array.isArray(listFacility) || listFacility.length === 0 ? (
                  <div className="text-center">
                    <h1 className="font-bold text-3xl my-10">No data</h1>
                  </div>
                ) : null}
                {totalPage > 0 && (
                  <div className="flex items-center justify-center">
                    <Pagination
                      current={activePage}
                      total={Number(totalPage + "0")}
                      onChange={onChangePage}
                      showSizeChanger={false}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <Toast ref={toastAddCategory} />
      </div>
      {/* modal booking */}
      <Modal
        className="w-fit z-[1000]"
        open={open}
        onOk={handleOk}
        closeIcon={<></>}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Hủy
          </Button>,
        ]}
      >
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
            <Tooltip title="Chưa báo cáo">
              <div className="w-1 h-4 bg-yellow-500"></div>
            </Tooltip>
            <Tooltip title="Đã báo cáo">
              <div className="w-1 h-4 bg-green-500"></div>
            </Tooltip>
            <Tooltip title="Thiếu đồ">
              <div className="w-1 h-4 bg-red-500"></div>
            </Tooltip>
            <Tooltip title="Trống">
              <div className="w-1 h-4 bg-gray-500"></div>
            </Tooltip>
          </div>
          <div className="flex justify-center">
            <table className="border">
              <thead>
                <tr>
                  <th className="p-2 border text-center"></th>
                  {weeks.map((week, i) => {
                    const dateStr = getCurrentDate(week as any, weekValue);
                    return (
                      <th key={i} className="p-2 border text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-medium">{week}</span>
                          <span className="text-sm text-gray-500">
                            {formatDateShort(dateStr)}
                          </span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 9 }, (_, i) => {
                  const slot = `Slot${i + 1}`;
                  const mondayStatus = checkReportStatusMondayUser(slot, listBooking);
                  const tuesdayStatus = checkReportStatusTuesdayUser(slot, listBooking);
                  const wednesdayStatus = checkReportStatusWednesdayUser(slot, listBooking);
                  const thursdayStatus = checkReportStatusThursdayUser(slot, listBooking);
                  const fridayStatus = checkReportStatusFridayUser(slot, listBooking);
                  const saturdayStatus = checkReportStatusSaturdayUser(slot, listBooking);
                  const sundayStatus = checkReportStatusSundayUser(slot, listBooking);

                  return (
                    <tr key={`slot_${i}_Slot1`}>
                      <td className="p-2 border">
                        <Tooltip title={`${SlotTime[slot]}`}>
                          <div className="flex items-center gap-1">
                            <p className="text-xl">{slot}</p>
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
                      {/* Monday */}
                      <td className="p-2 border">
                        <button
                          onClick={() => {
                            if (mondayStatus.reportStatus === 2 && mondayStatus.id) {
                              handleOpenReviewModal(mondayStatus.id);
                            }
                          }}
                          className={`w-24 h-10 rounded-full text-white px-2 text-xs truncate
                      ${mondayStatus.reportStatus === 0
                              ? "bg-yellow-500 hover:bg-yellow-400 cursor-not-allowed opacity-50"
                              : mondayStatus.reportStatus === 1
                                ? "bg-green-500 hover:bg-green-400 cursor-not-allowed opacity-50"
                                : mondayStatus.reportStatus === 2
                                  ? "bg-red-500 hover:bg-red-400"
                                  : mondayStatus.reportStatus === 3
                                    ? "bg-gray-500 cursor-not-allowed opacity-50"
                                    : "bg-gray-500 cursor-not-allowed opacity-50"
                            }`}
                          disabled={
                            mondayStatus.reportStatus !== 2 ||
                            (!checkValidSlotMonday(slot, listBooking) &&
                              !checkValidSlotMondayUser(slot, bookingUserByWeek))
                          }
                        >
                          {mondayStatus.reportStatus === 0
                            ? "Chưa báo cáo"
                            : mondayStatus.reportStatus === 1
                              ? "Đủ"
                              : mondayStatus.reportStatus === 2
                                ? "Thiếu/Hỏng"
                                : mondayStatus.reportStatus === 3
                                  ? "Trống"
                                  : ""}
                        </button>
                      </td>
                      {/* Tuesday */}
                      <td className="p-2 border">
                        <button
                          onClick={() => {
                            if (tuesdayStatus.reportStatus === 2 && tuesdayStatus.id) {
                              handleOpenReviewModal(tuesdayStatus.id);
                            }
                          }}
                          className={`w-24 h-10 rounded-full text-white px-2 text-xs truncate
                      ${tuesdayStatus.reportStatus === 0
                              ? "bg-yellow-500 hover:bg-yellow-400 cursor-not-allowed opacity-50"
                              : tuesdayStatus.reportStatus === 1
                                ? "bg-green-500 hover:bg-green-400 cursor-not-allowed opacity-50"
                                : tuesdayStatus.reportStatus === 2
                                  ? "bg-red-500 hover:bg-red-400"
                                  : tuesdayStatus.reportStatus === 3
                                    ? "bg-gray-500 cursor-not-allowed opacity-50"
                                    : "bg-gray-500 cursor-not-allowed opacity-50"
                            }`}
                          disabled={
                            tuesdayStatus.reportStatus !== 2 ||
                            (!checkValidSlotTuesday(slot, listBooking) &&
                              !checkValidSlotTuesdayUser(slot, bookingUserByWeek))
                          }
                        >
                          {tuesdayStatus.reportStatus === 0
                            ? "Chưa báo cáo"
                            : tuesdayStatus.reportStatus === 1
                              ? "Đủ"
                              : tuesdayStatus.reportStatus === 2
                                ? "Thiếu/Hỏng"
                                : tuesdayStatus.reportStatus === 3
                                  ? "Trống"
                                  : ""}
                        </button>
                      </td>
                      {/* Wednesday */}
                      <td className="p-2 border">
                        <button
                          onClick={() => {
                            if (wednesdayStatus.reportStatus === 2 && wednesdayStatus.id) {
                              handleOpenReviewModal(wednesdayStatus.id);
                            }
                          }}
                          className={`w-24 h-10 rounded-full text-white px-2 text-xs truncate
                      ${wednesdayStatus.reportStatus === 0
                              ? "bg-yellow-500 hover:bg-yellow-400 cursor-not-allowed opacity-50"
                              : wednesdayStatus.reportStatus === 1
                                ? "bg-green-500 hover:bg-green-400 cursor-not-allowed opacity-50"
                                : wednesdayStatus.reportStatus === 2
                                  ? "bg-red-500 hover:bg-red-400"
                                  : wednesdayStatus.reportStatus === 3
                                    ? "bg-gray-500 cursor-not-allowed opacity-50"
                                    : "bg-gray-500 cursor-not-allowed opacity-50"
                            }`}
                          disabled={
                            wednesdayStatus.reportStatus !== 2 ||
                            (!checkValidSlotWednesday(slot, listBooking) &&
                              !checkValidSlotWednesdayUser(slot, bookingUserByWeek))
                          }
                        >
                          {wednesdayStatus.reportStatus === 0
                            ? "Chưa báo cáo"
                            : wednesdayStatus.reportStatus === 1
                              ? "Đủ"
                              : wednesdayStatus.reportStatus === 2
                                ? "Thiếu/Hỏng"
                                : wednesdayStatus.reportStatus === 3
                                  ? "Trống"
                                  : ""}
                        </button>
                      </td>
                      {/* Thursday */}
                      <td className="p-2 border">
                        <button
                          onClick={() => {
                            if (thursdayStatus.reportStatus === 2 && thursdayStatus.id) {
                              handleOpenReviewModal(thursdayStatus.id);
                            }
                          }}
                          className={`w-24 h-10 rounded-full text-white px-2 text-xs truncate
                      ${thursdayStatus.reportStatus === 0
                              ? "bg-yellow-500 hover:bg-yellow-400 cursor-not-allowed opacity-50"
                              : thursdayStatus.reportStatus === 1
                                ? "bg-green-500 hover:bg-green-400 cursor-not-allowed opacity-50"
                                : thursdayStatus.reportStatus === 2
                                  ? "bg-red-500 hover:bg-red-400"
                                  : thursdayStatus.reportStatus === 3
                                    ? "bg-gray-500 cursor-not-allowed opacity-50"
                                    : "bg-gray-500 cursor-not-allowed opacity-50"
                            }`}
                          disabled={
                            thursdayStatus.reportStatus !== 2 ||
                            (!checkValidSlotThursday(slot, listBooking) &&
                              !checkValidSlotThursdayUser(slot, bookingUserByWeek))
                          }
                        >
                          {thursdayStatus.reportStatus === 0
                            ? "Chưa báo cáo"
                            : thursdayStatus.reportStatus === 1
                              ? "Đủ"
                              : thursdayStatus.reportStatus === 2
                                ? "Thiếu/Hỏng"
                                : thursdayStatus.reportStatus === 3
                                  ? "Trống"
                                  : ""}
                        </button>
                      </td>
                      {/* Friday */}
                      <td className="p-2 border">
                        <button
                          onClick={() => {
                            if (fridayStatus.reportStatus === 2 && fridayStatus.id) {
                              handleOpenReviewModal(fridayStatus.id);
                            }
                          }}
                          className={`w-24 h-10 rounded-full text-white px-2 text-xs truncate
                      ${fridayStatus.reportStatus === 0
                              ? "bg-yellow-500 hover:bg-yellow-400 cursor-not-allowed opacity-50"
                              : fridayStatus.reportStatus === 1
                                ? "bg-green-500 hover:bg-green-400 cursor-not-allowed opacity-50"
                                : fridayStatus.reportStatus === 2
                                  ? "bg-red-500 hover:bg-red-400"
                                  : fridayStatus.reportStatus === 3
                                    ? "bg-gray-500 cursor-not-allowed opacity-50"
                                    : "bg-gray-500 cursor-not-allowed opacity-50"
                            }`}
                          disabled={
                            fridayStatus.reportStatus !== 2 ||
                            (!checkValidSlotFriday(slot, listBooking) &&
                              !checkValidSlotFridayUser(slot, bookingUserByWeek))
                          }
                        >
                          {fridayStatus.reportStatus === 0
                            ? "Chưa báo cáo"
                            : fridayStatus.reportStatus === 1
                              ? "Đủ"
                              : fridayStatus.reportStatus === 2
                                ? "Thiếu/Hỏng"
                                : fridayStatus.reportStatus === 3
                                  ? "Trống"
                                  : ""}
                        </button>
                      </td>
                      {/* Saturday */}
                      <td className="p-2 border">
                        <button
                          onClick={() => {
                            if (saturdayStatus.reportStatus === 2 && saturdayStatus.id) {
                              handleOpenReviewModal(saturdayStatus.id);
                            }
                          }}
                          className={`w-24 h-10 rounded-full text-white px-2 text-xs truncate
                      ${saturdayStatus.reportStatus === 0
                              ? "bg-yellow-500 hover:bg-yellow-400 cursor-not-allowed opacity-50"
                              : saturdayStatus.reportStatus === 1
                                ? "bg-green-500 hover:bg-green-400 cursor-not-allowed opacity-50"
                                : saturdayStatus.reportStatus === 2
                                  ? "bg-red-500 hover:bg-red-400"
                                  : saturdayStatus.reportStatus === 3
                                    ? "bg-gray-500 cursor-not-allowed opacity-50"
                                    : "bg-gray-500 cursor-not-allowed opacity-50"
                            }`}
                          disabled={
                            saturdayStatus.reportStatus !== 2 ||
                            (!checkValidSlotSaturday(slot, listBooking) &&
                              !checkValidSlotSaturdayUser(slot, bookingUserByWeek))
                          }
                        >
                          {saturdayStatus.reportStatus === 0
                            ? "Chưa báo cáo"
                            : saturdayStatus.reportStatus === 1
                              ? "Đủ"
                              : saturdayStatus.reportStatus === 2
                                ? "Thiếu/Hỏng"
                                : saturdayStatus.reportStatus === 3
                                  ? "Trống"
                                  : ""}
                        </button>
                      </td>
                      {/* Sunday */}
                      <td className="p-2 border">
                        <button
                          onClick={() => {
                            if (sundayStatus.reportStatus === 2 && sundayStatus.id) {
                              handleOpenReviewModal(sundayStatus.id);
                            }
                          }}
                          className={`w-24 h-10 rounded-full text-white px-2 text-xs truncate
                      ${sundayStatus.reportStatus === 0
                              ? "bg-yellow-500 hover:bg-yellow-400 cursor-not-allowed opacity-50"
                              : sundayStatus.reportStatus === 1
                                ? "bg-green-500 hover:bg-green-400 cursor-not-allowed opacity-50"
                                : sundayStatus.reportStatus === 2
                                  ? "bg-red-500 hover:bg-red-400"
                                  : sundayStatus.reportStatus === 3
                                    ? "bg-gray-500 cursor-not-allowed opacity-50"
                                    : "bg-gray-500 cursor-not-allowed opacity-50"
                            }`}
                          disabled={
                            sundayStatus.reportStatus !== 2 ||
                            (!checkValidSlotSunday(slot, listBooking) &&
                              !checkValidSlotSundayUser(slot, bookingUserByWeek))
                          }
                        >
                          {sundayStatus.reportStatus === 0
                            ? "Chưa báo cáo"
                            : sundayStatus.reportStatus === 1
                              ? "Đủ"
                              : sundayStatus.reportStatus === 2
                                ? "Thiếu/Hỏng"
                                : sundayStatus.reportStatus === 3
                                  ? "Trống"
                                  : ""}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      <ReviewReport
        isOpen={isReviewReportOpen}
        onClose={handleReviewReportClose}
        booking={selectedBooking}
      />
    </>
  );
}