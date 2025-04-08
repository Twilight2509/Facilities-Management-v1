"use client"

import type React from "react"
import {useEffect, useState } from "react"
import axios from "axios";

interface FacilityStatusModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { description: string; image?: File }) => void
  booking: any

}

export const FacilityStatusModal: React.FC<FacilityStatusModalProps> = ({ isOpen, onClose, onSubmit, booking }) => {
  const [description, setDescription] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [belongings, setBelongings] = useState<any[]>([])
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: string }>({})

  const handleSubmit = () => {
    if (!booking?._id) return;

    const formData = new FormData();
    formData.append("description", description);
    formData.append("status", "2"); // 2 là thiếu
    formData.append("bookingId", booking._id);
    formData.append("securityId", booking?.handler?._id || "");
    if (selectedFile) {
      formData.append("album", selectedFile);
    }

    axios.post("http://localhost:5152/report/create", formData)
        .then(() => {
          onSubmit({ description, image: selectedFile || undefined });
          onClose();
        })
        .catch(err => {
          console.error("Lỗi khi gửi báo cáo:", err);
        });
  };

  const handleCheckboxChange = (id: string) => {
    setSelectedItems(prev => {
      const newSelected = { ...prev }
      if (newSelected[id]) {
        delete newSelected[id]
      } else {
        newSelected[id] = ""
      }
      return newSelected
    })
  }

  // useEffect(() => {
  //   if (isOpen && booking?.facilityId?.category) {
  //     const categoryId = booking.facilityId.category
  //     axios.get(`http://localhost:5152/belonging/?categoryId=${categoryId}`)
  //         .then(res => {
  //           const facilities = Array.isArray(res.data) ? res.data : []
  //           const details = facilities.flatMap(f => f.details || [])
  //           setBelongings(details)
  //           console.log("📋 Belongings details:", details)
  //         })
  //         .catch(err => {
  //           console.error("Lỗi khi load belongings:", err)
  //         })
  //   }
  // }, [isOpen, booking])

  useEffect(() => {
    const selectedDescriptions = Object.keys(selectedItems).map((id) => {
      const item = belongings.find(b => b._id === id)
      return item ? `- ${item.name} (${item.status})` : null
    }).filter(Boolean)

    setDescription(selectedDescriptions.join('\n'))
  }, [selectedItems, belongings])

  useEffect(() => {
    if (isOpen && booking?.facilityId?.category) {
      const categoryId = booking.facilityId.category
      if (booking?.reportDescription) {
        setDescription(booking.reportDescription)
      }

      axios.get(`http://localhost:5152/belonging/?categoryId=${categoryId}`)
          .then(res => {
            const facilities = Array.isArray(res.data) ? res.data : []
            const details = facilities.flatMap(f => f.details || [])
            setBelongings(details)
          })
          .catch(err => {
            console.error("Lỗi khi load belongings:", err)
          })
    }
  }, [isOpen, booking])
  
  useEffect(() => {
    if (isOpen && booking?.reportStatus === 2) {
      axios.get(`http://localhost:5152/report/booking/${booking._id}`)
          .then(res => {
            const data = res.data;
            if (data?.description) setDescription(data.description);
            if (data?.album) {
              setSelectedFile({ name: data.album, type: "image/*" } as File);
            }
          })
          .catch(err => {
            console.error("Lỗi khi lấy lại báo cáo cũ:", err);
          });
    }
  }, [isOpen, booking]);


  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-md p-6 w-full max-w-xl">
        <h2 className="text-xl font-bold text-center mb-4">Chi tiết tình trạng cơ sở vật chất</h2>
        

        <div className="mb-4">
          <p className="mb-2">Tình trạng thực tế</p>
          <div className="border rounded">
            <div className="flex items-center border-b p-2">
              <select className="mr-2 border rounded px-2 py-1">
                <option>Normal</option>
              </select>
              <select className="mr-2 border rounded px-2 py-1">
                <option>Sans Serif</option>
              </select>
              <button className="mx-1 p-1">
                <strong>B</strong>
              </button>
              <button className="mx-1 p-1">
                <i>I</i>
              </button>
              <button className="mx-1 p-1">
                <u>U</u>
              </button>
              <button className="mx-1 p-1">A</button>
              <button className="mx-1 p-1">A</button>
            </div>
            <div className="p-2">
              <textarea
                className="w-full h-32 outline-none resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập mô tả tình trạng..."
              />
            </div>
          </div>
          <div className="mb-4">
            <p className="mb-2 font-semibold">Chọn cơ sở vật chất có vấn đề</p>
            <ul className="space-y-2">
              {belongings.map((item, idx) => (
                  <li key={item._id || idx} className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={item._id in selectedItems}
                        onChange={() => handleCheckboxChange(item._id)}
                    />
                    <label>{item.name} ({item.status})</label>
                  </li>
              ))}
            </ul>
          </div>


        </div>

        <div className="mb-6">
          <div className="border rounded p-4 flex flex-col items-center justify-center">
            <div className="flex space-x-2 mb-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
                onClick={() => document.getElementById("fileInput")?.click()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Choose
              </button>
              <button
                className="text-gray-500 px-4 py-2 rounded flex items-center"
                onClick={() => setSelectedFile(null)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Cancel
              </button>
            </div>
            <input
              id="fileInput"
              type="file"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setSelectedFile(e.target.files[0])
                }
              }}
            />
            <p className="text-center">Tải ảnh tình trạng cơ sở vật chất</p>
            {selectedFile && <p className="text-sm text-blue-500 mt-2">{selectedFile.name}</p>}
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button className="px-4 py-2 border rounded" onClick={onClose}>
            Hủy
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleSubmit}>
            Báo cáo
          </button>
        </div>
      </div>
    </div>
  )
}

