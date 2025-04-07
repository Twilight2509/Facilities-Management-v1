"use client";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";

import { Editor, EditorTextChangeEvent } from "primereact/editor";

import {
  FileUpload,
  FileUploadProps,
  FileUploadSelectEvent,
} from "primereact/fileupload";
import { classNames } from "primereact/utils";
import { icon } from "@fortawesome/fontawesome-svg-core";
import {
  Button,
  Modal,
  Pagination,
  PaginationProps,
  Spin,
  Tooltip,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileCsv,
  faMagnifyingGlass,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, set, useForm } from "react-hook-form";
import {
  addFacility,
  deleteFacility,
  getFacilities, hardDeleteFacility,
  updateFacility,
  updateStatusFaci,
} from "../../../services/facilities.api";
import { getCategory, viewUpdate } from "../../../services/category.api";
import { Toast } from "primereact/toast";
import { StorageService } from "../../../services/storage";

interface City {
  name: string;
  code: string;
}

const MAX_FILE_SIZE = 2000000;

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const addFacilitySchema = z.object({
  name: z
    .string()
    .trim()
    .max(100, "Maximum character is 100 characters !!!")
    .refine((categoryName) => categoryName.trim().length > 0, {
      message: "Name is required.",
    }),
  shortName: z
    .string()
    .trim()
    .max(50, "Maximum character is 50 characters !!!")
    .refine((categoryName) => categoryName.trim().length > 0, {
      message: "Short name is required.",
    }),
  category: z
    .string()
    .trim()
    .max(100, "Maximum character is 100 characters !!!")
    .refine((categoryName) => categoryName.trim().length > 0, {
      message: "Category is required.",
    }),
  address: z
    .string()
    .trim()
    .max(300, "Maximum character is 300 characters !!!")
    .refine((categoryName) => categoryName.trim().length > 0, {
      message: "Address is required.",
    }),
});

const updateFacilitySchema = z.object({
  name: z
    .string()
    .trim()
    .max(100, "Maximum character is 100 characters !!!")
    .refine((categoryName) => categoryName.trim().length > 0, {
      message: "Name is required.",
    }),
  category: z
    .string()
    .trim()
    .max(100, "Maximum character is 100 characters !!!")
    .refine((categoryName) => categoryName.trim().length > 0, {
      message: "Category is required.",
    }),
  address: z
    .string()
    .trim()
    .max(300, "Maximum character is 300 characters !!!")
    .refine((categoryName) => categoryName.trim().length > 0, {
      message: "Address is required.",
    }),
});

type addFacilitySchemaType = z.infer<typeof addFacilitySchema>;
type updateFacilitySchemaType = z.infer<typeof updateFacilitySchema>;

