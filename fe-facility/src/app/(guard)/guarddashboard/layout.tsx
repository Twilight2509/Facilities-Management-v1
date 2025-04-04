'use client'
import type { Metadata } from "next";
import FooterComponent from "../../../../components/FooterComponent";
import NavbarComponent from "../../../../components/NavbarComponent";
import { useEffect } from "react";
import { StorageService } from "../../../../services/storage";
import { useRouter } from "next/navigation";


export default function SearchtLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const colorNavbarOne: string = "bg-gray-300";
  const colorNavbarTwo: string = "bg-gray-300";

  const router = useRouter()

  useEffect(() => {
    if(StorageService.isLoggedIn() === false){
      router.push('/')
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <NavbarComponent
        colorNavbarOne={colorNavbarOne}
        colorNavbarTwo={colorNavbarTwo}

      />
      <div className="mt-20 flex-grow">{children}</div>
      <div className="bg-gray-400">
        <FooterComponent />
      </div>
    </div>
  );
}
