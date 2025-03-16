"use client";
import { useEffect } from "react";
import ChatComponent from "../../../../components/ChatComponent";
import NavbarComponent from "../../../../components/NavbarComponent";
import { StorageService } from "../../../../services/storage";
import { useRouter } from "next/navigation";

export default function Chat({ children }: { children: React.ReactNode }) {
  const colorNavbarOne: string = "bg-gray-300";
  const colorNavbarTwo: string = "bg-gray-200";
  const router = useRouter();

  useEffect(() => {
    if (StorageService.getUser() && StorageService.getUser().role.roleName) {
      if (StorageService.getUser().role.roleName !== "Admin") {
        router.push("/not-found");
      }
    }
  });

  return (
    <div className="">
      <div className="mt-20">
      <NavbarComponent
        colorNavbarOne={colorNavbarOne}
        colorNavbarTwo={colorNavbarTwo}
      />
      </div>
     
      <div  >
        <ChatComponent />
      </div>
    </div>
  );
}
