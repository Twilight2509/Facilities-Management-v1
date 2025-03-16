"use client";
import login from "../../services/login/login.service";
import { useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { useRouter } from "next/navigation.js";
const LoginComponent = () => {
  const router = useRouter();
  const { handleGoogle, loading, error, setError } = login(
    "http://localhost:5152/users/login"
  );

  const toast = useRef<any>(null);

  const showError = () => {
    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: (error as any).response?.data?.message,
      life: 3000,
    });
  };

  useEffect(() => {
    if ((window as any)?.google) {
      const goolge = (window as any)?.google;
      goolge.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GG_ID,
        callback: handleGoogle,
      });
      console.log(process.env.NEXT_PUBLIC_GG_ID);
      goolge.accounts.id.renderButton(document.getElementById("loginDiv"), {
        theme: "filled_blue",
        text: "signin_with",
        shape: "pill",
      });
    }
  }, [handleGoogle]);

  useEffect(() => {
    if (error !== "") {
      showError();
      setError("");
    }
  }, [error]);

  return (
    <>
      <div className="mt-36 bg-white filter brightness-100 px-4 py-5 rounded-lg">
        <div className="z-50 shadow-lg mb-3">
          <p>Sinh viên, Giảng viên ĐH-FPT HOLA</p>
        </div>
        <div id="loginDiv" className="flex justify-center"></div>
      </div>
      <Toast ref={toast} />
    </>
  );
};

export default LoginComponent;
