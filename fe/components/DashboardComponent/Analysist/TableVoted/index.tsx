"use client";
import React, { useEffect, useState } from "react";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";

import { Editor, EditorTextChangeEvent } from "primereact/editor";

import {
  FileUpload,
  FileUploadProps,
  FileUploadSelectEvent,
} from "primereact/fileupload";
import { classNames } from "primereact/utils";
import { icon } from "@fortawesome/fontawesome-svg-core";
import {
  Avatar,
  Button,
  Empty,
  Modal,
  Pagination,
  PaginationProps,
  Tooltip,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileCsv,
  faMagnifyingGlass,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { getListDashboard } from "../../../../services/dashboard.api";
import { getCommentByFacilityId } from "../../../../services/voting.api";
import { Rating, RatingChangeEvent } from "primereact/rating";

const info = (
  data: any,
  totalPage: number,
  activePage: number,
  onChangePageComment: any
) => {
  Modal.info({
    title: "Thông tin chi tiết",
    width: 800,
    content: (
      <div className="my-5">
        {data &&
          data.map((comment: any, index: number) => (
            <div className="flex gap-5 items-center mt-5" key={index}>
              <div>
                <Avatar
                  src={comment?.userId?.avatar}
                  size={{ xs: 14, sm: 22, md: 30, lg: 54, xl: 70, xxl: 90 }}
                />
              </div>
              <div className="border border-solid border-gray-300 p-4 rounded-xl w-full">
                <div className="flex gap-5">
                  <div>
                    <p className="font-bold">{comment?.userId?.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="16"
                        width="14"
                        viewBox="0 0 448 512"
                      >
                        <path d="M96 32V64H48C21.5 64 0 85.5 0 112v48H448V112c0-26.5-21.5-48-48-48H352V32c0-17.7-14.3-32-32-32s-32 14.3-32 32V64H160V32c0-17.7-14.3-32-32-32S96 14.3 96 32zM448 192H0V464c0 26.5 21.5 48 48 48H400c26.5 0 48-21.5 48-48V192z" />
                      </svg>
                      &nbsp;{new Date(comment?.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="my-2">
                  <Rating
                    disabled
                    cancelIcon={<></>}
                    value={comment?.star}
                    className="shadow-none"
                  />
                </div>
                <div>
                  <p>{comment?.content}</p>
                </div>
              </div>
            </div>
          ))}
        {data.length === 0 && <Empty />}
        {data.length > 0 && totalPage > 1 &&(
          <div className="flex items-center justify-center mt-2">
            <Pagination
              defaultCurrent={activePage}
              total={Number(totalPage + "0")}
              onChange={onChangePageComment}
              showSizeChanger={false}
            />
          </div>
        )}
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

export default function TableVoted() {
  const [totalPage, setTotalPage] = useState<number>(0);
  const [activePage, setActivePage] = useState<number>(0);
  const [listData, setListData] = useState<any[]>([]);
  const [listComment, setListComment] = useState<any[]>([]);
  const [textSearch, setTextSearch] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState("default");
  const [idFaci, setIdFaci] = useState<any>();

  useEffect(() => {
    getListDashboard().then(
      (res: any) => {
        console.log("====================================");
        // console.log("res::", res.data.items);
        console.log("====================================");
        setListData(res?.data?.items);
        setTotalPage(res?.data?.totalPage);
        setActivePage(res?.data?.activePage);
      },
      (err) => {
        setListData([]);
        setTotalPage(0);
        setActivePage(0);
        console.log("====================================");
        console.log("err::", err);
        console.log("====================================");
      }
    );
  }, []);

  const onChangePageComment: PaginationProps["onChange"] = (pageNumber) => {
    getCommentByFacilityId(idFaci, pageNumber, 1).then(
      (res: any) => {
        console.log("====================================");
        console.log("resComment::", res.data);
        console.log("====================================");
        info(
          res.data.items,
          res.data.totalPage,
          res.data.activePage,
          onChangePageComment
        );
      },
      (err) => {
        console.log("====================================");
        console.log("err::", err);
        console.log("====================================");
      }
    );
  };

  const onChangePage: PaginationProps["onChange"] = (pageNumber) => {
    console.log("Page: ", pageNumber);
    getListDashboard(
      pageNumber,
      textSearch.trim(),
      selectedValue === "default" ? null : selectedValue
    ).then(
      (res: any) => {
        console.log("====================================");
        console.log("res::", res.data.items);
        console.log("====================================");
        setListData(res.data.items);
        setTotalPage(res.data.totalPage);
        setActivePage(res.data.activePage);
      },
      (err) => {
        setListData([]);
        setTotalPage(0);
        setActivePage(0);
        console.log("====================================");
        console.log("err::", err);
        console.log("====================================");
      }
    );
  };

  const handleViewComment = (id: string) => {
    console.log("====================================");
    console.log("id::", id);
    console.log("====================================");
    setIdFaci(id);

    getCommentByFacilityId(id, null, 1).then(
      (res: any) => {
        console.log("====================================");
        console.log("resComment::", res.data);
        console.log("====================================");
        info(
          res.data.items,
          res.data.totalPage,
          res.data.activePage,
          onChangePageComment
        );
      },
      (err) => {
        console.log("====================================");
        console.log("err::", err);
        console.log("====================================");
      }
    );
  };

  const handleSearch = (text: any) => {
    setTextSearch(text);
    getListDashboard(
      1,
      text.trim(),
      selectedValue === "default" ? null : selectedValue
    ).then(
      (res: any) => {
        console.log("====================================");
        console.log("res::", res.data.items);
        console.log("====================================");
        setListData(res.data.items);
        setTotalPage(res.data.totalPage);
        setActivePage(res.data.activePage);
      },
      (err) => {
        setListData([]);
        setTotalPage(0);
        setActivePage(0);
        console.log("====================================");
        console.log("err::", err);
        console.log("====================================");
      }
    );
  };

  const handleChange = (data: any) => {
    console.log("====================================");
    console.log("data::", data);
    console.log("====================================");
    setSelectedValue(data);
    getListDashboard(
      1,
      textSearch.trim(),
      data === "default" ? null : data
    ).then(
      (res: any) => {
        console.log("====================================");
        console.log("res::", res.data.items);
        console.log("====================================");
        setListData(res.data.items);
        setTotalPage(res.data.totalPage);
        setActivePage(res.data.activePage);
      },
      (err) => {
        setListData([]);
        setTotalPage(0);
        setActivePage(0);
        console.log("====================================");
        console.log("err::", err);
        console.log("====================================");
      }
    );
  };

  return (
    <>
      <div className="">
        <div className="relative">
          <div className="absolute left-2"></div>
          <div className="border flex flex-col justify-center">
            <div className="border text-center">
              <p className="text-2xl p-2 bg-blue-500 text-white font-semibold">
                Đánh giá của người dùng khi sử dụng xong
              </p>
            </div>

            <div className="flex bg-blue-100 justify-between">
              <div className="py-2 flex justify-end bg-blue-100">
                <input
                  type="text"
                  className="outline-none border border-gray-300 h-7 p-1 rounded-full"
                  placeholder="Điền kí tự để tìm kiếm ..."
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <Tooltip title="Button này có chức năng sắp xếp điểm và sắp xếp về lượt sử dụng ">
                  <select
                    className="outline-none border border-gray-300 h-7 p-1 rounded-full"
                    value={selectedValue}
                    onChange={(e) => handleChange(e.target.value)}
                  >
                    <option value="default">Mặc định</option>
                    <option value="SCORE_ASC">Điểm tăng dần</option>
                    <option value="SCORE_DESC">Điểm giảm dần</option>
                    <option value="TOTAL_BOOKED_ASC">
                      Lượt sử dụng tăng dần
                    </option>
                    <option value="TOTAL_BOOKED_DESC">
                      Lượt sử dụng giảm dần
                    </option>
                  </select>
                </Tooltip>
              </div>
              <div className="py-2 flex justify-end bg-blue-100"></div>
            </div>

            <table>
              <thead className="border">
                <tr>
                  <th className="p-5 border">#</th>
                  <th className="p-5 border">Tên phòng (sân)</th>
                  <th className="p-5 border">Phân loại</th>
                  <th className="p-5 border">Điểm đánh giá</th>
                  <th className="p-5 border">Số lượt sử dụng</th>
                </tr>
              </thead>
              <tbody>
                {listData &&
                  listData.map((data, index) => (
                    <tr key={index} className="">
                      <td className="p-5 border text-center">
                        <p>{index + 1}</p>
                      </td>
                      <td className="p-5 border text-center">
                        <p className="cursor-pointer hover:text-gray-400 flex items-center justify-center gap-1">
                          <span>{data?.name}</span>
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
                        <p>{data?.category?.categoryName}</p>
                      </td>
                      <td className="p-5 border text-center">
                        <p>{data?.score.toFixed(2) || 0}</p>
                      </td>
                      <td className="p-5 border text-center">
                        <p>{data?.totalBooked || 0}</p>
                      </td>
                      <td className="border">
                        <div className="flex flex-col gap-2 w-full py-1">
                          <button
                            onClick={() => handleViewComment(data?._id)}
                            className=" bg-blue-400 w-full hover:bg-blue-300 p-2 text-white rounded-full "
                          >
                            Xem chi tiết
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {!(Array.isArray(listData) && listData.length > 0) && (
              <div className="text-center">
                <h1 className="font-bold text-3xl my-10">No data</h1>
              </div>
            )}
            {totalPage > 1 && (
              <div className="flex items-center justify-center my-5">
                <Pagination
                  current={activePage}
                  total={Number(`${totalPage}0`)}
                  onChange={onChangePage}
                  showSizeChanger={false}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
