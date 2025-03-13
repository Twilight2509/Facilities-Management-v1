"use client";
import {
  faCheck,
  faClose,
  faHourglass,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Empty,
  Modal,
  Pagination,
  PaginationProps,
  Tooltip,
} from "antd";
import { useRouter } from "next/navigation";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { getBookingByUserId } from "../../../../services/booking.api";
import { StorageService } from "../../../../services/storage";
import {
  convertWeekDateToDate,
  formatDate,
  formatDateVN,
} from "../../../../utils";

const info = (data: any) => {
  Modal.info({
    title: "Lý do",
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

const infoBooking = (data: any,router : any) => {
  function formatDateExactly(dateString: any) {
    const dateTimeParts = dateString.split("T");
    const datePart = dateTimeParts[0];
    const timePart = dateTimeParts[1].substring(0, 8); // Lấy chỉ thời gian, bỏ qua phần mili giây và múi giờ

    return `${timePart} ${datePart}`;
  }

  function formatDateBooking(dateString: any) {
    const dateTimeParts = dateString.split("T");
    const datePart = dateTimeParts[0];
    const timePart = dateTimeParts[1].substring(0, 8); // Lấy chỉ thời gian, bỏ qua phần mili giây và múi giờ

    return `${timePart} ${datePart}`;
  }

  Modal.info({
    title: "Thông tin đặt phòng",
    content: (
      <div className="my-2">
        <h2
          className="font-bold text-xl flex items-center hover:opacity-45 cursor-pointer"
          onClick={() => {
            router.push(`/detail/${data?.facilityId?._id}`);
            Modal.destroyAll()
          }}
        >
          {data?.facilityId?.name}{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height={20}
            width={20}
            viewBox="0 0 512 512"
          >
            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
          </svg>
        </h2>
        <p>Slot: {data?.slot}</p>
        <p>Thời gian bắt đầu: {formatDateExactly(data?.startDate)}</p>
        <p>Thời gian kết thúc: {formatDateExactly(data?.endDate)}</p>
        <p>
          Trạng thái:{" "}
          {data?.status === 1
            ? "Đang chờ xử lí"
            : data?.status === 2
            ? "Đã sử dụng"
            : data?.status === 3
            ? "Bị từ chối yêu cầu đặt phòng"
            : data?.status === 4
            ? "Quá hạn xử lí"
            : data?.status === 5
            ? "Được duyệt nhưng chưa sử dụng"
            : ""}
        </p>
        <p>
          Thời gian đặt:{" "}
          {data?.createdAt && new Date(data?.createdAt).toLocaleString()}
        </p>
      </div>
    ),
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

export default function HistoryBookingPage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [openHistoryBooking, setOpenHistoryBooking] = useState(false);
  const [valueInput, setValueInput] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [date, setDate] = useState("");
  const [totalPage, setTotalPage] = useState<number>(0);
  const [activePage, setActivePage] = useState<number>(1);
  const [data, setData] = useState<any[]>([]);
  const statusValue = [{ name: "pending" }, { name: "success" }];

  useEffect(() => {
    if (StorageService.isLoggedIn() === false) {
      router.push("/");
    }
  }, []);

  useEffect(() => {
    getBookingByUserId(StorageService.getUser()?.id)
      .then((res: any) => {
        console.log("booking of user ::", res.data);

        setData(res.data?.booking);
        setActivePage(res.data?.activePage);
        setTotalPage(res.data?.totalPage);
      })
      .catch((err) => {
        setData([]);
        setActivePage(1);
        setTotalPage(0);
      });
  }, []);

  const showModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setOpen(true);
  };

  const showModalBooking = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setOpenHistoryBooking(true);
  };

  const handleOkBooking = () => {
    setOpenHistoryBooking(false);
  };

  const handleCancelBooking = () => {
    setOpenHistoryBooking(false);
  };

  const handleOk = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const onChangePage: PaginationProps["onChange"] = (pageNumber) => {
    getBookingByUserId(StorageService.getUser()?.id, pageNumber)
      .then((res: any) => {
        setData(res.data?.booking);
        setActivePage(res.data?.activePage);
        setTotalPage(res.data?.totalPage);
      })
      .catch((err) => {
        setData([]);
        setActivePage(1);
        setTotalPage(0);
      });
  };

  const handleSearch = () => {
    getBookingByUserId(StorageService.getUser()?.id, 1, 9, valueInput)
      .then((res: any) => {
        setData(res.data?.booking);
        setActivePage(res.data?.activePage);
        setTotalPage(res.data?.totalPage);
      })
      .catch((err) => {
        setData([]);
        setActivePage(1);
        setTotalPage(0);
      });
  };

  const handleShow = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    data: any
  ) => {
    e.stopPropagation(); // Stop event propagation
    // Your logic here
    console.log("====================================");
    console.log("data::", data);
    console.log("====================================");
    // onClick={() => info(detailData?.description)}
    info(data.reason);
  };

  const showInfoBooking = (data: any, router: any) => {
    console.log("====================================");
    console.log("data booking ::", data);
    console.log("====================================");
    infoBooking(data,router);
  };

  return (
    <>
      <div>
        <div className="text-center">
          <h1 className="font-bold text-4xl">
            Danh sách sân thể dục , phòng học đã đặt trước
          </h1>
        </div>

        <div className="flex items-center justify-center flex-wrap mt-14 gap-3">
          <div>
            <InputText
              value={valueInput}
              onChange={(e) => setValueInput(e.target.value)}
              placeholder="Điền kí tự tìm kiếm ..."
              tooltip="Điền kí tự tìm kiếm"
              tooltipOptions={{ position: "top" }}
              className="border border-solid border-gray-300 py-3 rounded-lg shadow-none"
            />
          </div>

          <div>
            <button
              className="px-10 py-3 text-white font-semibold rounded-md hover:bg-blue-400 bg-blue-600"
              onClick={handleSearch}
            >
              Tìm kiếm
            </button>
          </div>
        </div>

        <div className="flex justify-center gap-5 my-11">
        <div className="">
            {/* <div className="w-full relative"> */}
            {/* <div className="absolute right-28"> */}
            <span className="flex items-center text-black">
              <FontAwesomeIcon icon={faSpinner} spin />
              <span>&nbsp;&nbsp;Đang chờ xử lí</span>
            </span>
            {/* </div> */}
            {/* </div> */}
          </div>
          <div className="">
            {/* <div className="w-full relative">
            <div className="absolute right-28"> */}
            <span className="flex items-center text-green-600">
              <FontAwesomeIcon className="text-xl " icon={faCheck} />
              <span>&nbsp;&nbsp;Đã sử dụng</span>
            </span>
            {/* </div>
          </div> */}
          </div>
          <div className="">
            {/* <div className="w-full relative">
            <div className="absolute right-28"> */}
            <span className="flex items-center text-red-600">
              <FontAwesomeIcon className=" " icon={faClose} />
              <span>&nbsp;&nbsp;Bị từ chối yêu cầu đặt phòng</span>
            </span>
            {/* </div>
          </div> */}
          </div>
          <div className="">
            {/* <div className="w-full relative">
            <div className="absolute right-28"> */}
            <span className="flex items-center text-gray-600">
              <FontAwesomeIcon icon={faHourglass} spin />
              <span>&nbsp;&nbsp;Quá hạn xử lí</span>
            </span>
            {/* </div>
          </div> */}
          </div>
          <div className="">
            {/* <div className="w-full relative"> */}
            {/* <div className="absolute right-28"> */}
            <span className="flex items-center text-green-600">
              <FontAwesomeIcon icon={faSpinner} spin />
              <span>&nbsp;&nbsp;Được duyệt nhưng chưa sử dụng</span>
            </span>
            {/* </div> */}
            {/* </div> */}
          </div>
        </div>
        <div className="mx-56 mt-5 flex items-center justify-center flex-wrap gap-10 pb-10">
          {data?.map((d, index) => {
            const status = d?.status;
            const color =
              status === 1
                ? "bg-black"
                : status === 2
                ? "bg-green-600"
                : status === 3
                ? "bg-red-500"
                : status === 4
                ? "bg-gray-500"
                : status === 5
                ? "bg-green-600"
                : undefined;

            return (
              <div
                key={d?._id}
                onClick={() => showInfoBooking(d, router)}
                className="relative bg-no-repeat bg-cover h-72 w-72 rounded-lg cursor-pointer shadow-lg border"
                style={{
                  backgroundImage: `url("${d?.facilityId?.image}")`,
                }}
              >
                <p
                  className={`text-center absolute top-0 left-1/2 transform -translate-x-1/2 text-xl font-bold ${color} shadow-xl text-white pb-2 px-2 rounded-b-xl z-50`}
                >
                  {d?.facilityId?.name}
                </p>
                <p
                  className={`absolute bottom-0 w-full text-center left-1/2 transform -translate-x-1/2 text-xl font-bold ${color}  shadow-xl text-white pb-2 px-2 rounded-b-lg z-50`}
                >
                  {d?.slot}-{formatDate(d?.startDate)}
                </p>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
                  {status === 1 && (
                    <FontAwesomeIcon
                      className="text-4xl"
                      icon={faSpinner}
                      spin
                    />
                  )}
                  {status === 5 && (
                    <FontAwesomeIcon
                      className="text-4xl text-green-600"
                      icon={faSpinner}
                      spin
                    />
                  )}
                  {status === 2 && (
                    <FontAwesomeIcon
                      className="text-5xl text-green-600"
                      icon={faCheck}
                    />
                  )}
                  {status === 3 && (
                    <Button
                      className="bg-red-600 text-white font-bold"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                        handleShow(e, d)
                      }
                    >
                      Xem lý do hủy
                    </Button>
                  )}

                  {status === 4 && (
                    <FontAwesomeIcon
                      className="text-4xl"
                      icon={faHourglass}
                      color="grey"
                      spin
                    />
                  )}
                </div>
                <div className="absolute top-0 left-0 w-full h-full bg-white opacity-40 rounded-lg"></div>
              </div>
            );
          })}
          {data.length === 0 && <Empty />}
        </div>
        {/* pagination */}
        {totalPage > 0 && (
          <div className="flex items-center justify-center my-16">
            <Pagination
              current={activePage}
              total={Number(`${totalPage}0`)}
              onChange={onChangePage}
              showSizeChanger={false}
            />
          </div>
        )}

        {/* deleteModal */}
      </div>
      <Modal
        className="w-fit"
        open={open}
        title="Bạn có chắc chắn muốn hủy"
        onOk={handleOk}
        closeIcon={<></>}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Không
          </Button>,
          <Button className="bg-blue-500 text-white" onClick={handleOk}>
            Có
          </Button>,
        ]}
      ></Modal>

      <Modal
        className="w-fit"
        open={openHistoryBooking}
        title="Bạn có chắc chắn muốn hủy"
        onOk={handleOkBooking}
        closeIcon={<></>}
        footer={[
          <Button key="back" onClick={handleCancelBooking}>
            Không
          </Button>,
          <Button className="bg-blue-500 text-white" onClick={handleOkBooking}>
            Có
          </Button>,
        ]}
      ></Modal>
    </>
  );
}
