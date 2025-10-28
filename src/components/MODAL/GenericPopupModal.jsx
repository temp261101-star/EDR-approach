// import { useState, useEffect } from "react";

// export default function GenericPopupModal({
//   isOpen,
//   onClose,
//   title = "Popup",
//   width = "600px",
//   selectedData = [],
// }) {
//   const [visible, setVisible] = useState(false);
//   const [activeTab, setActiveTab] = useState(0);

//   useEffect(() => {
//     let timer;
//     if (isOpen) {
//       setVisible(true);
//     } else {
//       timer = setTimeout(() => setVisible(false), 250);
//     }
//     return () => clearTimeout(timer);
//   }, [isOpen]);

//   if (!visible) return null;

//   const tabs = ["Whitelisting", "Black Listing", "Selected Rows"];

//   return (
//     <div
//       className={`fixed inset-0 z-50 flex justify-center items-center transition-opacity duration-300 ${
//         isOpen ? "bg-black/40 backdrop-blur-sm opacity-100" : "opacity-0"
//       }`}
//       onClick={onClose}
//     >
//       <div
//         className={`relative bg-gray-900 text-white rounded-2xl shadow-2xl transform transition-transform duration-300 ease-in-out w-[50%] sm:w-[${width}] ${
//           isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
//         }`}
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex justify-between items-center p-4 border-b border-gray-800">
//           <h2 className="text-lg font-semibold">{title}</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-white transition"
//           >
//             ✕
//           </button>
//         </div>

//         {/* Tabs */}
//         <div className="flex border-b border-gray-800">
//           {tabs.map((tab, idx) => (
//             <button
//               key={idx}
//               onClick={() => setActiveTab(idx)}
//               className={`flex-1 py-2 text-sm font-medium transition-colors ${
//                 activeTab === idx
//                   ? "border-b-2 border-cyan-500 text-cyan-400"
//                   : "text-gray-400 hover:text-gray-200"
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         {/* Tab Content */}
//         <div className="p-4 max-h-[70vh] overflow-y-auto">
//           {activeTab === 0 && <WhiteListingTab />}
//           {activeTab === 1 && <BlackListingTab />}
//           {activeTab === 2 && <SelectedRowsTab selectedData={selectedData} />}
//         </div>
//       </div>
//     </div>
//   );
// }

// function WhiteListingTab() {
//   return (
//     <div>
//       <h3 className="text-lg font-semibold mb-2">Overview</h3>
//       <p className="text-gray-400 text-sm">
//         This is the overview tab. You can place policy summaries or general info
//         here.
//       </p>
//     </div>
//   );
// }

// function BlackListingTab() {
//   return (
//     <div>
//       <h3 className="text-lg font-semibold mb-2">Settings</h3>
//       <p className="text-gray-400 text-sm">
//         This tab can hold policy configuration or form inputs.
//       </p>
//     </div>
//   );
// }

// function SelectedRowsTab({ selectedData }) {
//   return (
//     <div>
//       <h3 className="text-lg font-semibold mb-2">Selected Rows</h3>
//       {selectedData.length > 0 ? (
//         <div className="space-y-2">
//           {selectedData.map((row, i) => (
//             <div
//               key={i}
//               className="bg-gray-800 p-3 rounded-lg flex justify-between text-sm"
//             >
//               <span>{row.name || `Row ${i + 1}`}</span>
//               <span className="text-gray-400">{row.status}</span>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="text-gray-400 text-sm">No rows selected.</p>
//       )}
//     </div>
//   );
// }

// import { useState, useEffect } from "react";

// export default function GenericPopupModal({
//   isOpen,
//   onClose,
//   title = "Popup",
//   width = "600px",
//   selectedData = [],
// }) {
//   const [visible, setVisible] = useState(false);
//   const [activeTab, setActiveTab] = useState(0);

//   useEffect(() => {
//     let timer;
//     if (isOpen) {
//       setVisible(true);
//     } else {
//       timer = setTimeout(() => setVisible(false), 250);
//     }
//     return () => clearTimeout(timer);
//   }, [isOpen]);

