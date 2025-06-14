"use client";
import { useEffect } from "react";

export default function SessionErrorPage() {
  // Disable user interactions by adding a useEffect hook
  useEffect(() => {
    // Add an overlay to prevent clicks
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.zIndex = "1000";
    overlay.style.pointerEvents = "all";

    document.body.appendChild(overlay);

    // Prevent context menu
    const preventContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", preventContextMenu);

    // Add cleanup function
    return () => {
      document.body.removeChild(overlay);
      document.removeEventListener("contextmenu", preventContextMenu);
    };
  }, []);

  return (
    <div className="min-h-screen bg-red-600 flex flex-col relative">
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-1 p-8">
        <h1 className="text-5xl md:text-7xl font-bold text-white text-center mb-8">
          You have been logged out from another device
        </h1>
        <p className="text-xl text-white text-center max-w-3xl">
          Your session was terminated because your account was logged in on
          another device.
        </p>
      </div>
    </div>
  );
}
