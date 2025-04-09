"use client"

import type React from "react"
import { useEffect, useState } from "react"
import axios from "axios"

interface FacilityStatusModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { description: string; files: File[] }) => void
  booking: any
}

export const FacilityStatusModal: React.FC<FacilityStatusModalProps> = ({ isOpen, onClose, onSubmit, booking }) => {
  const [description, setDescription] = useState("")
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [belongings, setBelongings] = useState<any[]>([])
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: string }>({})

  const handleSubmit = () => {
    if (!booking?._id) return

    onSubmit({ description, files: selectedFiles })
    onClose()
  }

  const handleCheckboxChange = (id: string, name: string) => {
    setSelectedItems(prev => {
      const newSelected = { ...prev }
      if (newSelected[id]) {
        delete newSelected[id]
      } else {
        newSelected[id] = name
      }
      return newSelected
    })
  }

  useEffect(() => {
    const selectedDescriptions = Object.values(selectedItems).map(name => `${name} - `)
    setDescription(selectedDescriptions.join('\n'))
  }, [selectedItems])

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

  if (!isOpen) return null

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-md p-6 w-full max-w-xl">
          <h2 className="text-xl font-bold text-center mb-4">Chi tiết tình trạng cơ sở vật chất</h2>

          {/* Mô tả tình trạng */}
          <div className="mb-4">
            <p className="mb-2 font-semibold">Tình trạng thực tế</p>
            <div className="border rounded-lg shadow-sm focus-within:ring-2 ring-blue-300 transition-all">
            <textarea
                className="w-full h-32 p-3 outline-none resize-none rounded-lg text-md bg-gray-50"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập mô tả tình trạng..."
            />
            </div>
          </div>

          {/* Checkbox cơ sở vật chất */}
          <ul
              className="grid grid-rows-4 gap-2"
              style={{ gridAutoFlow: "column" }} // xếp dọc trước, rồi sang cột
          >
            {belongings.map((item, idx) => (
                <li key={item._id || idx} className="flex items-center space-x-2">
                  <input
                      type="checkbox"
                      checked={item._id in selectedItems}
                      onChange={() => handleCheckboxChange(item._id, item.name)}
                  />
                  <label>{item.name}</label>
                </li>
            ))}
          </ul>

          {/* Upload hình ảnh */}
          <div className="mb-6 mt-4">
            <div className="border rounded p-2 pb-6">
              <div className="flex space-x-2 mb-4">
                <button
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                    onClick={() => document.getElementById("fileInput")?.click()}
                >
                  Chọn ảnh
                </button>
                <button
                    className="text-gray-500 px-2 py-2 rounded"
                    onClick={() => setSelectedFiles([])}
                >
                  Xoá tất cả
                </button>
              </div>

              <input
                  id="fileInput"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) {
                      setSelectedFiles(Array.from(e.target.files))
                    }
                  }}
              />

              <p className="text-center mb-1">Ảnh đã chọn</p>
              <div className="flex space-x-2 overflow-x-auto">
                {selectedFiles.slice(0, 4).map((file, idx) => {
                  const isLast = idx === 3 && selectedFiles.length > 4
                  const remaining = selectedFiles.length - 4

                  return (
                      <div key={idx} className="relative w-32 h-32 rounded border overflow-hidden">
                        <img
                            src={URL.createObjectURL(file)}
                            alt={`preview-${idx}`}
                            className={`w-full h-full object-cover ${isLast ? 'opacity-60' : ''}`}
                        />
                        <button
                            onClick={() => {
                              const updated = [...selectedFiles]
                              updated.splice(idx, 1)
                              setSelectedFiles(updated)
                            }}
                            className="absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center hover:bg-opacity-80"
                        >
                          ×
                        </button>
                        {isLast && (
                            <div className="absolute inset-0 flex items-center justify-center text-white font-semibold text-lg bg-black bg-opacity-50">
                              +{remaining}
                            </div>
                        )}
                      </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Nút hành động */}
          <div className="flex justify-end space-x-2">
            <button className="px-4 py-2 border rounded" onClick={onClose}>Hủy</button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleSubmit}>Báo cáo</button>
          </div>
        </div>
      </div>
  )
}