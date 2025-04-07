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

                    if (response.data.user.roleId.roleName === 'Admin') {
                        setTimeout(
                            router.push('/dashboard')
                            , 1000)
                    } else if (response.data.user.roleId.roleName === 'Guard') {
                        setTimeout(
                            router.push('/guarddashboard')
                            , 1000)
                    } else {
                        router.push('/')
                    }
                }

                // throw new Error(data?.message || data);
            })
            .catch((error) => {
                // setError(error?.message);
                setError(error);
            })
    };
    return { loading, error, handleGoogle, setError };
};

export default login;