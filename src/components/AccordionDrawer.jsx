import React, { useState } from "react";

function AccordionDrawer({ title, options, checkedOptions = [], onCheck }) {
  const [open, setOpen] = useState(true);

  const toggleOpen = () => setOpen((prev) => !prev);

  return (
    <div className="border border-gray-700 rounded-lg">
   
      <button
        onClick={toggleOpen}
        className="w-full cursor-pointer flex justify-between items-center px-3 py-2 bg-gray-700 text-gray-200 font-medium"
      >
        {title}
        <span className="text-gray-400">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="p-3 space-y-2">
         {options.map((opt) => {
  if (typeof opt === "string") {
    return (
      <label key={opt} className="flex items-center gap-2 text-gray-300 cursor-pointer">
        <input
          type="checkbox"
          checked={checkedOptions.includes(opt)}
          onChange={() => onCheck(opt)}
        />
        {opt}
      </label>
    );
  }

  if (typeof opt === "object" && opt.children) {
    // for nested checkbox options
    // const [open, setOpen] = React.useState(true); 
    
    return (
      <div key={opt.label} className="ml-4">
      
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-2 text-cyan-400 font-semibold w-full cursor-pointer"
        >
          {open ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
          {opt.label}
        </button>

        {open && (
          <div className="ml-6 mt-2 space-y-1">
            {opt.children.map((child) => (
              <label key={child} className="flex items-center gap-2 text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkedOptions.includes(child)}
                  onChange={() => onCheck(child)}
                />
                {child}
              </label>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
})}

        </div>
      )}
    </div>
  );
}

export default AccordionDrawer;









