'use client'
import { useEffect, useLayoutEffect } from "react";
import DashboardComponent from "../../../../components/DashboardComponent";
import { StorageService } from "../../../../services/storage";
import { useRouter } from "next/navigation";

export default function DashboardPage() {

 
  return (
    <div>
      <DashboardComponent />
    </div>
  );
}
