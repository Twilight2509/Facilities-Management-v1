'use client'
import { useEffect, useLayoutEffect } from "react";
import GuardComponent from "../../../../components/GuardComponent";
import { StorageService } from "../../../../services/storage";
import { useRouter } from "next/navigation";

export default function GuardGuardPage() {

 
  return (
    <div>
      <GuardComponent />
    </div>
  );
}
