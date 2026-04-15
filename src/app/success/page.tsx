"use client";

import { Suspense } from "react";
import SuccessContent from "./SuccessContent";

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="container-page pt-32 text-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}