"use client";

import { useState, useEffect } from "react";
import AccountSetup from "./AccountSetup";

export default function DashboardBootstrap({ children, userReady }) {
  const [showSetup, setShowSetup] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!userReady) {
      // User not in DB yet — show setup animation then hard reload
      setShowSetup(true);
      return;
    }

    const seen = sessionStorage.getItem("traco_setup_done");
    if (!seen) {
      setShowSetup(true);
    } else {
      setReady(true);
    }
  }, [userReady]);

  const handleComplete = () => {
    if (!userReady) {
      // Bootstrap wasn't done — reload the page now that animation has played
      window.location.reload();
      return;
    }
    sessionStorage.setItem("traco_setup_done", "1");
    setShowSetup(false);
    setReady(true);
  };

  return (
    <>
      {showSetup && <AccountSetup onComplete={handleComplete} />}
      {ready && children}
    </>
  );
}