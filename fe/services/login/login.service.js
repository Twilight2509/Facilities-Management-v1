"use client";
import axios from 'axios'
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const login = (url) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter()
    const handleGoogle = async (response) => {
        setLoading(true);
        axios.post(url, { credential: response.credential })
            .then((response) => {
                const data = response.data;

                if (data?.user) {
                    localStorage.setItem("accessToken", JSON.stringify(data?.token?.token));
                    localStorage.setItem("user", JSON.stringify(data?.user));

                    // Kiểm tra nếu có URL trước đó đã được lưu trong localStorage
                    const previousPath = localStorage.getItem("previousPath");

                    if (previousPath) {
                        localStorage.removeItem("previousPath"); // Xóa đường dẫn sau khi sử dụng
                        router.push(previousPath);
                    } else if (response.data.user.roleId.roleName === 'Admin') {
                        setTimeout(() => {
                            router.push('/dashboard');
                        }, 1000);
                    } else {
                        router.push('/');
                    }
                }
            })
            .catch((error) => {
                setError(error);
            });
    };

    return { loading, error, handleGoogle, setError };
};

export default login;