export default function ListRoom() {
  const [open, setOpen] = useState(false);
  const refAdd = useRef<FileUpload | null>(null);
  const refUpdate = useRef<FileUpload | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [textValue, setTextValue] = useState<string>("");
  const [img, setImg] = useState<File | null>(null);
  const [imgUpdate, setImgUpdate] = useState<File | null>(null);
  const [location, setLocation] = useState<string>("");
  const [shortTitle, setShortTitle] = useState<string>("");
  const [description, setDescription] = useState<string | null>("");
  const [descriptionUpdate, setDescriptionUpdate] = useState<string | null>("");
  const [listCategory, setListCategory] = useState<any>();
  const [listFacility, setListFacility] = useState<any[]>([]);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [isLoadingAddFormCategory, setIsLoadingAddFormCategory] =
    useState(false);
  const [isLoadingUpdateFormCategory, setisLoadingUpdateFormCategory] =
    useState(false);
  const [dataUpdaate, setDataUpdaate] = useState<any>();
  const [activePage, setActivePage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [text, setText] = useState<string>("");

  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibles, setModalVisibles] = useState(false);
  const [viewData, setViewData] = useState<any>([null]);

  const [idFaci, setIdFaci] = useState<string | null>(null);

  const [isModalOpenChangeInactive, setIsModalOpenChangeInactive] =
    useState(false);

    const [file, setFile] = useState<File | null>(null);

  const showModalInactive = () => {
    setIsModalOpenChangeInactive(true);
  };

  const handleOkInactive = () => {
    if (typeof idFaci === "string") {
      updateStatusFaci(idFaci)
        .then(() => {
          showSuccessCategory("Change status successfully !!!");
          getFacilities(activePage, null, "").then(
            (res: any) => {
              setListFacility(res.data.items);
              // setActivePage(1);
              setTotalPage(res.data.totalPage);
              // setIsSpinning(false);
            },
            (err) => {
              setActivePage(1);
              setTotalPage(0);
              console.log(err);
              // setIsSpinning(false);
            }
          );
        })
        .catch((err) => {
          // setIsSpinning(false);
          showErrorCategory("Change status failed !!!");
        });
    } else {
      showErrorCategory("Change status failed !!!");
    }

    setIsModalOpenChangeInactive(false);
  };

  const handleCancelInactive = () => {
    setIsModalOpenChangeInactive(false);
  };

  const showModalView = (id: any) => {
    viewUpdate(id, "Facility", 1, 1000)
      .then((res) => {
        setViewData(res?.data?.items);
      })
      .catch((err) => {
        // Xử lý lỗi nếu cần
      });
    console.log("--------------------");

    console.log(viewData);

    setModalVisible(true);
  };
  const handleOkV = () => {
    setModalVisible(false);
  };
  const showModalViews = (id: any) => {
    viewUpdate(id, "Facility", 1, 1000)
      .then((res) => {
        setViewData(res?.data?.items);
      })
      .catch((err) => {
        // Xử lý lỗi nếu cần
      });
    console.log("--------------------");

    console.log(viewData);

    setModalVisibles(true);
  };
  const handleCancelV = () => {
    setModalVisible(false);
  };
  const handleOkS = () => {
    setModalVisibles(false);
  };

  const handleCancelS = () => {
    setModalVisibles(false);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<addFacilitySchemaType>({
    resolver: zodResolver(addFacilitySchema),
  });

  const {
    register: registerUpdate,
    handleSubmit: handleSubmitUpdate,
    formState: { errors: errorsUpdate },
    reset: resetUpdate,
  } = useForm<updateFacilitySchemaType>({
    resolver: zodResolver(updateFacilitySchema),
  });

  const toastAddCategory = useRef<any>(null);

  const handleDelete = (id: string) => {
    deleteFacility(id).then(
      () => {
        showSuccessCategory("Delete facility successfully !!!");
        getFacilities(1, null, "").then(
          (res: any) => {
            setListFacility(res.data.items);
            setActivePage(1);
            setTotalPage(res.data.totalPage);
          },
          (err) => {
            setActivePage(1);
            setTotalPage(0);
            console.log(err);
          }
        );
      },
      (err) => {
        showErrorCategory("Delete facility failed !!!");
      }
    );
  };

  const handleSearch = (text: any) => {
    setText(text.trim());
    getFacilities(1, text.trim(), "").then(
      (res: any) => {
        setListFacility(res.data.items || []);
        setActivePage(1);
        setTotalPage(res.data.totalPage);
      },
      (err) => {
        setActivePage(1);
        setTotalPage(0);
        console.log(err);
      }
    );
  };

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

  const handleSelectedFile = (e: FileUploadSelectEvent) => {
    setImg(e.files[0]);
  };

  const onChangePage: PaginationProps["onChange"] = (pageNumber: number) => {
    setActivePage(pageNumber);
    console.log("Page: ", pageNumber);
    getFacilities(pageNumber, text, "").then(
      (res: any) => {
        setListFacility(res.data.items);
        setTotalPage(res.data.totalPage);
      },
      (err) => {
        setActivePage(1);
        setTotalPage(0);
        console.log(err);
      }
    );
  };

  const handleCancelUpdate = () => {
    setImgUpdate(null);
    refUpdate.current?.setFiles([]);
    setDescriptionUpdate("");
    resetUpdate();
    setOpenUpdate(false);
  };

  //form
  const handleOk = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setDescription("");
    setImg(null);
    reset();
    refAdd.current?.setFiles([]);
    setOpen(false);
  };
  const showModal = () => {
    setOpen(true);
  };

  const showModalUpdate = (data: any) => {
    console.log(data);
    setDataUpdaate(data);
    setOpenUpdate(true);
  };

  //add submit
  const onSubmit = (data: any) => {
    setIsLoadingAddFormCategory(true);
    if (description && description.trim().length === 0) {
      showErrorCategory("Description must not be empty.");
      setIsLoadingAddFormCategory(false);
    } else if (Object.keys(errors).length === 0 && img) {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("category", data.category);
      formData.append("location", data.address);
      formData.append("description", description || "");
      formData.append("img", img);
      addFacility(formData)
        .then((res) => {
          handleCancel();
          reset();
          showSuccessCategory("Add facility successfully !!!");
          setIsLoadingAddFormCategory(false);
          getFacilities(activePage, null, "").then(
            (res: any) => {
              setListFacility(res.data.items);
              setTotalPage(res.data.totalPage);
            },
            (err) => {
              setActivePage(1);
              setTotalPage(0);
              console.log(err);
            }
          );
        })
        .catch((err) => {
          handleCancel();
          showErrorCategory(
            err.response.data.message || "Error adding facility !!! "
          );
          setIsLoadingAddFormCategory(false);
        });
    } else {
      showErrorCategory("Image must be less than 2MB and not empty !!");
      setIsLoadingAddFormCategory(false);
    }
  };

  //updateSubmit
  const onSubmitUpdate = (data: any) => {
    setisLoadingUpdateFormCategory(true);
    if (descriptionUpdate && descriptionUpdate.trim().length === 0) {
      showErrorCategory("Description must not be empty.");
      setisLoadingUpdateFormCategory(false);
    } else if (Object.keys(errorsUpdate).length === 0) {
      const formData = new FormData();
      formData.append("id", dataUpdaate._id);
      formData.append("name", data.name);
      formData.append("category", data.category);
      formData.append("location", data.address);
      formData.append("description", descriptionUpdate || "");
      if (imgUpdate) {
        formData.append("img", imgUpdate);
      }
      updateFacility(formData)
        .then((res) => {
          if (res?.status === 200) {
            handleCancelUpdate();
            resetUpdate();
            showSuccessCategory("Update facility successfully !!!");
            setisLoadingUpdateFormCategory(false);
            setImgUpdate(null);
            getFacilities(activePage, null, "").then(
                (res) => {
                    setListFacility(res?.data.items);
                    setTotalPage(res?.data.totalPage);
                },
                (err) => {
                    setActivePage(1);
                    setTotalPage(0);
                    console.log(err);
                }
            );
        } else {
            // Xử lý khi mã trạng thái không phải là 200
            showErrorCategory(
               res?.data.message || "Facility name Exist"
            );
            setisLoadingUpdateFormCategory(false);
        }
        })
        .catch((err) => {
          handleCancelUpdate();
          showErrorCategory(
            err.response.data.message || "Error updating facility !!! "
          );
          setisLoadingUpdateFormCategory(false);
        });
    } else {
      showErrorCategory("Image must be less than 2MB and not empty !!");
      setisLoadingUpdateFormCategory(false);
    }
  };

  const handleSelectedFileUpdate = (e: FileUploadSelectEvent) => {
    setImgUpdate(e.files[0]);
  };

  useLayoutEffect(() => {
    setIsSpinning(true);
    getCategory()
      .then((res: any) => {
        console.log(res);
        setListCategory(res.data.item);
      })
      .catch((error) => {
        console.log(error);
      });
    getFacilities(1, null, "").then(
      (res: any) => {
        setListFacility(res.data.items);
        setActivePage(1);
        setTotalPage(res.data.totalPage);
        setIsSpinning(false);
      },
      (err) => {
        setActivePage(1);
        setTotalPage(0);
        console.log(err);
        setIsSpinning(false);
      }
    );
  }, []);

  const handleChangeStatus = (
    statusCurrent: number,
    changeStatus: number,
    data: any
  ) => {
    // setIsSpinning(true);
    setIdFaci(data._id);

    if (statusCurrent !== changeStatus) {
      if (statusCurrent === 1) {
        showModalInactive();
        return;
      }

      updateStatusFaci(data._id)
        .then(() => {
          showSuccessCategory("Change status successfully !!!");
          getFacilities(activePage, null, "").then(
            (res: any) => {
              setListFacility(res.data.items);
              setActivePage(activePage);
              setTotalPage(res.data.totalPage);
              // setIsSpinning(false);
            },
            (err) => {
              setActivePage(1);
              setTotalPage(0);
              // console.log(err);
              // setIsSpinning(false);
            }
          );
        })
        .catch((err) => {
          // setIsSpinning(false);
          showErrorCategory(err.response?.data?.message);
        });
    }
    // setIsSpinning(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleExcelSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Ngăn chặn hành động gửi biểu mẫu mặc định
  
    // Kiểm tra xem có file đã được chọn hay không
    if (!file) {
      showErrorCategory('Please select a file.')
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file); // Thêm file vào FormData
  
    try {
      const response = await fetch('http://localhost:5152/facility/import', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        showSuccessCategory("Import facility successfully !!!");
        window.location.reload();
      }
    } catch (error) {
      // Xử lý lỗi khi gửi file
      console.error('Error uploading file:', error);
      showErrorCategory("Import facility error !!!");
    }
  };
  


  return (
    <>
      <div className="">
        <div>
          <div className="border flex flex-col justify-center">
            <div className="border text-center">
              <p className="text-2xl p-2 bg-orange-500 text-white font-semibold">
                Quản lý phòng , sân thể dục
              </p>
            </div>
            <div className="flex justify-between bg-blue-100">
              <div className="py-2 flex items-center justify-end bg-blue-100">
                <Tooltip title="Tạo một phòng hoặc sân bóng mới">
                  <button
                    onClick={showModal}
                    className="ml-5 outline-none border border-gray-300 h-7 p-1 text-white  bg-orange-500 hover:bg-orange-300  "
                  >
                    <FontAwesomeIcon className="text-xl" icon={faPlus} />
                  </button>
                </Tooltip>
              </div>
              <div className="py-2 flex justify-end bg-blue-100">
                <input
                  type="text"
                  className="outline-none border border-gray-300 h-7 p-1 rounded-full"
                  placeholder="Điền kí tự để tìm kiếm ..."
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <div className="py-2 flex items-center justify-end bg-blue-100">
              <Tooltip title="Import nhiều phòng">
              <div className="">
                <div>
                <form onSubmit={handleExcelSubmit} className="">
        <input
          type="file"
          id="file"
          name="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          required
        />
        <button type='submit' className="rounded-md bg-orange-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-blue-700 focus:shadow-none active:bg-blue-700 hover:bg-blue-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2">
  Upload
</button>
      </form>
                </div>

    </div>
                </Tooltip>
              </div>
              
            </div>
            <table>
              <thead className="border">
                <tr>
                  <th className="p-5 border">#</th>
                  <th className="p-5 border">Tên phòng (sân)</th>
                  <th className="p-5 border">Ảnh</th>
                  <th className="p-5 border">Địa chỉ</th>
                  <th className="p-5 border">Thời gian tạo</th>
                  <th className="p-5 border">Trạng thái</th>
                  <th className="p-5 border">Lịch sử cập nhật</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {/* Uncomment this part if categoryData is supposed to be used */}
                {Array.isArray(listFacility) &&
                  listFacility.length > 0 &&
                  listFacility.map((c, index) => (
                    <tr className="" key={index}>
                      <td className="p-5 border text-center">
                        <p>{index + 1}</p>
                      </td>
                      <td className="p-5 border text-center">
                        <p className="cursor-pointer hover:text-gray-400 flex items-center justify-center gap-1">
                          <span>{c?.name}</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height={10}
                            width={10}
                            viewBox="0 0 512 512"
                          >
                            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
                          </svg>
                        </p>
                      </td>
                      <td className="p-5  border text-center">
                        <img src={c?.image} className="w-32 h-32 m-auto" />
                      </td>
                      <td className="p-5 border text-center">
                        <p>{c?.location}</p>
                      </td>
                      <td className="p-5 border text-center">
                        <p>{c && new Date(c.createdAt).toLocaleString()}</p>
                      </td>
                      <td className="p-5 border text-center">
                        <select
                          name=""
                          id=""
                          className={`outline-none ${
                            c?.status === 1 && "text-green-500"
                          } ${c?.status === 0 && "text-red-500"}`}
                          value={c?.status === 1 ? "active" : "inactive"}
                          onChange={(e) =>
                            handleChangeStatus(
                              c?.status,
                              e.target.value === "active" ? 1 : 0,
                              c
                            )
                          }
                        >
                          <option value="active" className="text-green-500">
                            Active
                          </option>
                          <option value="inactive" className="text-red-500">
                            Inactive
                          </option>
                        </select>
                      </td>
                      <td className="p-5 border text-center">
                        <button
                          className="bg-green-400 hover:bg-green-300 p-2 text-white rounded-full w-24"
                          onClick={() => showModalView(c._id)}
                        >
                          Xem
                        </button>
                      </td>
                      <td className="border">
                        <div className="flex flex-col items-center gap-2 w-full py-1">
                          <button
                            onClick={() => showModalUpdate(c)}
                            className="bg-orange-500 hover:bg-blue-300 p-2 text-white rounded-full w-24"
                          >
                            Cập nhật
                          </button>
                          <button
                              onClick={() => {
                                hardDeleteFacility(c._id)
                                    .then(() => {
                                      showSuccessCategory("Đã xoá khỏi hệ thống!");
                                      getFacilities(1, null, "").then((res: any) => {
                                        setListFacility(res.data.items);
                                        setTotalPage(res.data.totalPage);
                                      });
                                    })
                                    .catch(() => {
                                      showErrorCategory("Xoá thất bại");
                                    });
                              }}
                              className="bg-red-600 hover:bg-red-500 p-2 text-white rounded-full w-24"
                          >
                            Xoá
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {isSpinning === true ? (
              <ProgressSpinner
                className="w-52 h-52 my-10"
                strokeWidth="3"
                fill="var(--surface-ground)"
                animationDuration=".5s"
              />
            ) : (
              <>
                {!Array.isArray(listFacility) || listFacility.length === 0 ? (
                  <div className="text-center">
                    <h1 className="font-bold text-3xl my-10">No data</h1>
                  </div>
                ) : null}
                {totalPage > 0 && (
                  <div className="flex items-center justify-center">
                    <Pagination
                      current={activePage}
                      total={Number(totalPage + "0")}
                      onChange={onChangePage}
                      showSizeChanger={false}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <Toast ref={toastAddCategory} />
      </div>
      <Modal
        className="w-96"
        open={open}
        confirmLoading={false}
        onOk={handleOk}
        closeIcon={<></>}
        footer={<></>}
      >
        <Spin tip="Loading" size="large" spinning={isLoadingAddFormCategory}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <h1 className="text-center font-bold mb-5 text-xl">
                Tạo 1 phòng , sân thể dục mới
              </h1>
            </div>
            <div className="mb-2">
              <label htmlFor="name">Tên phòng,sân bóng</label>
              <input
                id="name"
                className={`w-full shadow-none p-3 border ${
                  errors.name ? "outline-red-300" : "outline-blue-300"
                }`}
                {...register("name")}
              />
              {errors.name && (
                <span className="text-red-500">{errors.name.message}</span>
              )}
            </div>
            <div className="mb-2">
              <label htmlFor="shortName">Tiêu đề ngắn</label>
              <input
                id="shortName"
                className={`w-full shadow-none p-3 border ${
                  errors.shortName ? "outline-red-300" : "outline-blue-300"
                }`}
                {...register("shortName")}
              />
              {errors.shortName && (
                <span className="text-red-500">{errors.shortName.message}</span>
              )}
            </div>
            <div className="mb-2">
              <label htmlFor="category">Phân loại</label>
              <select
                id="category"
                className={`w-full shadow-none p-3 border ${
                  errors.category ? "outline-red-300" : "outline-blue-300"
                }`}
                {...register("category")}
              >
                {listCategory &&
                  listCategory.map((item: any, index: number) => (
                    <option key={index} value={item._id}>
                      {item.categoryName}
                    </option>
                  ))}
              </select>

              {errors.category && (
                <span className="text-red-500">{errors.category.message}</span>
              )}
            </div>

            <div className="border mb-10 flex justify-content-center">
              <Tooltip title="Tải ảnh cho phòng, sân thể dục vào đây">
                <FileUpload
                  id="img"
                  onSelect={(e: FileUploadSelectEvent) => handleSelectedFile(e)}
                  onClear={() => setImg(null)}
                  accept="image/*"
                  ref={refAdd}
                  maxFileSize={MAX_FILE_SIZE}
                  disabled={false}
                  uploadOptions={{
                    className: "hidden",
                  }}
                  emptyTemplate={
                    <p className="m-0">
                      Tải ảnh cho phòng, sân thể dục vào đây
                    </p>
                  }
                />
              </Tooltip>
            </div>
            <div className="mb-2">
              <label htmlFor="address">Địa chỉ</label>
              <input
                id="address"
                className={`w-full shadow-none p-3 border ${
                  errors.address ? "outline-red-300" : "outline-blue-300"
                }`}
                {...register("address")}
              />

              {errors.address && (
                <span className="text-red-500">{errors.address.message}</span>
              )}
            </div>
            <div>
              <p className="text-center font-bold">Thông tin chi tiết</p>
              <div className="border mb-10 flex justify-content-center">
                <span className="p-float-label w-full">
                  <Editor
                    id="description"
                    value={description ? description : ""}
                    onTextChange={(e: EditorTextChangeEvent) =>
                      setDescription(e.htmlValue)
                    }
                    style={{ height: "320px" }}
                  />
                </span>
              </div>
            </div>
            <div className="flex justify-end">
              <Button key="back" onClick={handleCancel}>
                Hủy
              </Button>
              <Button className="bg-blue-500 text-white" htmlType="submit">
                Thêm
              </Button>
            </div>
          </form>
        </Spin>
      </Modal>

      <Modal
        className="w-96"
        open={openUpdate}
        confirmLoading={false}
        closeIcon={<></>}
        footer={<></>}
      >
        <Spin tip="Loading" size="large" spinning={isLoadingUpdateFormCategory}>
          <form onSubmit={handleSubmitUpdate(onSubmitUpdate)}>
            <div>
              <h1 className="text-center font-bold mb-5 text-xl">Cập nhập</h1>
            </div>
            <div className="mb-2">
              <label htmlFor="name">Tên phòng,sân bóng</label>
              <input
                id="name"
                defaultValue={dataUpdaate?.name}
                className={`w-full shadow-none p-3 border ${
                  errorsUpdate.name ? "outline-red-300" : "outline-blue-300"
                }`}
                {...registerUpdate("name")}
              />
              {errorsUpdate.name && (
                <span className="text-red-500">
                  {errorsUpdate.name.message}
                </span>
              )}
            </div>

            <div className="mb-2">
              <label htmlFor="category">Phân loại</label>
              <select
                // disabled = {true}
                value={dataUpdaate?.category?._id}
                id="category"
                className={`w-full shadow-none p-3 border ${
                  errorsUpdate.category ? "outline-red-300" : "outline-blue-300"
                }`}
                {...registerUpdate("category")}
              >
                {listCategory &&
                  listCategory.map((item: any, index: number) => (
                    <option key={index} value={item._id}>
                      {item.categoryName}
                    </option>
                  ))}
              </select>

              {errorsUpdate.category && (
                <span className="text-red-500">
                  {errorsUpdate.category.message}
                </span>
              )}
            </div>

            <div className="border mb-10 flex justify-content-center">
              <Tooltip title="Tải ảnh cho phòng, sân thể dục vào đây">
                <FileUpload
                  id="img"
                  onSelect={(e: FileUploadSelectEvent) =>
                    handleSelectedFileUpdate(e)
                  }
                  onClear={() => setImgUpdate(null)}
                  accept="image/*"
                  ref={refUpdate}
                  maxFileSize={MAX_FILE_SIZE}
                  disabled={false}
                  uploadOptions={{
                    className: "hidden",
                  }}
                  emptyTemplate={
                    <p className="m-0">
                      Tải ảnh cho phòng, sân thể dục vào đây
                    </p>
                  }
                />
              </Tooltip>
            </div>
            <div className="mb-2">
              <label htmlFor="address">Địa chỉ</label>
              <input
                id="address"
                defaultValue={dataUpdaate?.location}
                className={`w-full shadow-none p-3 border ${
                  errorsUpdate.address ? "outline-red-300" : "outline-blue-300"
                }`}
                {...registerUpdate("address")}
              />

              {errorsUpdate.address && (
                <span className="text-red-500">
                  {errorsUpdate.address.message}
                </span>
              )}
            </div>
            <div>
              <p className="text-center font-bold">Thông tin chi tiết</p>
              <div className="border mb-10 flex justify-content-center">
                <span className="p-float-label w-full">
                  <Editor
                    id="description"
                    value={dataUpdaate?.description || ""}
                    onTextChange={(e: EditorTextChangeEvent) =>
                      setDescriptionUpdate(e.htmlValue)
                    }
                    style={{ height: "320px" }}
                  />
                </span>
              </div>
            </div>
            <div className="flex justify-end">
              <Button key="back" onClick={handleCancelUpdate}>
                Hủy
              </Button>
              <Button className="bg-blue-500 text-white" htmlType="submit">
                Cập nhập
              </Button>
            </div>
          </form>
        </Spin>
      </Modal>
      <Modal
        className=" "
        open={modalVisible}
        onOk={handleOkV}
        onCancel={handleCancelV}
        closeIcon={<></>}
        footer={[]}
        width={1200}
      >
        <div className="flex flex-col items-center h-full w-full">
          <div>
            <h1 className="text-center font-bold uppercase mb-5 text-xl">
              Lịch sử cập nhập các loại dịch vụ
            </h1>
          </div>
          <div className="overflow-auto max-h-full w-full">
            <table className="w-full divide-gray-200">
              <thead className="bg-blue-400">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-black uppercase tracking-wider"
                  >
                    #
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-black uppercase tracking-wider"
                  >
                    Tên Mới
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-black uppercase tracking-wider"
                  >
                    Ảnh Mới
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-black uppercase tracking-wider"
                  >
                    Tên Cũ
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-black uppercase tracking-wider"
                  >
                    Ảnh cũ
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-black uppercase tracking-wider"
                  >
                    T/G cập nhật
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-black uppercase tracking-wider"
                  >
                    Người sửa
                  </th>
                </tr>
              </thead>
              <tbody
                className="bg-white divide-y divide-gray-200"
                style={{ maxHeight: "300px", overflowY: "auto" }}
              >
                {viewData?.length > 0 ? (
                  viewData.map((d: any, index: any) => (
                    <tr key={index}>
                      <td className="text-center">{index + 1}</td>
                      <td className="text-center">{d?.objectAfter?.name}</td>
                      <td className="justify-center">
                        <img
                          className="w-32 h-32"
                          src={d?.objectAfter?.image}
                          alt=""
                        />
                      </td>
                      <td className="text-center">{d?.objectBefore?.name}</td>
                      <td className="justify-center">
                        <img
                          className="w-32 h-32"
                          src={d?.objectBefore?.image}
                          alt=""
                        />
                      </td>
                      <td className="text-center">
                        {new Date(d?.createdAt).toLocaleString("vi-VN", {
                          month: "numeric",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="justify-center text-center ">
                        <p className="font-medium">{d?.actionUser?.name}</p>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center ">
                      <h1 className="font-bold "> Chưa được cập nhật</h1>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      <Modal
        title={
          <span style={{ color: "red", fontSize: "20px" }}>
            Ngưng hoạt động
          </span>
        }
        open={isModalOpenChangeInactive}
        onOk={handleOkInactive}
        onCancel={handleCancelInactive}
        footer={[]}
      >
        <p>Bạn có chắc chắn muốn ngưng hoạt động phòng này không ?</p>
        <p>
          <span className="font-bold text-red-500">Lưu ý:</span>Tất cả những yêu
          cầu sử dụng phòng này sẽ bị hủy khi phòng này ngưng hoạt động và người
          dùng sẽ không thể đặt phòng này nữa
        </p>
        <div className="flex justify-end">
          <Button key="back" onClick={handleCancelInactive}>
            Cancel
          </Button>
          <Button className="bg-blue-500 text-white" onClick={handleOkInactive}>
            OK
          </Button>
        </div>
      </Modal>
    </>
  );
}
