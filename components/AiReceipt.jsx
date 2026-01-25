"use client";
import { scanReceipt } from "@/actions/transaction";
import useFetch from "@/hooks/useFetch";
import React, { useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Camera, Loader } from "lucide-react";
import { toast } from "sonner";

const AiReceipt = ({ onScanComplete }) => {
  const fileInput = useRef();

  const {
    loading: scanLoading,
    fn: scanFn,
    data: scannedData,
  } = useFetch(scanReceipt);

  const handleReceiptScan = async (file) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }
    await scanFn(file);
  };

  useEffect(() => {
    if (!scannedData) return;

    onScanComplete(scannedData);
    toast.success("Receipt scanned successfully");
  }, [scannedData, onScanComplete]);

  return (
    <div>
      <input
        type="file"
        ref={fileInput}
        className="hidden"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleReceiptScan(file);
        }}
      />

      <Button onClick={() => fileInput.current?.click()}
  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
        >
        {scanLoading ? (
          <>
            <Loader className="mr-2 animate-spin" />
            <span>Scanning Receipt...</span>
          </>
        ) : (
          <>
            <Camera />
            <span>Scan Receipt with AI</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default AiReceipt;
