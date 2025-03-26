"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  InputNumber,
  Modal,
  Pagination,
  PaginationProps,
  Tooltip,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { getAllUser, updateProfile } from "../../../services/user.api";
import { log } from "console";
import { number } from "prop-types";
import { pages } from "next/dist/build/templates/app-page";

export default function ManageAccount() {
  const [userData, setUserData] = useState<any[]>([]);
  const [activePage, setActivePage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState<number>(1);

  const fetchApi = (searchValue: any, page: number) => {
    getAllUser(searchValue, page)
      .then((res) => {
        setUserData(res?.data?.user);
        setActivePage(res?.data?.activePage);
        setTotalPage(res?.data?.totalPage);
      })
      .catch((err) => {});
  };
  useEffect(() => {
    fetchApi(searchValue, page);
  }, []);

  const onChangePage: PaginationProps["onChange"] = (pageNumber) => {
    console.log("Page: ", pageNumber);
    fetchApi(searchValue, pageNumber);
  };

  const handleFilter = (e: any) => {
    const inputValue = e.target.value.toLowerCase();
    fetchApi(inputValue, page);
  };

  const handleChangeStaus = async (userId: any, status: any) => {
    if (confirm("Bạn có muốn thay đổi trạng thái không ?")) {
      await updateProfile(userId, { status });
      alert("Thay đổi thành công");
    }
    fetchApi(searchValue, page);
  };
  const handleChangeRole = async (userId: any, roleId: any) => {
    console.log(roleId);

    if (confirm("Bạn có muốn thay đổi trạng thái không ?")) {
      await updateProfile(userId, { roleId });
      alert("Thay đổi thành công");
    }
    fetchApi(searchValue, page);
  };
  return (
    <>
      <div className="">
        <div>
          <div className="border flex flex-col justify-center">
            <div className="border text-center">
              <p className="text-2xl p-2 bg-orange-500 text-white font-semibold">
                Quản Lý Tài Khoản
              </p>
            </div>
            <div className="flex justify-end bg-blue-100">
              <div className="py-2 flex justify-end bg-blue-100">
                <input
                  type="text"
                  className="outline-none border border-gray-300 h-7 p-1 rounded-l-full"
                  placeholder="Tìm Kiếm theo email..."
                  onChange={handleFilter}
                />
                <button className="bg-orange-500 px-2 h-7 hover:bg-orange-300 cursor-pointer rounded-r-full">
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    className="text-white"
                  />
                </button>
              </div>
            </div>
            <table>
              <thead className="border">
                <tr>
                  <th className="p-5 border">STT</th>
                  <th className="p-5 border">Tên Tài Khoản </th>
                  <th className="p-5 border">Số điện thoại</th>
                  <th className="p-5 border">Email</th>
                  <th className="p-5 border">Địa chỉ</th>
                  <th className="p-5 border">Ngày tạo</th>
                  <th className="p-5 border">Trạng Thái</th>
                  <th className="p-5 border">Chức Vụ</th>
                </tr>
              </thead>
              <tbody>
                {userData?.length > 0 &&
                  userData?.map((u, index) => {
                    return (
                      <tr className="">
                        <td className="p-5 border text-center">
                          <p>{(activePage - 1) * 6 + index + 1}</p>
                        </td>
                        <td className="p-5 border text-center">
                          <p className="cursor-pointer hover:text-gray-400 flex items-center justify-center gap-1">
                            <span>{u?.name}</span>
                          </p>
                        </td>
                        <td className="p-5 border text-center">
                          <p>{u?.phoneNumber}</p>
                        </td>
                        <td className="p-5 border text-center">
                          <p>{u?.email}</p>
                        </td>
                        <td className="p-5 border text-center">
                          <p>{u?.address}</p>
                        </td>
                        <td className="p-5 border text-center">
                          <p>
                            {u?.createdAt
                              ? new Date(u.createdAt).toLocaleDateString(
                                  "vi-VN"
                                )
                              : ""}
                          </p>
                        </td>
                        <td className="p-5 border text-center">
                          {u?.roleId?.roleName === "Student" ? (
                            <select

                              className={`appearance-none bg-transparent border-none ${
                                u?.status === 1
                                  ? "text-green-500"
                                  : u?.status === 3
                                  ? "text-red-600"
                                  : ""
                              }`}
                              value={u?.status} // Xử lý trường hợp u?.status không tồn tại
                              onChange={(e) =>
                                handleChangeStaus(u?._id, e.target.value)
                              }
                            >
                              <option className="text-green-500" value="1">
                                Active

                              </option>
                              <option className="text-red-500" value="3">
                                Inactive
                              </option>
                            </select>
                          ) : (
                            // Nếu là Admin, không hiển thị select
                            <p className="text-green-500">Active</p>
                          )}
                        </td>

                        <td
                          className={`p-5 border text-center ${
                            u?.roleId?.roleName === "Student"
                              ? "text-blue-500"
                              : "text-yellow-500"
                          }`}
                        >
                          <p>{u?.roleId?.roleName}</p>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            {totalPage > 0 && (
              <div className="flex items-center justify-center ">
                <Pagination
                  current={activePage}
                  total={Number(totalPage + "0")}
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