//   if (!visible && !isOpen) return null;

//   const tabs = ["IOC Policy", "Edat Policy", "Exclusion Policy"];

//   // Extract IPs (or use any unique identifier from your data)
//   const ips = selectedData.map((row) => row.ip || row.name || "Unknown IP");

//   return (
//     <div
//       className={`fixed inset-0 z-50 flex justify-center items-center transition-opacity duration-300 ${
//         isOpen ? "bg-black/40 backdrop-blur-sm opacity-100" : "opacity-0"
//       }`}
//       onClick={onClose}
//     >
//       <div
//         className={`relative bg-gray-900 text-white rounded-2xl shadow-2xl transform transition-transform duration-300 ease-in-out w-full sm:w-[90%] md:w-[70%] lg:w-[50%] ${
//           isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
//         }`}
//         style={{ maxWidth: width }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div className="flex justify-between items-center p-4 border-b border-gray-800">
//           <h2 className="text-lg font-semibold">{title}</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-white transition"
//           >
//             ✕
//           </button>
//         </div>

//         {/* Selected IPs Section */}
//         {selectedData.length > 0 && (
//           <div className="p-4 border-b border-gray-800 bg-gray-850">
//             <h3 className="text-sm font-semibold text-cyan-400 mb-1">
//               Selected IPs:
//             </h3>
//             <div className="flex flex-wrap gap-2">
//               {ips.map((ip, i) => (
//                 <span
//                   key={i}
//                   className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs border border-gray-700"
//                 >
//                   {ip}
//                 </span>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Tabs */}
//         <div className="flex border-b border-gray-800">
//           {tabs.map((tab, idx) => (
//             <button
//               key={idx}
//               onClick={() => setActiveTab(idx)}
//               className={`flex-1 py-2 text-sm font-medium transition-colors ${
//                 activeTab === idx
//                   ? "border-b-2 border-cyan-500 text-cyan-400"
//                   : "text-gray-400 hover:text-gray-200"
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         {/* Tab Content */}
//         <div className="p-4 max-h-[70vh] overflow-y-auto">
//           {activeTab === 0 && <IOCPolicyTab selectedData={selectedData} />}
//           {activeTab === 1 && <EdatTab selectedData={selectedData} />}
//           {activeTab === 2 && <ExclusionPolicyTab selectedData={selectedData} />}
//         </div>
//       </div>
//     </div>
//   );
// }

// // -------- Tabs -------- //

// function IOCPolicyTab({ selectedData }) {
//   return (
//     <div>
//       <h3 className="text-lg font-semibold mb-3">IOCPolicy Policy</h3>
//       <p className="text-gray-400 text-sm mb-4">
//         Add IOCPolicy rules for these IPs.
//       </p>

//       {/* Future Form Placeholder */}
//       <div className="border border-gray-700 rounded-lg p-4 bg-gray-800 text-sm text-gray-300">
//         (Form fields for IOCPolicy policy will go here)
//       </div>
//     </div>
//   );
// }

// function EdatTab({ selectedData }) {
//   return (
//     <div>
//       <h3 className="text-lg font-semibold mb-3">eDAT Policy</h3>
//       <p className="text-gray-400 text-sm mb-4">
//         Add eDAT conditions for these IPs.
//       </p>

//       {/* Future Form Placeholder */}
//       <div className="border border-gray-700 rounded-lg p-4 bg-gray-800 text-sm text-gray-300">
//         (Form fields for eDAT policy will go here)
//       </div>
//     </div>
//   );
// }

// function ExclusionPolicyTab({ selectedData }) {
//   return (
//     <div>
//       <h3 className="text-lg font-semibold mb-2">ExclusionPolicy</h3>
//       {selectedData.length > 0 ? (
//         <div className="space-y-2">
//           {selectedData.map((row, i) => (
//             <div
//               key={i}
//               className="bg-gray-800 p-3 rounded-lg flex justify-between text-sm"
//             >
//               <span>{row.name || `Row ${i + 1}`}</span>
//               <span className="text-gray-400">{row.status}</span>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="text-gray-400 text-sm">No rows selected.</p>
//       )}
//     </div>
//   );
// }

