"use client";
import Image from "next/image";
import LoginComponent from "../../../../components/LoginComponent";
import Link from "next/link";
import Logo from "../../../../public/Logo_facility.png";
import { useState, useEffect } from "react";
import { getCategory } from "../../../../services/category.api";
import { StorageService } from "../../../../services/storage";
import { useRouter } from "next/navigation";
import { Tooltip } from "antd";
import { Carousel, CarouselResponsiveOption } from "primereact/carousel";



interface Category {
  _id: string;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
  image: string;
}


export default function Login() {
  const [cate, setCate] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (StorageService.isLoggedIn() === true) {
      router.push("/");
    }
    getCategory(null, null, 10000000000000)
      .then((response: any) => {
        setCate(response.data.item);
      })
      .catch((error) => console.error("Error fectching Category"));
  }, []);

  const productTemplate = (cate: Category) => {
    return (
      <Link href={"/search?category=" + cate._id}>
        <div className="relative text-center h-96 cursor-pointer m-5 z-50  shadow-xl border rounded-lg">
          <Image
            width={500}
            height={500}
            src={cate.image}
            alt={cate.categoryName}
            className="w-screen h-full rounded-lg"
          />

          <div className="absolute top-72 left-1/2 -translate-x-1/2 bg-white rounded-lg p-3">
            <Tooltip title={cate.categoryName}>
              <h4 className="w-28 mb-1 font-bold text-lg overflow-hidden whitespace-nowrap text-ellipsis">
                {cate.categoryName}
              </h4>
            </Tooltip>
          </div>
        </div>
      </Link>
    );
  };


  return (
    <div className="h-screen">
      <div className=" bg-orange-500 h-full">
        <Image src="/fpt.jpg" alt="fptu" layout="fill" className="opacity-80" />

        <div className="rounded-full overflow-hidden">
          <Link href={"/"}>
            <Image
              src={Logo}
              width={150}
              height={60}
              alt="logo"
              className="mt-2 ml-5 rounded-full cursor-pointer text-red-500"
              style={{ zIndex: 100, position: "absolute", top: 0, left: 0 }}
            />
          </Link>
        </div>

        <div className="w-screen h-screen flex flex-col items-center justify-center">
        <LoginComponent />
        </div>
      </div>
    </div>
  );
}
