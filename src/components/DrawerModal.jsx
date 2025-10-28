

import { useEffect, useState } from "react";

export default function DrawerModal({ open, onClose, width = '400px', children }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let timer;
    if (open) {
      setShow(true);
    } else {
      timer = setTimeout(() => setShow(false), 300); 
    }
    return () => timer && clearTimeout(timer);
  }, [open]);

  if (!open && !show) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
    
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

     
      <div
        className={`fixed top-0 right-0 h-full border  border-gray-500 rounded-l-2xl shadow-xl overflow-auto transition-transform duration-300 ease-out
          ${open ? 'translate-x-0' : 'translate-x-full'}
          max-w-full w-[90%] sm:w-[80%] md:w-[60%] lg:w-[50%] xl:w-[${width}]`}
      >
        <p onClick={onClose} className=" flex justify-end text-white py-3 px-4 cursor-pointer">close</p>
        {children}
      </div>
    </div>
  );
}
