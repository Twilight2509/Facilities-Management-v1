import {
  faFileCsv,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Modal, Pagination, PaginationProps, Tooltip } from "antd";
import { useEffect, useRef, useState } from "react";
import { editBooking, getAllBooking } from "../../../services/booking.api";
import { Toast } from "primereact/toast";
import { getAllRole } from "../../../services/user.api";
import { ProgressSpinner } from "primereact/progressspinner";

export default function ManageBookingRequest() {
  const [bookingData, setBookingData] = useState<any[]>([]);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [activePage, setActivePage] = useState<number>(0);
  const [selectedValue, setSelectedValue] = useState<string>("default");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idReject, setIdReject] = useState<string>("");
  const [because, setBecause] = useState<string>("");
  const toastAddCategory = useRef<any>(null);
  const [role, setRole] = useState<any[]>([]);
  const [roleValue, setRoleValue] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [rejectData, setRejectData] = useState<any>();

  const showErrorCategory = (msg: string) => {
    toastAddCategory.current.show({
      severity: "error",
      summary: "Error",
      detail: msg,
      life: 3000,
    });
  };

  const showSuccessCategory = (msg: string) => {
    toastAddCategory.current.show({
      severity: "success",
      summary: "Success",
      detail: msg,
      life: 3000,
    });
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setBecause("");
    setIsModalOpen(false);
  };

  useEffect(() => {
    setIsSpinning(true);
    getAllRole().then(
      (res: any) => {
        setRole(res.data);
        console.log("====================================");
        console.log("role::", res.data);
        console.log("====================================");
      },
      (err: any) => {}
    );

    getAllBooking(1, selectedValue, 1)
      .then((res) => {
        setBookingData(res?.data?.booking);
        setTotalPage(res?.data?.totalPage);
        setActivePage(res?.data?.activePage);
        setIsSpinning(false);
      })
      .catch((err) => {
        setIsSpinning(false);
        setBookingData([]);
        setTotalPage(0);
        setActivePage(0);
      });
  }, []);

  const onChangePage: PaginationProps["onChange"] = (pageNumber) => {
    getAllBooking(1, selectedValue, pageNumber)
      .then((res) => {
        setBookingData(res?.data?.booking);
        setTotalPage(res?.data?.totalPage);
        setActivePage(res?.data?.activePage);
      })
      .catch((err) => {
        setBookingData([]);
        setTotalPage(0);
        setActivePage(0);
      });
  };

  const handleAccept = (data: any) => {
    const status = 2;
    console.log("====================================");
    console.log("dataAccept::", data);
    console.log("====================================");
    console.log("====================================");
    console.log("data::", data);
    console.log("====================================");
    editBooking(
      {
        facilityId: data.facilityId._id,
        status,
        slot: data.slot,
        startDate: data.startDate,
      },
      data?._id
    )
      .then((res) => {
        getAllBooking(1, selectedValue, 1)
          .then((res) => {
            setBookingData(res?.data?.booking);
            setTotalPage(res?.data?.totalPage);
            setActivePage(res?.data?.activePage);
          })
          .catch((err) => {
            setBookingData([]);
            setTotalPage(0);
            setActivePage(0);
          });
      })
      .catch((err) => {});
  };

  const handleReject = (data: any) => {
    setIdReject(data?._id);
    setRejectData(data);
    showModal();
  };

  const handleRejectModal = () => {
    const status = 3;

    if (because.trim() === "") {
      showErrorCategory("Vui lòng không để trống !!!");
      return;
    }

    editBooking(
      {
        status,
        reason: because,
        facilityId: rejectData.facilityId._id,
        slot: rejectData.slot,
      },
      idReject
    )
      .then((res) => {
        setBecause("");
        handleCancel();
        getAllBooking(1, selectedValue, 1)
          .then((res) => {
            setBookingData(res?.data?.booking);
            setTotalPage(res?.data?.totalPage);
            setActivePage(res?.data?.activePage);
          })
          .catch((err) => {
            setBookingData([]);
            setTotalPage(0);
            setActivePage(0);
          });
      })
      .catch((err) => {});
  };

  

  const handleRole = (data: any) => {
    setRoleValue(data);
    getAllBooking(1, selectedValue, 1, 5, text, data)
      .then((res) => {
        setBookingData(res?.data?.booking);
        setTotalPage(res?.data?.totalPage);
        setActivePage(res?.data?.activePage);
      })
      .catch((err) => {
        setBookingData([]);
        setTotalPage(0);
        setActivePage(0);
      });
  };

  const handleSearch = (data: any) => {
    setText(data);
    getAllBooking(1, selectedValue, 1, 5, data, roleValue)
      .then((res) => {
        setBookingData(res?.data?.booking);
        setTotalPage(res?.data?.totalPage);
        setActivePage(res?.data?.activePage);
      })
      .catch((err) => {
        setBookingData([]);
        setTotalPage(0);
        setActivePage(0);
      });
  };

  function formatDate(dateString: any) {
    const dateTimeParts = dateString.split("T");
    const datePart = dateTimeParts[0];
    const timePart = dateTimeParts[1].substring(0, 8); // Lấy chỉ thời gian, bỏ qua phần mili giây và múi giờ

    return `${timePart} ${datePart}`;
  }

  return (
    <div>
      <div>
        <div className="border flex flex-col justify-center">
          <div className="border text-center">
            <p className="text-2xl p-2 bg-blue-500 text-white font-semibold">
              Các yêu cầu đang chờ xử lí
            </p>
          </div>
          {/* <div className="py-2 flex justify-between bg-blue-100"> */}
          <div className="py-1">
            <div className="flex justify-between">
              <div>
                <input
                  type="text"
                  className="outline-none border border-gray-300 h-7 p-1 rounded-full"
                  placeholder="Điền kí tự để tìm kiếm ..."
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <div>
                <select
                  className="outline-none border border-gray-300 h-7 p-1 rounded-full"
                  value={roleValue}
                  onChange={(e) => handleRole(e.target.value)}
                >
                  <option value="default">Cấp bậc</option>
                  {role &&
                    role.map((role, index: number) => {
                      return (
                        <option value={`${role?._id}`} key={index}>
                          {role?.roleName}
                        </option>
                      );
                    })}
                </select>
              </div>
            </div>
          </div>
          <table>
            <thead className="border">
              <tr>
                <th className="p-5 border">#</th>
                <th className="p-5 border">Tên phòng (sân)</th>
                <th className="p-5 border">Slot</th>
                <th className="p-5 border">Thời gian bắt đầu</th>
                <th className="p-5 border">Thời gian kết thúc</th>
                <th className="p-5 border">Thời gian đặt</th>
                <th className="p-5 border">Cấp bậc</th>
                <th className="p-5 border">Trạng thái</th>
                <th className="p-5 border">Người đặt</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {bookingData?.length > 0 &&
                bookingData?.map((b, index) => {
                  console.log("====================================");
                  console.log("b::", b);
                  console.log("====================================");
                  const status = b?.status;

                  if (status === 1) {
                    return (
                      <tr className="border">
                        <td className="p-5 border text-center">
                          <p>{index + 1}</p>
                        </td>
                        <td className="p-5 border text-center">
                          <p className="cursor-pointer hover:text-gray-400 flex items-center justify-center gap-1">
                            <span>{b?.facilityId?.name}</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height={10}
                              width={10}
                              viewBox="0 0 512 512"
                            >
                              <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
                            </svg>
                          </p>
                        </td>
                        <td className="p-5 border text-center">
                          <p>{b?.slot}</p>
                        </td>
                        <td className="p-5 border text-center">
                          <p>{b && formatDate(b?.startDate)}</p>
                        </td>
                        <td className="p-5 border text-center">
                          <p>{b && formatDate(b?.endDate)}</p>
                        </td>

                        <td className="p-5 border text-center">
                          <p>{b && new Date(b?.createdAt).toLocaleString()}</p>
                        </td>
                        <td className="p-5 border text-center">
                          <p>{b?.booker?.roleId?.roleName}</p>
                        </td>
                        <td className="p-5 border text-center">
                          <p>Đang chờ xử lí</p>
                        </td>
                        <td className="p-5 border text-center">
                          <p className="cursor-pointer hover:text-gray-400 flex items-center justify-center gap-1">
                            <span>{b?.booker?.name}</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height={10}
                              width={10}
                              viewBox="0 0 512 512"
                            >
                              <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
                            </svg>
                          </p>
                        </td>
                        <td className="w-1">
                          <div className="flex flex-col gap-2 w-full py-1">
                            <button
                              className="bg-green-400 hover:bg-green-300 p-2 text-white rounded-full"
                              onClick={() => handleAccept(b)}
                            >
                              Chấp nhận
                            </button>
                            <button
                              className="bg-red-400 hover:bg-red-300 p-2 text-white rounded-full"
                              onClick={() => handleReject(b)}
                            >
                              Hủy
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                })}
            </tbody>
          </table>
          {isSpinning === true ? (
            <ProgressSpinner
              className="w-52 h-52 my-10"
              strokeWidth={"3"}
              fill="var(--surface-ground)"
              animationDuration=".5s"
            />
          ) : !Array.isArray(bookingData) || bookingData.length === 0 ? (
            <div className="text-center">
              <h1 className="font-bold text-3xl my-10">No data</h1>
            </div>
          ) : (
            totalPage > 0 && (
              <div className="flex items-center justify-center">
                <Pagination
                  current={activePage}
                  total={Number(`${totalPage}0`)}
                  onChange={onChangePage}
                  showSizeChanger={false}
                />
              </div>
            )
          )}
        </div>
      </div>
      <Toast ref={toastAddCategory} />
    
      <Modal
        title="Lý do hủy"
        visible={isModalOpen}
        onCancel={() => {
          setBecause(""); // Reset the input value
          setIsModalOpen(false);
        }}
        footer={null}
        destroyOnClose={true} // Add destroyOnClose property
      >
        <input
          type="text"
          className="outline-none border border-gray-300 h-7 p-1 rounded-lg w-full my-5"
          placeholder={`${because}`}
          value={because} // Set value to input
          onChange={(e) => setBecause(e.target.value)}
        />

        <div className="flex justify-end">
          <Button
            key="back"
            onClick={() => {
              setBecause(""); // Reset the input value
              setIsModalOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            className="bg-blue-500 text-white"
            htmlType="submit"
            onClick={handleRejectModal}
          >
            OK
          </Button>
        </div>
      </Modal>
    </div>
  );
}
