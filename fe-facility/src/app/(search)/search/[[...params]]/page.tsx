"use client";
import { InputText } from "primereact/inputtext";
import { useEffect, useRef, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Empty, Pagination, PaginationProps, Tooltip } from "antd";
import { getCategory } from "../../../../../services/category.api";
import {
  getFacilities,
  searchFacility,
} from "../../../../../services/facilities.api";
import { useRouter, useSearchParams } from "next/navigation";
import { isString } from "antd/es/button";

export default function SearchAll({ params }: { params: object }) {
  console.log("====================================");
  console.log(params);
  console.log("====================================");
  const toastAddCategory = useRef<any>(null);
  const router = useRouter();
  const [text, setText] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [status, setStatus] = useState(null);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [activePage, setActivePage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<0>(0);
  const [facilityData, setFacilityData] = useState<any[]>([]);
  const searchParam = useSearchParams();

  const showErrorCategory = (msg: string) => {
    toastAddCategory.current.show({
      severity: "error",
      summary: "Error",
      detail: msg,
      life: 3000,
    });
  };

  const handleSearch = () => {
    console.log(category);
    console.log(text);
    searchFacility(text.trim(), category)
      .then((res : any) => {
        console.log(res.data.items);
        setFacilityData(res.data.items);
        setActivePage(res.data.activePage);
        setTotalPage(res.data.totalPage);
      })
      .catch((err) => {
        setFacilityData([]);
        setActivePage(1);
        setTotalPage(0);
        showErrorCategory("Error occurred !!!");
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

  const handleCategoryChange = (category: string) => {
    setCategoryFilter(category);
  };

  const onChangePage: PaginationProps["onChange"] = (pageNumber) => {
    if (pageNumber !== activePage) {
      searchFacility(text, category,pageNumber)
        .then((res : any) => {
          setFacilityData(res.data.items);
          setActivePage(res.data.activePage);
          setTotalPage(res.data.totalPage);
        })
        .catch((err) => {
          setFacilityData([]);
          setActivePage(1);
          setTotalPage(0);
          showErrorCategory("Error occurred !!!");
        });
    }
  };

  useEffect(() => {
    const object = Object.fromEntries(searchParam.entries());

    if (object && object.text) {
      setText(object.text);
      searchFacility(object.text.trim())
        .then((res : any) => {
          setFacilityData(res.data.items);
          setActivePage(res.data.activePage);
          setTotalPage(res.data.totalPage);
        })
        .catch((err) => {
          setFacilityData([]);
          setActivePage(1);
          setTotalPage(0);
          showErrorCategory("Error occurred !!!");
        });
    } else if (object && object.category) {
      setCategory(object.category);
      searchFacility(null, object.category)
        .then((res : any) => {
          setFacilityData(res.data.items);
          setActivePage(res.data.activePage);
          setTotalPage(res.data.totalPage);
        })
        .catch((err) => {
          setFacilityData([]);
          setActivePage(1);
          setTotalPage(0);
          showErrorCategory("Error occurred !!!");
        });
    } else {
      searchFacility(text, category)
        .then((res : any) => {
          setFacilityData(res.data.items);
          setActivePage(res.data.activePage);
          setTotalPage(res.data.totalPage);
        })
        .catch((err) => {
          setFacilityData([]);
          setActivePage(1);
          setTotalPage(0);
          showErrorCategory("Error occurred !!!");
        });
    }
  }, []);

  useEffect(() => {
    getCategory(null,null,10000000000)
      .then((res : any) => {
        console.log(res.data.item);
        setCategoryData(res.data.item);

      })
      .catch((err) => {
        setCategoryData([]);
        showErrorCategory("Error occurred !!!");
      });
      console.log(facilityData);
      
  }, []);

  const handleChangePage = (data: any) => {
    router.replace("/detail/" + data._id);
  };

  return (
    <div className="mx-20">
      <div className="text-center">
        <h1 className="font-bold text-4xl">Kết quả tìm kiếm</h1>
      </div>
      <div className="flex items-center justify-center gap-20">
        <div>
          <div className="flex gap-3 mt-10 items-center justify-center flex-wrap">
            <div className="border border-solid border-gray-300 py-2 rounded-lg">
              <i className="pi pi-search p-1" />
              <InputText
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Điền kí tự tìm kiếm ..."
                tooltip="Điền kí tự tìm kiếm"
                tooltipOptions={{ position: "top" }}
                className="shadow-none py-2"
              />
            </div>

            <div className="border border-solid border-gray-300 py-2 rounded-lg">
              <Dropdown
                value={category}
                onChange={(e) => setCategory(e.value)}
                options={[
                  { label: "Select an option", value: "" },
                  ...categoryData.map((item) => ({
                    label: item.categoryName,
                    value: item._id,
                  })),
                ]}
                optionLabel="label"
                placeholder="Phân loại"
                tooltip="Phân loại"
                tooltipOptions={{ position: "top" }}
                className="w-full px-5"
                style={{ boxShadow: "none" }}
              />
            </div>
            <div>
              <button
                className="px-10 py-4 text-white font-semibold rounded-md hover:bg-orange-600 bg-orange-400"
                onClick={handleSearch}
              >
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>
        {/* products */}
        <div className="flex flex-wrap items-center justify-center mt-20 gap-10">
          {facilityData &&
            facilityData.map((f, index) => (
              <div key={index}
                className="basis-1/5  relative mb-5 shadow-xl"
                onClick={() => handleChangePage(f)}
              >
                <div className="flex items-center justify-center">
                  <img src={f?.image} className="w-full h-72 rounded-md" />
                  <Tooltip title={f?.name}>
                    <p className="font-bold text-2xl bg-orange-400 text-white w-1/2 shadow-md rounded-b-md text-ellipsis overflow-hidden text-center absolute top-0 left-1/2 transform -translate-x-1/2">
                      {f?.name}
                    </p>
                  </Tooltip>
                  <button className="absolute bottom-5 bg-green-500 hover:bg-green-300 text-white font-semibold p-1 rounded-md">
                    Đặt phòng
                  </button>
                </div>
              </div>
            ))}
          {facilityData.length === 0 && <Empty />}
        </div>

        {/* pagination */}
        {totalPage > 0 && (
          <div className="flex items-center justify-center my-16">
            <Pagination
              defaultCurrent={activePage}
              total={Number(totalPage + "0")}
              onChange={onChangePage}
              showSizeChanger={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}
