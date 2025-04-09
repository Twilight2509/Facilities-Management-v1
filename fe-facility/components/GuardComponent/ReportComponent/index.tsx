import {
  faFileCsv,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Pagination } from "antd";
import React, { useEffect, useState } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle } from "docx"; // Thêm BorderStyle
import { saveAs } from "file-saver";
import { getAllReports } from "../../../services/report.api";

export default function ReportComponent() {
  const [reportData, setReportData] = useState<any[]>([]);
  const [bookerNames, setBookerNames] = useState<{ [key: string]: string }>({});
  const [totalPage, setTotalPage] = useState<number>(1);
  const [activePage, setActivePage] = useState<number>(1);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [pageSize] = useState<number>(8);

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
        setTotalPage(Math.ceil(reports.length / pageSize));

        const names: { [key: string]: string } = {};
        await Promise.all(
          reports.map(async (report) => {
            const bookerName = await fetchBookerName(report?.bookingId);
            console.log(`Storing name for report ${report._id}: ${bookerName}`);
            names[report._id] = bookerName;
          })
        );
        setBookerNames(names);
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

  const fetchBookerName = async (bookingId: any) => {
    try {
      const id = bookingId?._id || bookingId;
      console.log("Fetching booker for bookingId:", id);
      const response = await fetch(`http://localhost:5152/booking/${id}`);
      if (!response.ok) throw new Error("Failed to fetch booking data");
      const bookingData = await response.json();
      const name = bookingData?.data?.booker?.name || "-";
      console.log("Booker name fetched:", name);
      return name;
    } catch (error) {
      console.error("❌ Error fetching booker name:", error);
      return "-";
    }
  };

  const getCurrentPageReports = () => {
    const startIndex = (activePage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return reportData.slice(startIndex, endIndex);
  };

  const onChangePage = (page: number) => {
    setActivePage(page);
  };

  function formatDate(dateString: any) {
    if (!dateString || typeof dateString !== "string") return "Invalid date";
    const [date, time] = dateString.split("T");
    return `${time?.slice(0, 8)} ${date}`;
  }

  function formatDateForDoc(dateString: any) {
    if (!dateString) return "ngày __ tháng __ năm ____";
    const date = new Date(dateString);
    return `ngày ${date.getDate()} tháng ${date.getMonth() + 1} năm ${date.getFullYear()}`;
  }

  const handleDownloadWord = async (report: any) => {
    try {
      const bookerName = bookerNames[report._id] || (await fetchBookerName(report?.bookingId?._id || report?.bookingId));
      console.log("Booker name for Word doc:", bookerName);

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM",
                    bold: true,
                    size: 24,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Độc lập - Tự do - Hạnh phúc",
                    bold: true,
                    size: 24,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "-------------",
                    size: 24,
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "BIÊN BẢN",
                    bold: true,
                    size: 28,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Vụ việc xử lí sinh viên gây hỏng hóc, thất thoát cơ sở vật chất",
                    size: 24,
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 400 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Hôm nay, lúc ${report?.bookingId?.slot || "__ giờ __ phút"}, ${formatDateForDoc(report?.bookingId?.createdAt)}`,
                    size: 24,
                  }),
                ],
                spacing: { after: 200 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Địa điểm: ${report?.bookingId?.facilityId?.name || "N/A"}`,
                    size: 24,
                  }),
                ],
                spacing: { after: 200 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Slot: ${report?.bookingId?.slot || "-"}`,
                    size: 24,
                  }),
                ],
                spacing: { after: 200 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Sinh viên chịu trách nhiệm: ${bookerName}`,
                    size: 24,
                  }),
                ],
                spacing: { after: 200 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Bảo vệ lập biên bản: Vương Sỹ Duy",
                    size: 24,
                  }),
                ],
                spacing: { after: 200 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Lỗi vi phạm: ${report?.description || "Không rõ"}`,
                    size: 24,
                  }),
                ],
                spacing: { after: 400 },
              }),
              new Table({
                width: {
                  size: 100,
                  type: WidthType.PERCENTAGE,
                },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({
                        width: {
                          size: 33,
                          type: WidthType.PERCENTAGE,
                        },
                        borders: {
                          top: { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" },
                          bottom: { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" },
                          left: { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" },
                          right: { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" },
                        },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                              new TextRun({
                                text: "Sinh viên vi phạm",
                                bold: true,
                                size: 24,
                              }),
                            ],
                          }),
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                              new TextRun({
                                text: "(Ký và ghi rõ họ tên)",
                                size: 20,
                              }),
                            ],
                            spacing: { before: 200 },
                          }),
                        ],
                      }),
                      new TableCell({
                        width: {
                          size: 33,
                          type: WidthType.PERCENTAGE,
                        },
                        borders: {
                          top: { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" },
                          bottom: { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" },
                          left: { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" },
                          right: { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" },
                        },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                              new TextRun({
                                text: "Quản lý",
                                bold: true,
                                size: 24,
                              }),
                            ],
                          }),
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                              new TextRun({
                                text: "(Ký và ghi rõ họ tên)",
                                size: 20,
                              }),
                            ],
                            spacing: { before: 200 },
                          }),
                        ],
                      }),
                      new TableCell({
                        width: {
                          size: 33,
                          type: WidthType.PERCENTAGE,
                        },
                        borders: {
                          top: { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" },
                          bottom: { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" },
                          left: { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" },
                          right: { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" },
                        },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                              new TextRun({
                                text: "Bảo vệ",
                                bold: true,
                                size: 24,
                              }),
                            ],
                          }),
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                              new TextRun({
                                text: "(Ký và ghi rõ họ tên)",
                                size: 20,
                              }),
                            ],
                            spacing: { before: 200 },
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          },
        ],
      });

      Packer.toBlob(doc).then((blob) => {
        saveAs(blob, `BienBan_${report._id}.docx`);
      });
    } catch (error) {
      console.error("Lỗi khi tạo file Word:", error);
      alert("Có lỗi xảy ra khi tạo file Word!");
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
              <th className="p-5 border">STT</th>
              <th className="p-5 border">Tên phòng (sân)</th>
              <th className="p-5 border">Slot</th>
              <th className="p-5 border">Thời gian tạo</th>
              <th className="p-5 border">Ảnh</th>
              <th className="p-5 border">Sinh viên vi phạm</th>
              <th className="p-5 border">Lỗi vi phạm</th>
              <th className="p-5 border">Tải biên bản</th>
            </tr>
          </thead>
          <tbody>
            {getCurrentPageReports()?.map((r, index) => (
              <tr className="border" key={r._id || index}>
                <td className="p-5 border text-center">
                  {(activePage - 1) * pageSize + index + 1}
                </td>
                <td className="p-5 border text-center">
                  <p className="cursor-pointer hover:text-gray-400 flex items-center justify-center gap-1">
                    <span>{r?.bookingId?.facilityId?.name || "N/A"}</span>
                  </p>
                </td>
                <td className="p-5 border text-center">{r?.bookingId?.slot || "-"}</td>
                <td className="p-5 border text-center">{formatDate(r?.bookingId?.createdAt)}</td>
                <td className="p-5 border text-center">
                  {Array.isArray(r.album) ? (
                    <div className="flex flex-wrap gap-2 justify-center">
                      {r.album.map((img: string, idx: number) => (
                        <img key={idx} src={img} className="w-20 h-20 object-cover rounded" />
                      ))}
                    </div>
                  ) : (
                    <img src={r.album} className="w-32 h-32 object-cover m-auto rounded" />
                  )}
                </td>
                <td className="p-5 border text-center">{bookerNames[r._id] || "Đang tải..."}</td>
                <td className="p-5 border text-center">
                  <span>{r?.description || "Không rõ"}</span>
                </td>
                <td className="border">
                  <div className="flex flex-col items-center gap-2 w-full py-1">
                    <button
                      className="bg-green-500 hover:bg-green-300 p-2 text-white rounded-full w-24"
                      onClick={() => handleDownloadWord(r)}
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