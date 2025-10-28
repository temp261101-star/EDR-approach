
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Calendar } from 'primereact/calendar';
import 'primereact/resources/themes/lara-dark-cyan/theme.css';
import 'primereact/resources/primereact.min.css';

const DateTimeInput = forwardRef(({ 
  label, 
  name,
   showTime = false, 
  required = false,
  placeholder = "Select date and time"
}, ref) => {
  const [value, setValue] = useState(null);

  useImperativeHandle(ref, () => ({
    reset: () => setValue(null)
  }));

  const handleChange = (e) => {
    setValue(e.value);
    
    // Dispatch custom event for FormController
    const input = document.querySelector(`input[name="${name}"]`);
    if (input) {
      const event = new Event('change', { bubbles: true });
      input.dispatchEvent(event);
    }
  };
const formatValue = (val) => {
  if (!val) return '';
  return showTime
    ? val.toISOString()
    : `${val.getFullYear()}-${(val.getMonth()+1).toString().padStart(2,'0')}-${val.getDate().toString().padStart(2,'0')}`;
};

  return (
    <div className="flex flex-col gap-2" >
      {label && (
        <label className="text-sm font-medium text-gray-300">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      <Calendar
        name={name}
        value={value}
        onChange={handleChange}
         showTime={showTime}    
        // hourFormat="12"
        placeholder={placeholder}
      className="w-full  border border-gray-500 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 bg-gray-800 text-gray-200"
        inputClassName="w-full  bg-gray-800 border-l border-gray-700 text-gray-200 text-sm rounded-lg px-3 py-1  disabled:opacity-60"
        panelClassName="bg-gray-800 border border-gray-700"
        dateFormat="dd/mm/yy"
        showIcon
        // icon="pi pi-calendar"
        // iconPos="right"
      />
      
      {/* Hidden input for FormController */}
      <input type="hidden" name={name} value={formatValue(value)} required={required} />

    </div>
  );
});

DateTimeInput.displayName = 'DateTimeInput';

export default DateTimeInput;