// components/Chat.js
"use client";
import React, { useEffect, useState,useRef } from "react";
import { Socket } from "socket.io-client";
import io from "socket.io-client";
import {
  chat,
  getListAdminMessage,
  getListUser,
} from "../../services/chat.api";

interface Message {
  text: string;
  sender: "left" | "right";
}

interface User {
  email: string;
  _id: string;
}
// const host = "http://192.168.43.189:5152";
const host = "http://localhost:5152";

const ChatComponent = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket>();
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User>();
  const messagesEndRef = useRef<HTMLDivElement>(null);


  const sendMessage = () => {
    if (newMessage.trim() === "") return;
    setMessages([...messages, { text: newMessage, sender: "right" }]);
    setNewMessage("");
    chat({ userId: selectedUser, type: "admin", content: newMessage })
      .then((response) => {
        socket?.emit("privateMessage", {
          receiver: selectedUser,
          message: newMessage,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUserSelect = async (user: string) => {
    const existedUser = users.find((cUser) => cUser._id === user);
    if (existedUser === undefined) {
      const response : any = await getListUser();
      const data = response.data;
      if (data.statusCode === 1) {
        const listUser = data.data;
        setUsers(listUser);
      }
    }
    setMessages([]);
    setSelectedUser(user);
    try {
      const response : any = await getListAdminMessage(user);
      const data = response.data;

      if (data.statusCode === 1) {
        const newMessages = data.data.map((message: any) => ({
          text: message.content,
          sender: message.type === "user" ? "left" : "right",
        }));
        setMessages(newMessages);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const newSocket = io(host);
    setSocket(newSocket);
    getListUser()
      .then((response : any) => {
        const data = response.data;
        if (data.statusCode === 1) {
          const listUser = data.data;
          setUsers(listUser);
          setSelectedUser(users[0]._id);
        }
      })
      .catch((error) => {
        console.error(error);
      });
    socket?.on("connect", () => {
      console.log("Connected to the server");
    });
    const storedData = localStorage.getItem("user");
    if (storedData) {
      try {
        const user = JSON.parse(storedData);
        newSocket.emit("storeAdminId", user._id);
        setUser(user);
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
          setMessages((prevMessage) => [...prevMessage, newMessage]);
          handleUserSelect(data.sender);
        }
      });
    }
  }, [socket]);

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  useEffect(() => {
    // Scroll xuống dưới cùng sau khi tin nhắn được cập nhật
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex " style={{ height: `calc(100vh - 80px)` }}>
      <div className="w-1/4 bg-white p-1    border ">
        <h1 className="text-2xl font-bold  mb-4">Đoạn chat</h1>
        <div>
          {users.map((user, index) => (
            <div
              key={index}
              className={`cursor-pointer p-8   mb-2 ${
                selectedUser === user._id ? "font-bold bg-blue-100" : ""
              }`}
              onClick={() => handleUserSelect(user._id)}
            >
              {user.email}
            </div>
          ))}
        </div>
      </div>
      <div className="flex-grow bg-gray-100">
  {/* Chat interface */}
  <div className="h-screen flex flex-col justify-end bg-gray-50" style={{ height: `calc(100vh - 80px)` }}>
    <div className="overflow-y-auto px-4 pt-4 ">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex justify-${
            message.sender === "right" ? "end" : "start"
          } mb-4`}
        >
          <div
            className={`bg-${
              message.sender === "right" ? "blue" : "gray"
            }-500 text-white rounded-lg py-2 px-4`}
          >
            {message.text}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef}></div>
    </div>
    <div className="flex items-center bg-white border-t border-gray-200 p-4">
      <input
        type="text"
        className="flex-grow border rounded-lg py-2 px-4 mr-2"
        placeholder="Type your message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded-lg"
        onClick={sendMessage}
      >
        <i className="pi pi-send" style={{ fontSize: "1rem" }}></i>
      </button>
    </div>
  </div>
</div>

    </div>
  );
};

export default ChatComponent;
