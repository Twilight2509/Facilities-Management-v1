"use client"

import type React from "react"
import { useState } from "react"

interface FacilityStatusModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { description: string; image?: File }) => void
}

export const FacilityStatusModal: React.FC<FacilityStatusModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [description, setDescription] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleSubmit = () => {
    onSubmit({
      description,
      image: selectedFile || undefined,
    })
    onClose()
  }

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

