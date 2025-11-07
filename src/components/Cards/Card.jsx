import React from "react";
const Card = ({
  title,
  action,
  children,
  className = "",
  noPadding = false,
}) => (
  <div
    className={`rounded-lg border bg-gray-800 shadow-sm transition-shadow flex flex-col border-gray-700 ${className}`}
  >
    <div className="px-3 py-1  bg-gray-800/50 flex-shrink-0 border-gray-700">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-100">{title}</h3>
        {action}
      </div>
    </div>
    {/* If noPadding=true, skip padding */}
    <div className={`flex-1 overflow-hidden ${noPadding ? "" : "p-2"}`}>
      {children}
    </div>
  </div>
);

export default Card;
