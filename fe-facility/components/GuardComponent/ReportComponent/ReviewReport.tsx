"use client"

import type React from "react"
import { useEffect, useState } from "react"
import axios from "axios"

interface ReviewReportProps {
    isOpen: boolean
    onClose: () => void
    booking: any
}

export const ReviewReport: React.FC<ReviewReportProps> = ({ isOpen, onClose, booking }) => {
    const [description, setDescription] = useState("")
    const [imageUrls, setImageUrls] = useState<string[]>([])
    const [belongings, setBelongings] = useState<any[]>([])

    useEffect(() => {
        if (isOpen && booking?._id) {
            axios.get(`http://localhost:5152/report/search/${booking._id}`)
                .then(res => {
                    const reports = res.data

                    if (!Array.isArray(reports) || reports.length === 0) return

                    const latest = reports[reports.length - 1] // Lấy báo cáo mới nhất

                    if (latest?.description) setDescription(latest.description)
                    if (Array.isArray(latest.album) && latest.album.length > 0) {
                        setImageUrls(latest.album)
                    }

                    if (Array.isArray(latest.belongings)) {
                        setBelongings(latest.belongings)
                    }
                })
                .catch(err => {
                    console.error("Lỗi khi lấy dữ liệu báo cáo:", err)
                })
        }
    }, [isOpen, booking])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-md p-6 w-full max-w-xl relative">
                <button
                    className="absolute top-2 right-3 text-gray-500 hover:text-black text-2xl"
                    onClick={onClose}
                >
                    &times;
                </button>

                <h2 className="text-xl font-bold text-center mb-4">Báo cáo đã ghi nhận</h2>

                <div className="mb-4">
                    <p className="font-semibold mb-2">Mô tả tình trạng:</p>
                    <div className="border p-3 rounded bg-gray-100 whitespace-pre-line">
                        {description || "Không có mô tả."}
                    </div>
                </div>

                <div className="mb-4">
                    <p className="font-semibold mb-2">Cơ sở vật chất được báo cáo:</p>
                    <ul className="list-disc pl-5">
                        {belongings.length > 0 ? (
                            belongings.map((item, idx) => (
                                <li key={idx}>{item.name} ({item.status})</li>
                            ))
                        ) : (
                            <li>Không có mục nào được ghi nhận</li>
                        )}
                    </ul>
                </div>

                {imageUrls.length > 0 && (
                    <div className="mb-4">
                        <p className="font-semibold mb-2">Ảnh đã gửi:</p>
                        <div className="grid grid-cols-2 gap-4">
                            {imageUrls.map((url, idx) => (
                                <img
                                    key={idx}
                                    src={url}
                                    alt={`Ảnh báo cáo ${idx + 1}`}
                                    className="w-full max-h-64 object-contain border rounded"
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
