"use client";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Button, Menu } from "antd";
import {
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
  LeftOutlined,
  RightOutlined,
  LineChartOutlined,
  CarryOutOutlined,
  UserOutlined,
  FileZipOutlined,
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
import { useRouter } from "next/navigation";

const { SubMenu } = Menu;

const items = [
  { key: "1", label: "Thống kê", icon: <LineChartOutlined /> },
  { key: "2", label: "Quản lý phòng , sân bóng", icon: <AppstoreOutlined /> },
  {
    key: "6",
    label: "Quản lý các thể loại dịch vụ",
    icon: <AppstoreOutlined />,
  },
  {
    key: "3",
    label: "Duyệt yêu cầu đặt sân , phòng",
    icon: <CarryOutOutlined />,
  },
  {
    key: "7",
    label: "Các yêu cầu được duyệt",
    icon: <AppstoreOutlined />,
  },
  {
    key: "8",
    label: "Các yêu cầu không được duyệt",
    icon: <AppstoreOutlined />,
  },
  {
    key: "9",
    label: "Các yêu cầu quá hạn",
    icon: <AppstoreOutlined />,
  },
  { key: "4", label: "Quản lý tài khoản", icon: <UserOutlined /> },
];

const DashboardComponent: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [key, setKey] = useState<string>("1");
  const [role, setRole] = useState<string>("");
  const router = useRouter();

  useLayoutEffect(() => {
    if (StorageService.getUser() && StorageService.getUser().role.roleName) {
      if (StorageService.getUser().role.roleName !== "Admin") {
        router.push("/not-found");
      }
    }
    if (StorageService.getUser() && StorageService.getUser().role.roleName) {
      setRole(StorageService.getUser().role.roleName);
    }
  }, []);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleItemClick = (key: string) => {
    console.log("Clicked on menu item with key:", key);
    setKey(key);
  };

  return (
    <div className="flex">
      <div className="flex flex-col border-r-2 border-b-2 w-fit min-h-screen bg-gray-100">
        <Button
          onClick={toggleCollapsed}
          className={` bg-blue-300 text-white font-bold z-50 flex items-center justify-end `}
        >
          {collapsed === false ? <LeftOutlined /> : <RightOutlined />}
        </Button>
        <Menu
          style={{ width: collapsed ? 50 : 256 }}
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
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
