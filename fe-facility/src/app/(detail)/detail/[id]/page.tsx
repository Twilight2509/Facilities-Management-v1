"use client";
import InfomationDetailComponent from "../../../../../components/InformationDetailComponent";
import CommentComponent from "../../../../../components/DetailComponent/CommentComponent";
import CarouselTopComponent from "../../../../../components/CarouselTopComponent";
import FooterComponent from "../../../../../components/FooterComponent";
import CarouselDetailComponent from "../../../../../components/CarouselDetailComponent";
import { Metadata } from "next";
import { Spin } from "antd";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  facilityById,
  searchFacility,
} from "../../../../../services/facilities.api";
import Image from "next/image";
import { Toast } from "primereact/toast";
import { useRouter } from "next/navigation";
import { SlotTime } from "../../../../../data";

export default function DetailPage({ params }: { params: { id: string } }) {
  const [isGettingData, setIsGettingData] = useState(false);
  const [detailData, setDetailData] = useState<any>(null);
  const [listData, setListData] = useState<any[]>([]);
  const toastAddCategory = useRef<any>(null);
  const router = useRouter();

  const showErrorCategory = (msg: string) => {
    toastAddCategory.current.show({
      severity: "error",
      summary: "Error",
      detail: msg,
      life: 3000,
    });
  };

  const showSuccessCategory = (msg: string) => {
    toastAddCategory.current.show({
      severity: "success",
      summary: "Success",
      detail: msg,
      life: 3000,
    });
  };
  useLayoutEffect(() => {
    setIsGettingData(true);
    facilityById(params.id)
      .then((res: any) => {
        setIsGettingData(false);
        console.log("resFacibyId::", res.data.data);
        setDetailData(res.data.data);
      })
      .catch((err) => {
        setIsGettingData(false);
      })
      .finally(() => {
        setIsGettingData(false); // Ensure this runs whether success or error
      });
  }, []);

  useEffect(() => {
    if (detailData && detailData?.category) {
      if (detailData?.category._id) {
        searchFacility(null, detailData?.category._id).then(
          (res: any) => {
            console.log("====================================");
            console.log("resCate::", res.data);
            console.log("====================================");
            setListData(res.data.items);
          },
          (err) => {
            setListData([]);
            console.log("====================================");
            console.log("err::", err.data);
            console.log("====================================");
          }
        );
      }
    }

  }, [detailData]);

  return (
    <>
      <Spin size="large" spinning={isGettingData} fullscreen={isGettingData}>
        <div>
          <div className="relative h-screen">
            <img
              src={detailData?.image}
              className="w-screen h-screen rounded-md object-center"
            />

            <div>
              <div className="absolute right-20 top-1/2 transfrom -translate-y-1/2 z-50 bg-gray-200 p-5 shadow-xl rounded-lg">
                <InfomationDetailComponent
                  detailData={detailData}
                  showSuccessCategory={showSuccessCategory}
                  showErrorCategory={showErrorCategory}
                />
              </div>

              {/* comment */}
              <div className="flex justify-center pt-10">
                <CommentComponent
                  detailData={detailData}
                  showErrorCategory={showErrorCategory}
                  showSuccessCategory={showSuccessCategory}
                />
              </div>
              <div>
                {listData && listData.filter((item) => item._id !== detailData._id).length > 0 && (
                  <div className="text-center font-bold text-4xl">
                    <p>Các đề xuất dành cho bạn</p>
                  </div>
                )}
                <div>
                  {listData && listData.filter((item) => item._id !== detailData._id).length < 4 ? (
                    <div className="flex justify-center">
                      {listData.filter((item) => item._id !== detailData._id).map((data: any) => {
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
                                data?.image
                                  ? data?.image
                                  : "https://picsum.photos/200/300"
                              }
                              alt={data.name}
                              className="w-screen h-full rounded-lg"
                            />
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-white px-2 pb-2 rounded-b-lg">
                              <p className="font-bold">{data.name}</p>
                            </div>
                            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-black hover:bg-opacity-80 p-2 rounded-full">
                              <button className="text-white px-3 w-fit">
                                {data.name}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <CarouselDetailComponent listData={listData} />
                  )}
                </div>
                <div className="bg-gray-400">
                  <FooterComponent />
                </div>
              </div>
            </div>
          </div>
          <Toast ref={toastAddCategory} />
        </div>
      </Spin>
    </>
  );
}
