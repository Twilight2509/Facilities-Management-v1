"use client"

import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Pagination, type PaginationProps } from "antd"
import { useEffect, useState } from "react"
import { getAllBooking, updateReportStatus } from "../../services/booking.api"
import { ProgressSpinner } from "primereact/progressspinner"
import { FacilityStatusModal } from "./facility-status-modal"
import { message } from "antd"
import {ReviewReport} from "../GuardComponent/ReportComponent/ReviewReport";
import {createReport} from "../../services/report.api";
import axios from "axios";

export default function ManageBookingRequestAccept() {
  const [bookingData, setBookingData] = useState<any[]>([])
  const [totalPage, setTotalPage] = useState<number>(0)
  const [activePage, setActivePage] = useState<number>(0)
  const [isSpinning, setIsSpinning] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
    const [isReviewMode, setIsReviewMode] = useState<boolean>(false)

    const storedDataString = localStorage.getItem("user");
    const storedData = storedDataString ? JSON.parse(storedDataString) : null;

    console.log(storedData._id);

    useEffect(() => {
    setIsSpinning(true)
    getAllBooking(2)
      .then((res) => {
        setIsSpinning(false)
        console.log("====================================")
        console.log("dataBooking::", res?.data?.booking)
        console.log("====================================")
        setBookingData(res?.data?.booking)
        setTotalPage(res?.data?.totalPage)
        setActivePage(res?.data?.activePage)
      })
      .catch((err) => {
        setIsSpinning(false)
        setBookingData([])
        setTotalPage(0)
        setActivePage(0)
      })
  }, [])

  const onChangePage: PaginationProps["onChange"] = (pageNumber) => {
    getAllBooking(2, null, pageNumber)
      .then((res) => {
        setBookingData(res?.data?.booking)
        setTotalPage(res?.data?.totalPage)
        setActivePage(res?.data?.activePage)
      })
      .catch((err) => {
        setBookingData([])
        setTotalPage(0)
        setActivePage(0)
      })
  }

  const handleSearch = (text: any) => {
    getAllBooking(2, "default", 1, 5, text)
      .then((res) => {
        setBookingData(res?.data?.booking)
        setTotalPage(res?.data?.totalPage)
        setActivePage(res?.data?.activePage)
      })
      .catch((err) => {
        setBookingData([])
        setTotalPage(0)
        setActivePage(0)
      })
  }

    const handleOpenModal = (booking: any) => {
        setSelectedBooking(booking)
        setIsReviewMode(booking?.reportStatus === 2) // Nếu đã báo cáo thì bật chế độ xem lại
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedBooking(null)
  }

    // const handleSubmitReport = async (data: { description: string; image?: File }) => {
    //     if (!selectedBooking) return;
    //
    //     // const body = {
    //     //     bookingId: selectedBooking._id,
    //     //     description: data.description,
    //     //     status: 2,
    //     //     album: [],
    //     //     securityId: storedData._id,
    //     // };
    //
    //     try {
    //         // await createReport(body);
    //         setBookingData(prev =>
    //             prev.map(item =>
    //                 item._id === selectedBooking._id
    //                     ? {
    //                         ...item,
    //                         guardId: storedData._id,
    //                         reportStatus: 2,
    //                         reportDescription: data.description,
    //                     }
    //                     : item
    //             )
    //         );
    //
    //         setIsModalOpen(false);
    //         setSelectedBooking(null);
    //         message.success("📌 Báo cáo 'Thiếu' đã được gửi");
    //     } catch (err) {
    //         console.error("Lỗi khi gửi báo cáo:", err);
    //         message.error("❌ Gửi báo cáo thất bại");
    //     }
    // };

    const handleSubmitReport = async (data: { description: string; files: File[] }) => {
        if (!selectedBooking || !storedData?._id) return

        const formData = new FormData()
        formData.append("description", data.description)
        formData.append("bookingId", selectedBooking._id)
        formData.append("securityId", storedData._id)
        formData.append("status", "2")

        data.files.forEach(file => {
            formData.append("album", file)
        })

        try {
            await axios.post("http://localhost:5152/report/create", formData)

            setBookingData(prev =>
                prev.map(item =>
                    item._id === selectedBooking._id
                        ? {
                            ...item,
                            guardId: storedData._id,
                            reportStatus: 2,
                            reportDescription: data.description,
                        }
                        : item
                )
            )

            setIsModalOpen(false)
            setSelectedBooking(null)
            message.success("📌 Báo cáo 'Thiếu' đã được gửi")
        } catch (err) {
            console.error("Lỗi khi gửi báo cáo:", err)
            message.error("❌ Gửi báo cáo thất bại")
        }
    }

    function formatDate(dateString: any) {
    if (!dateString || typeof dateString !== "string") {
      console.error("Invalid date string:", dateString)
      return "Invalid date"
    }

    const dateTimeParts = dateString.split("T")

    if (dateTimeParts.length < 2) {
      console.error("Invalid date-time format:", dateString)
      return "Invalid format"
    }

    const datePart = dateTimeParts[0]
    const timePart = dateTimeParts[1].substring(0, 8)

    return `${timePart} ${datePart}`
  }

  function formatToDDMMYYYY(dateString: string) {
    if (!dateString) return "N/A"

    const parts = dateString.split("T")[0].split("-")
    if (parts.length !== 3) return "Invalid date"

    return `${parts[2]}-${parts[1]}-${parts[0]}`
  }
  const handleMarkEnough = (booking: any) => {
    updateReportStatus(booking._id, 1) // 1 là reportStatus = Đủ
        .then(() => {
            setBookingData(prev =>
                prev.map(item =>
                    item._id === booking._id ? { ...item, reportStatus: 1 } : item
                )
            )
            message.success("Đã cập nhật trạng thái: Đủ")
        })
        .catch(err => {
            console.error("Lỗi khi cập nhật reportStatus = 1", err);
            message.error("Cập nhật trạng thái thất bại")
        })

      .catch(err => {
        console.error("Lỗi khi cập nhật reportStatus = 1", err);
      });
  };


  return (
    <div>
      <div>
        <div className="border flex flex-col justify-center">
          <div className="border text-center">
            <p className="text-2xl p-2 bg-orange-500 text-white font-semibold">Các yêu cầu được duyệt</p>
          </div>
          <div className="py-2 flex justify-between bg-blue-100">
            <div className="py-2 flex justify-end bg-blue-100">
              <input
                type="text"
                className="outline-none border border-gray-300 h-7 p-1 rounded-l-full"
                placeholder="Tìm kiếm theo..."
                onChange={(e) => handleSearch(e.target.value)}
              />
              <button className="bg-orange-500 px-2 h-7 hover:bg-orange-300 cursor-pointer rounded-r-full">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="text-white" />
              </button>
            </div>
          </div>
          <table>
            <thead className="border">
              <tr>
                <th className="p-5 border">#</th>
                <th className="p-5 border">Tên phòng (sân)</th>
                <th className="p-5 border">Slot</th>
                <th className="p-5 border">Thời gian</th>
                <th className="p-5 border">Ngày</th>
                <th className="p-5 border">Người duyệt</th>
                <th className="p-5 border">Người đặt</th>
                <th className="p-5 border">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {bookingData?.map(
                (b, index) => {
                  const status = b?.status

                  // if (status === 2) {
                  return (
                    <tr className="border" key={b?.id || index}>
                      <td className="p-5 border text-center">
                        <p>{index + 1}</p>
                      </td>
                      <td className="p-5 border text-center">
                        <p className="cursor-pointer hover:text-gray-400 flex items-center justify-center gap-1">
                          <span>{b?.facilityId?.name}</span>
                          
                        </p>
                      </td>
                      <td className="p-5 border text-center">
                        <p>{b?.slot}</p>
                      </td>
                      <td className="p-5 border text-center">
                        {b?.startDate && b.startDate.split("T")[1]?.substring(0, 5)} →
                        {b?.endDate && b.endDate.split("T")[1]?.substring(0, 5)}
                      </td>
                      <td className="p-5 border text-center">{formatToDDMMYYYY(b?.startDate)}</td>
                      <td className="p-5 border text-center">
                        <p>{b?.handler?.name}</p>
                      </td>

                      <td className="p-5 border text-center">
                        <p className="cursor-pointer hover:text-gray-400 flex items-center justify-center gap-1">
                          <span>{b?.booker?.name}</span>
                          
                        </p>
                      </td>
                      <td className="border">
                        <div className="flex flex-col items-center gap-2 w-full py-1">
                          {b?.reportStatus === 1 ? (
                            <span className="text-green-500 font-medium">Đã đủ</span>
                          ) : b?.reportStatus === 2 ? (
                              <span
                                  className="text-red-500 font-medium cursor-pointer hover:underline"
                                  onClick={() => handleOpenModal(b)}
                              >Thiếu</span>
                          ) : (
                            <>
                              <button
                                className="bg-orange-500 hover:bg-orange-300 p-2 text-white rounded-full w-24"
                                onClick={() => handleMarkEnough(b)}
                              >
                                Đủ
                              </button>
                              <button
                                className="bg-red-600 hover:bg-red-500 p-2 text-white rounded-full w-24"
                                onClick={() => handleOpenModal(b)}
                              >
                                Thiếu
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                },
                // }
              )}
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
              {!Array.isArray(bookingData) || bookingData.length === 0 ? (
                <div className="text-center">
                  <h1 className="font-bold text-3xl my-10">No data</h1>
                </div>
              ) : null}
              {totalPage > 0 && (
                <div className="flex items-center justify-center">
                  <Pagination
                    current={activePage}
                    total={Number(`${totalPage}0`)}
                    onChange={onChangePage}
                    showSizeChanger={false}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
        {isModalOpen && selectedBooking && (
            isReviewMode ? (
                <ReviewReport
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    booking={selectedBooking}
                />
            ) : (
                <FacilityStatusModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSubmit={handleSubmitReport}
                    booking={selectedBooking}
                />
            )
        )}

    </div>
  )
}

