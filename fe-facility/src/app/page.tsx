"use client";
import React, { useEffect, useRef, useState } from "react";
import CarouselComponent from "../../components/CarouselComponent";
import NavbarComponent from "../../components/NavbarComponent";
import FooterComponent from "../../components/FooterComponent";
import Image from "next/image";
import { Tooltip } from "primereact/tooltip";
import { InputText } from "primereact/inputtext";
import CarouselTopComponent from "../../components/CarouselTopComponent";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getFacilities,
  getFacilityDetail,
} from "../../services/facilities.api";
import { getCategory } from "../../services/category.api";
import { Socket } from "socket.io-client";
import io from "socket.io-client";
import { changeConfirmLocale } from "antd/es/modal/locale";
import { chat, getListUserMessage } from "../../services/chat.api";
import { getListDashboard, getTopNumber } from "../../services/dashboard.api";
import { StorageService } from "../../services/storage";
interface Message {
  text: string;
  sender: "left" | "right";
}

interface User {
  email: string;
  _id: string;
}
const host = "http://localhost:5152";

export default function Home() {
  const router = useRouter();
  const colorNavbarOne: string = "bg-gray-200";
  const colorNavbarTwo: string = "bg-transparent";
  const [faci, setFaci] = useState([]);
  const [cate, setCate] = useState([]);
  const [text, setText] = useState<string>("");
  const [role, setRole] = useState<string>("");

  // Bắt đầu chat to admin - TrungNQ
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const [showChat, setShowChat] = useState(false);
  const [socket, setSocket] = useState<Socket>();
  const [user, setUser] = useState<User>();
  const [loginChat, setLoginChat] = useState(false);
  const [topData, setTopData] = useState<any[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Scroll xuống dưới cùng sau khi tin nhắn được cập nhật
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (StorageService.getUser() && StorageService.getUser().role.roleName) {
      setRole(StorageService.getUser().role.roleName);
    }

    getTopNumber().then(
      (res: any) => {
        console.log("====================================");
        console.log("res::", res);
        console.log("====================================");
        if (res && res.data && res.data.items) {
          setTopData(res.data.items);
        }
      },
      (err) => {
        console.log("====================================");
        console.log("err::", err);
        console.log("====================================");
      }
    );

    getCategory()
      .then((response: any) => {
        setCate(response.data.item);
      })
      .catch((error) => console.error("Error fectching Category"));

    getFacilities()
      .then((response: any) => {
        setFaci(response.data.items);
      })
      .catch((error) => console.error("Error fetching Facilities"));

    getListUserMessage()
      .then((response: any) => {
        const data = response.data;
        if (data.statusCode === 1) {
          console.log(data.data, "hi");

          const newMessages = data.data.map((message: any) => ({
            text: message.content,
            sender: message.type === "user" ? "right" : "left",
          }));
          setMessages(newMessages);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    const newSocket = io(host);
    setSocket(newSocket);

    socket?.on("connect", () => {
      console.log("Connected to the server");
    });
    const storedData = localStorage.getItem("user");
    if (storedData) {
      try {
        const user = JSON.parse(storedData);
        newSocket.emit("storeUserId", user._id);
        setUser(user);
        setShowChat(true);
      } catch (error) {
        console.error(error);
      }
    }
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("privateMessage", (data) => {
        if (data) {
          const newMessage: Message = {
            text: data.message,
            sender: "left",
          };
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      });
    }
  }, [socket]);

  const handleSendMessage = () => {
    if (inputText.trim() === "") return;

    setMessages([
      ...messages,
      {
        text: inputText.trim(),
        sender: "right",
      },
    ]);
    setInputText("");
    if (user) {
      chat({ userId: user?._id, type: "user", content: inputText })
        .then((response) => {
          socket?.emit("privateMessage", {
            sender: user?._id,
            message: inputText,
          });
        })
        .catch((error) => {
          console.error("Error when chat: ", error);
        });
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };
  // Kết thúc chat to admin

  if (!faci || !cate) {
    return <div>loading...</div>;
  }

  const handleSearch = () => {
    router.push("/search?text=" + text);
  };

  return (
    <div>
      <NavbarComponent
        colorNavbarOne={colorNavbarOne}
        colorNavbarTwo={colorNavbarTwo}
      />

      {/* search bar */}
      <div className="relative">
        <img
          src="/bannerfpt.webp"
          alt="loading..."
          className="w-full filter brightness-100 h-screen object-cover"
        />
        <div className="md:absolute md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 flex items-center justify-center">
          <InputText
            className="outline-none p-3 shadow-none w-96 md:rounded-l-lg"
            placeholder="Điền tên thông tin bạn muốn tìm kiếm..."
            onChange={(e) => setText(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-300 p-3 md:rounded-r-lg"
          >
            <span className="pi pi-search text-white h-full"></span>
          </button>
        </div>
      </div>

      <div>
        <div className="text-center mt-12 font-bold text-2xl">
          <h1>Phân loại dịch vụ đặt trước</h1>
        </div>
        <CarouselComponent data={cate} />
      </div>

      <div className="mt-10 text-center">
        <h1 className="ml-7 font-bold text-lg">
          Top 8 phòng , sân thể dục được sử dụng nhiều
        </h1>
        {topData.filter((data: any) => data.totalBooked > 0).length > 4 ? (
          <CarouselTopComponent data={topData} />
        ) : (
          <div className="flex justify-center">
            {topData
              .filter((data: any) => data.totalBooked > 0)
              .map((data: any) => {
                return (
                  <div
                    className={`relative basis-1/3 text-center h-72  cursor-pointer m-5 z-50 shadow-xl border rounded-lg ${data.length === 1 ? "w-5 flex justify-center" : ""
                      }`}
                    onClick={() => router.push("/detail/" + data._id)}
                  >
                    <Image
                      width={500}
                      height={500}
                      src={
                        data.image
                          ? data.image
                          : "https://picsum.photos/200/300"
                      }
                      alt={data.name}
                      className="w-screen h-full rounded-lg"
                    />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-white px-2 pb-2 rounded-b-lg">
                      <p className="font-bold">{data.name}</p>
                    </div>
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-orange-400 hover:bg-orange-600 p-2 rounded-full">
                      <button className="text-white px-3 w-fit">
                        {data?.totalBooked} lần sử dụng
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
      {role === "Student" && (
        <i
          className="pi pi-inbox font-bold text-white bg-orange-400 p-3 rounded-full back text-3xl cursor-pointer fixed top-3/4 right-10 z-50   "
          onClick={() => setLoginChat(!loginChat)}
        ></i>
      )}

      {loginChat && (
        <div
          className="fixed bottom-5 right-28 bg-white p-4 border border-gray-300 overflow-y-auto z-50"
          style={{ maxHeight: "400px" }}
        >
          {role === "Student" && (
            <>
              <h2 className="text-lg font-semibold mb-2">Chat Box</h2>
              <div className="flex flex-col space-y-2">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`text-sm p-2 rounded-lg ${message.sender === "right"
                        ? "bg-blue-100 self-end"
                        : "bg-gray-100 self-start"
                      }`}
                  >
                    {message.text}
                  </div>
                ))}
                <div ref={messagesEndRef}></div>
              </div>

              <div className="flex space-x-2 mt-4">
                {showChat ? (
                  <>
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="flex-grow p-2 border border-gray-300 rounded-lg"
                      placeholder="Type your message..."
                    />
                    <button
                      onClick={handleSendMessage}
                      className="px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      <i
                        className="pi pi-send"
                        style={{ fontSize: "1rem" }}
                      ></i>
                    </button>
                  </>
                ) : (
                  <span>Đăng nhập để chat</span>
                )}
              </div>
            </>
          )}
        </div>
      )}

      <FooterComponent />
    </div>
  );
}
