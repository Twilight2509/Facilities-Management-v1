"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Carousel, CarouselResponsiveOption } from "primereact/carousel";
import { Tag } from "primereact/tag";
import { useRouter } from "next/navigation";
import { ProductService } from "../../services/product/ProductService";
import "primeflex/primeflex.css";

interface Product {
  _id: string;
  code: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
  quantity: number;
  inventoryStatus: string;
  rating: number;
}

export default function CarouselDetailComponent(props: any) {
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();
  const productTemplate = (product: Product) => {
    return (
      <div className="relative text-center h-72  cursor-pointer m-5 z-50">
        <Image
          width={500}
          height={500}
          src={product.image}
          alt={product.name}
          className="w-screen h-full rounded-lg"
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-white px-2 pb-2 rounded-b-lg">
          <p className="font-bold">{product.name}</p>
        </div>
        {product && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-black hover:bg-opacity-80 p-2 rounded-full">
            <button
              onClick={() => router.push("/detail/" + product._id)}
              className="text-white px-3"
            >
              Đặt chỗ
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="px-16">
      <Carousel
        value={props.listData}
        numVisible={4}
        numScroll={4}
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
  );
}