import React, { useState, useRef, useEffect } from "react";
import Form, { FormFields } from "../Form";
import Select from "../Select";
import api from "../../../lib/api";
import toast from "react-hot-toast";
import FormController from "../../../lib/FormController";
import TextInput from "../TextInput";
import RadioGroup from "../RadioGroup";
import MultiSelect from "../MultiSelect";

export default function GenericPopupModal({
  isOpen,
  onClose,
  title = "Popup",
  width = "600px",
  selectedData = [],
}) {
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Open/close animation
  useEffect(() => {
    let timer;
    if (isOpen) {
      setVisible(true);
    } else {
      timer = setTimeout(() => setVisible(false), 250);
    }
    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!visible && !isOpen) return null;

  const tabs = ["IOC Policy", "EDAT Policy", "Exclusion Policy"];
  const ips = selectedData.map((row) => row.ip || row.name || "Unknown IP");

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center items-center transition-opacity duration-300 ${
        isOpen ? "bg-black/40 backdrop-blur-sm opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className={`relative bg-gray-900 text-white rounded-2xl shadow-2xl transform transition-transform duration-300 ease-in-out w-full sm:w-[90%] md:w-[70%] lg:w-[50%] ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        style={{ maxWidth: width }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* Selected IPs */}
        {selectedData.length > 0 && (
          <div className="p-4 border-b border-gray-800 bg-gray-850">
            <h3 className="text-sm font-semibold text-cyan-400 mb-1">
              Selected IPs:
            </h3>
            <div className="flex flex-wrap gap-2">
              {ips.map((ip, i) => (
                <span
                  key={i}
                  className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs border border-gray-700"
                >
                  {ip}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-800">
          {tabs.map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                activeTab === idx
                  ? "border-b-2 border-cyan-500 text-cyan-400"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {activeTab === 0 && <IOCPolicyTab selectedData={selectedData} />}
          {activeTab === 1 && <EDATPolicyTab selectedData={selectedData} />}
          {activeTab === 2 && (
            <ExclusionPolicyTab selectedData={selectedData} />
          )}
        </div>
      </div>
    </div>
  );
}

// -------- Tabs -------- //

function IOCPolicyTab({ selectedData }) {
  const formRef = useRef(null);

  useEffect(() => {
    if (!formRef.current) return;

    const controller = new FormController(formRef.current, {
      sources: {
        deviceTypes: api.getDeviceTypes,
        state: api.getStates,
        cities: async ({ state }) => api.getCities(state),
        region: api.getRegions,
      },
      actions: {
        addIOCPolicy: async (payload) =>
          api.post("/ioc-policy", {
            ...payload,
            ips: selectedData.map((d) => d.ip),
          }),
      },
      hooks: {
        onSuccess: () => {
          toast.success("IOC Policy added!");
          formRef.current.reset();
        },
      },
    });

    return () => controller.destroy();
  }, [selectedData]);


  const handlefileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://192.168.0.63:8080/SecureIT-EDR-ATM/EndPointSecurity/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("PDF uploaded successfully:", res.data);

      toast.success("File uploaded successfully!");
    } catch (err) {
      console.error("PDF upload failed:", err);

      toast.error("File upload fail");
    }
  };
  return (
    <Form
      ref={formRef}
      apiAction="addIOCPolicy"
      data-api="addIOCPolicy"
      title="Add IOC Policy"
    >
      <FormFields grid={2}>
        <TextInput
          name="PolicyName"
          label="Policy Name"
          placeholder="Policy Name"
        />
        <TextInput name="Remark" label="Remark" placeholder="Remark" />
        <RadioGroup
          name="selectMode"
          label="Select Mode:"
          error=""
          options={[
            { label: "OEM Wise", value: "oemwise" },
            { label: "Global", value: "global" },
          ]}
          defaultValue="oemwise"
        />{" "}
       
       <TextInput
          name="Hash"
          label="Hash"
          placeholder="Hash"
        />
       <TextInput
          name="FileName"
          label="File Name"
          placeholder="File Name"
        />
       <TextInput
          name="FilePath"
          label="File Path"
          placeholder="File Path"
        />
{/* <br /> */}
          <h2 className="text-md font-medium text-gray-200">file uploader</h2>
          <br />
         <input
            type="file"
            ref={formRef}
            accept="application/pdf"
            className="text-gray-400 font-medium border border-gray-600 px-2.5 py-0.5 rounded-sm"
            onChange={(e) => handlefileUpload(e)}
          />
      </FormFields>
    </Form>
  );
}

function EDATPolicyTab({ selectedData }) {
  const formRef = useRef(null);

  useEffect(() => {
    if (!formRef.current) return;

    const controller = new FormController(formRef.current, {
      sources: {
        categories: api.getCategories,
        severity: api.getSeverities,
      },
      actions: {
        addEDATPolicy: async (payload) =>
          api.post("/edat-policy", {
            ...payload,
            ips: selectedData.map((d) => d.ip),
          }),
      },
      hooks: {
        onSuccess: () => {
          toast.success("EDAT Policy added!");
          formRef.current.reset();
        },
      },
    });

    return () => controller.destroy();
  }, [selectedData]);

  return (
    <Form
      ref={formRef}
      apiAction="addEDATPolicy"
      data-api="addEDATPolicy"
      title="Add EDAT Policy"
    >
      <FormFields grid={2}>
        <MultiSelect name="TargetMode" label="Select Target Mode
"  />
        <MultiSelect name="severity" label="Severity"   options={["Zone wise", "Branch wise", "OEM Wise"]} />
        <MultiSelect name="ZoneName" label="Zone Name" multiselect={true}  options={["ISRO", "UNMANAGED"]} />
      </FormFields>
    </Form>
  );
}
function ExclusionPolicyTab({ selectedData }) {
  const formRef = useRef(null);

  const handlefileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://192.168.0.63:8080/SecureIT-EDR-ATM/EndPointSecurity/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("PDF uploaded successfully:", res.data);
      toast.success("File uploaded successfully!");
    } catch (err) {
      console.error("PDF upload failed:", err);
      toast.error("File upload failed");
    }
  };

  useEffect(() => {
    if (!formRef.current) return;

    const controller = new FormController(formRef.current, {
      sources: { reasons: api.getExclusionReasons },
      actions: {
        addExclusionPolicy: async (payload) =>
          api.post("/exclusion-policy", {
            ...payload,
            ips: selectedData.map((d) => d.ip),
          }),
      },
      hooks: {
        onSuccess: () => {
          toast.success("Exclusion Policy added!");
          formRef.current.reset();
        },
      },
    });

    return () => controller.destroy();
  }, [selectedData]);

  return (
    <Form
      ref={formRef}
      apiAction="addExclusionPolicy"
      data-api="addExclusionPolicy"
      title="Add Exclusion Policy"
    >
      <FormFields grid={2}>
        <MultiSelect name="reason" label="Reason" data-source="reasons" />
        <MultiSelect name="priority" label="Priority" options={["Low", "Medium", "High"]} />
        <TextInput name="PolicyName" label="Policy Name" placeholder="Policy Name" />
        <TextInput name="PolicyVersion" label="Policy Version" placeholder="Policy Version" />
        <div>
          <h2 className="text-md font-medium text-gray-200">
          Select IOC File/Hash (Comma Separated) (Upload a .txt file)
        </h2>
        <input
          type="file"
          accept="application/pdf"
          className="text-gray-400 font-medium border border-gray-600 px-2.5 py-0.5 rounded-sm"
          onChange={handlefileUpload}
        />  
        </div>
        
      </FormFields>
    </Form>
  );
}

