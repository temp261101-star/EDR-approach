// import React, { useState, useRef, useEffect, useCallback } from "react";

// export default function RadioGroup({
//   name,
//   label,
//   options = [],
//   defaultValue = "",
//   onChange,
//   required = false,
//   className = "",
//   grid =1
// }) {
//   const [selectedValue, setSelectedValue] = useState(defaultValue);    
//   const hiddenInputRef = useRef(null);

//   // initialize hidden input on mount
//   useEffect(() => {
//     if (hiddenInputRef.current) {
//       hiddenInputRef.current.value = selectedValue || "";
//     }
//   }, [selectedValue]);

//   const handleSelect = useCallback(
//     (value) => {
//       setSelectedValue(value);

//       // update hidden input for FormController
//       if (hiddenInputRef.current) {
//         hiddenInputRef.current.value = value;
//         hiddenInputRef.current.dispatchEvent(
//           new Event("change", { bubbles: true })
//         );
//       }

//       onChange?.({ target: { name, value } });
//     },
//     [name, onChange]
//   );

//   return (
//     <div className={`flex flex-col  ${className}`}>
//       {label && (
//         <label className="text-md font-medium text-gray-200 pb-1">{label}</label>
//       )}

//     <div className={` grid items-center gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-${grid}`}>
//   {options.map((option) => (
//     <label
//       key={option.value}
//       className="flex items-center space-x-2 cursor-pointer text-gray-300"
//     >
//       <input
//         type="radio"
//         name={name}
//         value={option.value}
//         checked={selectedValue === option.value}
//         onChange={() => handleSelect(option.value)}
//         required={required}
//         className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
//       />
//       <span className="text-sm text-gray-300">{option.label}</span>
//     </label>
//   ))}
// </div>

//  {/* {error && <p className="text-sm text-red-600">{error}</p>} */}
//       <input ref={hiddenInputRef} type="hidden" name={name} />
//     </div>
//   );
// }



import React, { useState, useRef, useEffect, useCallback } from "react";

export default function RadioGroup({
  name,
  label,
  options = [],
  defaultValue = "",
  onChange,
  required = false,
  className = "",
  grid = 1, // number of columns for large screens
}) {
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const hiddenInputRef = useRef(null);

  // initialize hidden input on mount
  useEffect(() => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = selectedValue || "";
    }
  }, [selectedValue]);

  const handleSelect = useCallback(
    (value) => {
      setSelectedValue(value);

      // update hidden input for FormController
      if (hiddenInputRef.current) {
        hiddenInputRef.current.value = value;
        hiddenInputRef.current.dispatchEvent(
          new Event("change", { bubbles: true })
        );
      }

      onChange?.({ target: { name, value } });
    },
    [name, onChange]
  );

  // Tailwind-compatible dynamic column classes
  const lgColsClass =
    grid === 1
      ? "lg:grid-cols-1"
      : grid === 2
      ? "lg:grid-cols-2"
      : grid === 3
      ? "lg:grid-cols-3"
      : grid === 4
      ? "lg:grid-cols-4"
      : "lg:grid-cols-1"; // fallback

  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label className="text-md font-medium text-gray-200 pb-1">{label}</label>
      )}

      <div className={`grid gap-4 sm:grid-cols-2 md:grid-cols-2 ${lgColsClass}`}>
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center space-x-2 cursor-pointer text-gray-300"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={() => handleSelect(option.value)}
              required={required}
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-300">{option.label}</span>
          </label>
        ))}
      </div>

      <input ref={hiddenInputRef} type="hidden" name={name} />
    </div>
  );
}
