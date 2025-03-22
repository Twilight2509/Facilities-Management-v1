"use client";
import React, { useEffect, useRef, useState } from "react";
import Logo from "../../public/Logo_facility.png";
import Image from "next/image";
import { Badge } from "primereact/badge";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { StorageService } from "../../services/storage";
import { addUser } from "@/redux/slices/storeUserSlice";
import { useDispatch } from "react-redux";
import { Menu } from "primereact/menu";
import {
  getNotification,
  readNotification,
} from "../../services/notification.api";
import { set } from "zod";
import { Flex } from "antd";

interface NavbarComponentProps {
  colorNavbarOne: string;
  colorNavbarTwo: string;
}
const NavbarComponent: React.FC<NavbarComponentProps> = ({
  colorNavbarOne,
  colorNavbarTwo,
}) => {
  const dispatch = useDispatch();
  const [scrolling, setScrolling] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const router = useRouter();
  const user = useSelector((state) => (state as any).userInfo);
  const menuLeft = useRef(null);
  const menuRight = useRef(null);
  const toast = useRef(null);
  const [showNotification, setShowNotification] = useState(false);
  const [data, setData] = useState<any>([]);
  const [role, setRole] = useState<string>("");
  const [read, setRead] = useState<any>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (StorageService.getToken()) {
        if (StorageService.isExpired()) {
          StorageService.signout();
          router.replace("/login");
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (
      StorageService.getUser() === "" ||
      StorageService.isLoggedIn() === false
    ) {
      setIsLogin(false);
    } else if (
      StorageService.getUser() !== "" &&
      StorageService.isLoggedIn() === true
    ) {
      dispatch(addUser(StorageService.getUser()));
      setIsLogin(StorageService.isLoggedIn());
    }

    if (StorageService.getUser() && StorageService.getUser().role.roleName) {
      setRole(StorageService.getUser().role.roleName);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setScrolling(scrollTop > 0);
    };
    window.addEventListener("scroll", handleScroll);
    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  let items = [
    ...(role === "Admin"
      ? [
          {
            label: "Quản lí",
            icon: "pi pi-check",
            command: (event: any) => router.push("/dashboard"),
          },
        ]
      : []),
    {
      label: "Lịch sử đặt phòng",
      icon: "pi pi-calendar",
      command: (event: any) => router.push("/historyBooking"),
    },
    {
      label: "Hồ sơ của tôi",
      icon: "pi pi-cog",
      command: (event: any) => router.push("/profile"),
    },
    {
      label: "Đăng xuất",
      icon: "pi pi-sign-out",
      command: (event: any) => {
        StorageService.signout();
        router.push("/login");
      },
    },
  ];
  const handleNotification = async () => {
    setShowNotification(!showNotification);
    await readNotification();
    await getNotification(1, 1000).then((res) => {
      setRead(res?.data);
    });
  };

  useEffect(() => {
    getNotification(1, 1000)
      .then((res) => {
        console.log(res);
        setData(res?.data?.content);
        setRead(res?.data);
      })
      .catch((err) => {});
  }, []);

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: "0",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "1vh", // Giảm giá trị để logo nằm giữa
          paddingBottom: "1vh", // Giảm giá trị để logo nằm giữa
          transition: "0.5s ease-in-out", // Optional: Add a transition effect
        }}
        className={`${scrolling ? colorNavbarOne : colorNavbarTwo} h-20 w-full`}
      >
        <div
          style={{ marginLeft: "3vw", zIndex: 100, display: "flex", alignItems: "center" }}
          className="logo-container cursor-pointer"
          onClick={() => router.push("/")}
        >
          <Image src={Logo} height={100} style={{
            marginTop: "0px"
          }} alt="logo" />
        </div>
        <div
          style={{
            display: "flex",
            gap: "50px",
            marginRight: "3vw",
            zIndex: 100,
          }}
        >
          {!isLogin && (
            <div>
              <button
                className="bg-white hover:bg-gray-800 p-2 rounded-lg"
                onClick={() => router.push("/login")}
              >
                Đăng nhập
              </button>
            </div>
          )}
          {isLogin && (
            <div className="flex gap-14 items-center justify-center">
              <div className="cursor-pointer flex items-center">
                {role === "Admin" && (
                  <i
                    className="pi pi-comment p-over lay-badge"
                    style={{ fontSize: "1.5rem", marginRight: "3rem" }}
                    onClick={() => {
                      window.location.href = "/chat";
                    }}
                  ></i>
                )}
                <i
                  className="pi pi-bell p-overlay-badge"
                  style={{ fontSize: "1.5rem" }}
                  onClick={handleNotification}
                >
                  <Badge value={read?.totalNotRead}></Badge>
                </i>
              </div>
              {showNotification && (
                <div className="fixed top-16 right-28 bg-white border border-gray-300 p-2 shadow-md w-90px">
                  {/* Nội dung thông báo ở đây */}

                  <button
                    className="text-sm text-gray-700 mt-1 mb-2 ml-auto flex justify-end  fix"
                    onClick={() => setShowNotification(false)}
                  >
                    <i
                      className="pi pi-times-circle"
                      style={{ fontSize: "1.5rem" }}
                    ></i>
                  </button>
                  <div
                    style={{
                      maxHeight: "300px",
                      overflowY: "auto",
                      paddingRight: "0px",
                    }}
                  >
                    {data?.length > 0 &&
                      data.map((item: any, index: any) => (
                        <div
                          key={index}
                          className="p-3 hover:bg-blue-200"
                          onClick={() => router.push(item?.path)}
                        >
                          <h5 className="text-lg font-bold">{item?.name}</h5>
                          <p className="text-sm ">{item?.content}</p>
                          <p className="text-xs text-end">
                            {new Date(item?.createdAt).toLocaleString("vi-VN", {
                              month: "numeric",
                              day: "numeric",
                              hour: "numeric",
                              minute: "numeric",
                            })}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              <div
                className="cursor-pointer h-12 w-12 relative"
                onMouseEnter={(event) =>
                  (menuLeft as any).current.toggle(event)
                }
                onMouseLeave={(event) => (menuLeft as any).current.hide(event)}
                aria-controls="popup_menu_left"
                aria-haspopup
              >
                <img
                  src={`${user.value.avatar}`}
                  className="h-full w-full rounded-full"
                />
                <Menu
                  model={items}
                  popup
                  ref={menuLeft}
                  id="popup_menu_left"
                  className="fix"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default NavbarComponent;
