"use client";
import Image from "next/image";
import LoginComponent from "../../../../components/LoginComponent";
import Link from "next/link";
import Logo from "../../../../public/icons8-logo.svg";
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
          <div className="px-32">
            <Carousel
              value={cate}
              numVisible={3}
              numScroll={3}
              circular
              prevIcon={
                <div className="bg-gray-300 p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="16"
                    width="14"
                    viewBox="0 0 448 512"
                  >
                    <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                  </svg>
                </div>
              }
              nextIcon={
                <div className="bg-gray-300 p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="16"
                    width="14"
                    viewBox="0 0 448 512"
                  >
                    <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
                  </svg>
                </div>
              }
              showIndicators={false}
              autoplayInterval={3000}
              itemTemplate={productTemplate}
            />
          </div>
          <div>
            <LoginComponent />
          </div>
        </div>
      </div>
    </div>
  );
}
