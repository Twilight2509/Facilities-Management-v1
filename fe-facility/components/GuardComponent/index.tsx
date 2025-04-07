"use client";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Button, Menu, Badge } from "antd";
import {
  AppstoreOutlined,
  CarryOutOutlined,
  LeftOutlined,
  RightOutlined,
  LineChartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import ManageBookingRequestAccept from "../ManageBookingRequestAccept";
import ReportComponent from "./ReportComponent";
import ListRoom from "./ListRoom";

import { StorageService } from "../../services/storage";
import { getAllBooking } from "../../services/booking.api"; // Import API
import { useRouter } from "next/navigation";

const GuardComponent: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [key, setKey] = useState<string>("1");
  const [role, setRole] = useState<string>("");
  const [pendingRequests, setPendingRequests] = useState<number>(0); // State đếm số yêu cầu chờ duyệt
  const router = useRouter();

  useLayoutEffect(() => {
    if (StorageService.getUser() && StorageService.getUser().role.roleName) {
      if (StorageService.getUser().role.roleName !== "Guard") {
        router.push("/not-found");
      }
      setRole(StorageService.getUser().role.roleName);
    }
  }, []);

  // Fetch số lượng booking có status = 1 (chờ duyệt)
  useEffect(() => {
    async function fetchPendingRequests() {
      try {
        const response = await getAllBooking(1); // Gọi API với status = 1

        if (response && response.data) {
          console.log("Dữ liệu từ API:", response.data); // Kiểm tra dữ liệu trả về

          // Đảm bảo lấy đúng số lượng yêu cầu chờ duyệt từ mảng booking
          const pendingCount = response.data.booking ? response.data.booking.length : 0;
          setPendingRequests(pendingCount);
        } else {
          console.warn("Không có dữ liệu hoặc response.data không tồn tại");
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách booking:", error);
      }
    }
    fetchPendingRequests();
  }, []);
  console.log("Số lượng yêu cầu chờ duyệt:", pendingRequests);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleItemClick = (key: string) => {
    setKey(key);
  };

  const items = [
    { key: "1", label: "Danh sánh cơ sở vật chất", icon: <AppstoreOutlined /> },
    { key: "2", label: "Các yêu cầu được duyệt", icon: <AppstoreOutlined /> },
    { key: "3", label: "Biên bản", icon: <AppstoreOutlined /> },
  ];

  return (
    <div className="flex">
      <div className="flex flex-col border-r-2 border-b-2 w-fit min-h-screen bg-gray-100">
        <Button
          onClick={toggleCollapsed}
          className="bg-blue-300 text-white font-bold z-50 flex items-center justify-end"
        >
          {collapsed ? <RightOutlined /> : <LeftOutlined />}
        </Button>
        <Menu
          key={pendingRequests} // Force render khi pendingRequests thay đổi
          style={{ width: collapsed ? 80 : 300 }} // Tăng chiều rộng menu khi mở
          defaultSelectedKeys={["1"]}
          mode="inline"
          className="border-none bg-gray-100"
          items={items}
          inlineCollapsed={collapsed}
          onClick={({ key }) => handleItemClick(key)}
        />
      </div>
      <div className="flex-grow">
        {key === "1" && <ListRoom />}  
        {key === "2" && <ManageBookingRequestAccept />}  
        {key === "3" && <ReportComponent />}       
      </div>
    </div>
  );
};

export default GuardComponent;
