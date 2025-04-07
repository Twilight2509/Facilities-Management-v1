import {
    faFileCsv,
    faMagnifyingGlass,
  } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import { Pagination, PaginationProps, Tooltip } from "antd";
  import React, { useEffect, useState } from "react";
  import { ProgressSpinner } from "primereact/progressspinner";
  import { getAllReport } from "../../../services/report.api"
  import { log } from "console";
  
  export default function ReportComponent() {
    const [reportData, setReportData] = useState<any[]>([]);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [activePage, setActivePage] = useState<number>(0);
    const [isSpinning, setIsSpinning] = useState<boolean>(false);
  
   useEffect(() => {
       getAllReport()
         .then((res) => {
           setReportData(res?.data?.booking)
         })
         .catch((err) => {});
     }, [])
 
    
  
  function formatDate(dateString: any) {
    // Kiểm tra nếu dateString không tồn tại hoặc không phải là chuỗi hợp lệ
    if (!dateString || typeof dateString !== 'string') {
        console.error('Invalid date string:', dateString);
        return 'Invalid date';
    }
  
    const dateTimeParts = dateString.split("T");
  
    // Kiểm tra nếu mảng dateTimeParts không có ít nhất 2 phần tử
    if (dateTimeParts.length < 2) {
        console.error('Invalid date-time format:', dateString);
        return 'Invalid format';
    }
  
    const datePart = dateTimeParts[0];
    const timePart = dateTimeParts[1].substring(0, 8); // Lấy chỉ thời gian, bỏ qua phần mili giây và múi giờ
  
    return `${timePart} ${datePart}`;
  }
  function formatToDDMMYYYY(dateString: string) {
    if (!dateString) return 'N/A';
    
    const parts = dateString.split('T')[0].split('-');
    if (parts.length !== 3) return 'Invalid date';
    
    return `${parts[2]}-${parts[1]}-${parts[0]}`; // dd-mm-yyyy
  }
  
    return (
      <div>
        <div>
          <div className="border flex flex-col justify-center">
            <div className="border text-center">
              <p className="text-2xl p-2 bg-orange-500 text-white font-semibold">
                Các yêu cầu được duyệt
              </p>
            </div>
            <div className="py-2 flex justify-between bg-blue-100">
                <div className="py-2 flex justify-end bg-blue-100">
                    
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
                  <th className="p-5 border">#</th>
                  <th className="p-5 border">Tên phòng (sân)</th>
                  <th className="p-5 border">Slot</th>
                  <th className="p-5 border">Thời gian tạo</th>
                  <th className="p-5 border">Người chịu trách nghiệm</th>
                  <th className="p-5 border">Người lập biên bản</th>
           
                  <th className="p-5 border">Lỗi vi phạm</th>
                  <th className="p-5 border">Tải biên bản</th>
                </tr>
              </thead>
              <tbody>
                {reportData?.map((r, index) => {
                  const status = r?.status;
  
                  // if (status === 2) {
                    return (
                      <tr className="border">
                        <td className="p-5 border text-center">
                          <p>{index + 1}</p>
                        </td>
                        <td className="p-5 border text-center">
                          <p className="cursor-pointer hover:text-gray-400 flex items-center justify-center gap-1">
                            <span>{r?.facilityId?.name}</span>
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
                          <p>{r?.slot}</p>
                        </td>
                        <td className="p-5 border text-center">
                          <p></p>
                        </td>
                        <td className="p-5 border text-center">
                          {formatToDDMMYYYY(r?.startDate)}
                        </td>
                        <td className="p-5 border text-center">
                          <p>{r?.handler?.name}</p>
                        </td>
                        
                        <td className="p-5 border text-center">
                          <p className="cursor-pointer hover:text-gray-400 flex items-center justify-center gap-1">
                            <span>{r?.booker?.name}</span>
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
                        <td className="border">
                          <div className="flex flex-col items-center gap-2 w-full py-1">
                            <button
                              className="bg-orange-500 hover:bg-orange-300 p-2 text-white rounded-full w-24"
                            >
                              Đủ
                            </button>
                            <button
                                className="bg-red-600 hover:bg-red-500 p-2 text-white rounded-full w-24"
                            >
                              Thiếu
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                // }
                )}
              </tbody>
            </table>
            {isSpinning === true ? (
              <ProgressSpinner
                className="w-52 h-52 my-10"
                strokeWidth='3'
                fill="var(--surface-ground)"
                animationDuration=".5s"
              />
            ) : (
              <>
                {!Array.isArray(reportData) || reportData.length === 0 ? (
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
      </div>
    );
  }
  