

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function GenericDrawerModal({
  isOpen,
  onClose,
  title = "",
  children,
  width = "400px",
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let timer;
    if (isOpen) {
      setShow(true);
    } else {
      // Wait for transition to complete before unmounting
      timer = setTimeout(() => setShow(false), 300);
    }
    return () => timer && clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen && !show) return null;

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ease-out ${
        isOpen
          ? "bg-black/40 backdrop-blur-sm opacity-100"
          : "bg-black/0 backdrop-blur-none opacity-0"
      }`}
      onClick={onClose}
    >
      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full bg-gray-900 shadow-2xl flex flex-col transition-transform duration-300 ease-out border-l border-gray-800 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ width }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-3 bg-gray-800 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-gray-100">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <X className="w-6 h-6 text-gray-400 hover:text-gray-200" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 text-gray-200">{children}</div>
      </div>
    </div>
  );
}
