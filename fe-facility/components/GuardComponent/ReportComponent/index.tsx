import {
  faFileCsv,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Pagination, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import jsPDF from "jspdf";

import {
  getAllReports,
  getReportByBookingId,
  createReport,
  updateReport,
  deleteReport,
} from "../../../services/report.api";

export default function ReportComponent() {
  const [reportData, setReportData] = useState<any[]>([]);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [activePage, setActivePage] = useState<number>(1);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [pageSize] = useState<number>(8); // Set 8 reports per page

  useEffect(() => {
    fetchReports();
  }, [activePage]);

  const fetchReports = async () => {
    try {
      setIsSpinning(true);
      const response = await getAllReports();
      console.log("📦 API response:", response);

      const reports = response?.data;

      if (Array.isArray(reports)) {
        setReportData(reports);
        // Calculate total pages based on 8 items per page
        setTotalPage(Math.ceil(reports.length / pageSize));
      } else {
        setReportData([]);
        setTotalPage(0);
      }
    } catch (error) {
      console.error("❌ Error fetching reports:", error);
    } finally {
      setIsSpinning(false);
    }
  };

  // Get current reports for the active page
  const getCurrentPageReports = () => {
    const startIndex = (activePage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return reportData.slice(startIndex, endIndex);
  };

  console.log("📌 Facility ID test:", reportData[0]?.bookingId?.facilityId.name);
  const onChangePage = (page: number) => {
    setActivePage(page);
  };

  function formatDate(dateString: any) {
    if (!dateString || typeof dateString !== "string") return "Invalid date";
    const [date, time] = dateString.split("T");
    return `${time?.slice(0, 8)} ${date}`;
  }

  function formatToDDMMYYYY(dateString: string) {
    if (!dateString) return "N/A";
    const parts = dateString.split("T")[0].split("-");
    if (parts.length !== 3) return "Invalid date";
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  const NOTO_SANS = "AAEAAAASAQAABAAgR0...";

  const handleDownloadPDF = (report: any) => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // ========== NỘI DUNG PDF ==========
      let yPos = 20;
      const lineHeight = 10;

      // Tiêu đề
      doc.setFontSize(18);
      doc.text("BIÊN BẢN VI PHẠM", 105, yPos, { align: "center" });
      yPos += lineHeight * 2;
      // Thông tin chi tiết
      const fields = [
        { label: "Tên phòng (sân)", value: report?.bookingId?.facilityId?.name || "N/A" },
        { label: "Slot", value: report?.bookingId?.slot || "-" },
        { label: "Thời gian tạo", value: formatDate(report?.bookingId?.createdAt) },
        { label: "Người chịu trách nhiệm", value: report?.bookingId?.booker?.name || "-" },
        { label: "Người lập biên bản", value: report?.bookingId?.booker?.name || "-" },
        { label: "Lỗi vi phạm", value: report?.description || "Không rõ" },
      ];
  
      doc.setFontSize(12);
      fields.forEach((field) => {
        doc.text(`${field.label}:`, 20, yPos);
        doc.text(field.value.toString(), 70, yPos);
        yPos += lineHeight;
      });
  
      doc.save(`BaoCao_${report._id}.pdf`);
    } catch (error) {
      console.error("Lỗi khi tạo PDF:", error);
      alert("Có lỗi xảy ra khi tạo file PDF!");
    }
  };

  return (
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
              <th className="p-5 border">Thời gian tạo</th>
              <th className="p-5 border">Ảnh</th>
              <th className="p-5 border">Người chịu trách nghiệm</th>
              <th className="p-5 border">Người lập biên bản</th>
              <th className="p-5 border">Lỗi vi phạm</th>
              <th className="p-5 border">Tải biên bản</th>
            </tr>
          </thead>
          <tbody>
            {getCurrentPageReports()?.map((r, index) => (
              <tr className="border" key={r._id || index}>
                <td className="p-5 border text-center">{(activePage - 1) * pageSize + index + 1}</td>
                <td className="p-5 border text-center">
                  <p className="cursor-pointer hover:text-gray-400 flex items-center justify-center gap-1">
                    <span>{r?.bookingId?.facilityId?.name || "N/A"}</span>
                  </p>
                </td>

                <td className="p-5 border text-center">{r?.bookingId?.slot || "-"}</td>

                <td className="p-5 border text-center">
                  {formatDate(r?.bookingId?.createdAt)}
                </td>
                <td className="p-5 border text-center">
                  <img src={r?.album} className="w-32 h-32 m-auto" />
                </td>
                <td className="p-5 border text-center">
                  {r?.bookingId?.booker?.name || "-"}
                </td>

                <td className="p-5 border text-center">
                  {r?.bookingId?.booker?.name || "-"}
                </td>
                <td className="p-5 border text-center">
                  <span>{r?.description || "Không rõ"}</span>
                </td>
                <td className="border">
                  <div className="flex flex-col items-center gap-2 w-full py-1">
                    <button 
                      className="bg-green-500 hover:bg-green-300 p-2 text-white rounded-full w-24"
                      onClick={() => handleDownloadPDF(r)}
                    >
                      Tải về
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isSpinning ? (
          <ProgressSpinner
            className="w-52 h-52 my-10"
            strokeWidth="3"
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
            {totalPage > 1 && (
              <div className="flex items-center justify-center">
                <Pagination
                  current={activePage}
                  total={reportData.length}
                  pageSize={pageSize}
                  onChange={onChangePage}
                  showSizeChanger={false}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}