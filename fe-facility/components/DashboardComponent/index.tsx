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
import Analysist from "./Analysist";
import ManageFacilites from "./ManageFacilities";
import ManageBookingRequest from "./ManageBookingRequest";
import ManageAccount from "./ManageAccount";
import RecycleFacilities from "./Recycle";
import CategoryComponent from "../CategoryComponent";
import ManageBookingRequestAccept from "../ManageBookingRequestAccept";
import ManageBookingRequestReject from "../ManageBookingRequestReject";
import ManageBookingRequestExpired from "../ManageBookingRequestExpired";

import { StorageService } from "../../services/storage";
import { getAllBooking } from "../../services/booking.api"; // Import API
import { useRouter } from "next/navigation";

const DashboardComponent: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [key, setKey] = useState<string>("1");
  const [role, setRole] = useState<string>("");
  const [pendingRequests, setPendingRequests] = useState<number>(0); // State đếm số yêu cầu chờ duyệt
  const router = useRouter();

  useLayoutEffect(() => {
    if (StorageService.getUser() && StorageService.getUser().role.roleName) {
      if (StorageService.getUser().role.roleName !== "Admin") {
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
    { key: "1", label: "Thống kê", icon: <LineChartOutlined /> },
    { key: "2", label: "Quản lý phòng, sân bóng", icon: <AppstoreOutlined /> },
    {
      key: "6",
      label: "Quản lý các thể loại dịch vụ",
      icon: <AppstoreOutlined />,
    },
    {
      key: "3",
      label: (
        <Badge
          count={pendingRequests}
          offset={[15, 5]} // Điều chỉnh vị trí của badge
          style={{
            fontSize: "14px", // Tăng kích thước chữ số
            fontWeight: "bold", // Làm đậm số
            padding: "6px", // Tăng kích thước badge
            height: "24px", // Điều chỉnh chiều cao
            minWidth: "24px", // Đảm bảo badge đủ rộng
            lineHeight: "14px", // Căn chỉnh số bên trong badge
          }}
          showZero
        >
          Duyệt yêu cầu đặt sân, phòng
        </Badge>
      ),
      icon: <CarryOutOutlined />,
    },
    { key: "7", label: "Các yêu cầu được duyệt", icon: <AppstoreOutlined /> },
    { key: "8", label: "Các yêu cầu không được duyệt", icon: <AppstoreOutlined /> },
    { key: "9", label: "Các yêu cầu quá hạn", icon: <AppstoreOutlined /> },
    { key: "4", label: "Quản lý tài khoản", icon: <UserOutlined /> },
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
        {key === "1" && <Analysist />}
        {key === "2" && <ManageFacilites />}
        {key === "3" && <ManageBookingRequest />}
        {key === "7" && <ManageBookingRequestAccept />}
        {key === "8" && <ManageBookingRequestReject />}
        {key === "9" && <ManageBookingRequestExpired />}
        {key === "4" && <ManageAccount />}
        {key === "5" && <RecycleFacilities />}
        {key === "6" && <CategoryComponent />}
      </div>
    </div>
  );
};

export default DashboardComponent;
