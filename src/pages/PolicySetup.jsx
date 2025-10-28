// import React, { useState } from "react";

// export default function PolicySetup() {
//   const [activeTab, setActiveTab] = useState("General");
//   const [enabled, setEnabled] = useState(true);
//   const [policyName, setPolicyName] = useState("USB Device Policy");
//   const [description, setDescription] = useState("");
//   const [ruleNameType, setRuleNameType] = useState("policy");
//   const [customRuleName, setCustomRuleName] = useState("");
//   const [customRuleDescription, setCustomRuleDescription] = useState("");
//   const [selectedIPs] = useState(["192.168.1.12", "192.168.1.42", "10.0.0.14"]);
//   const [deviceType, setDeviceType] = useState("");
//   const [modeAccess, setModeAccess] = useState("");
//   const [defaultPolicy, setDefaultPolicy] = useState("");
//   const [networkExclusions, setNetworkExclusions] = useState([]);
//   const [showNetworkModal, setShowNetworkModal] = useState(false);

//   const tabs = ["General", "Storage Device Control",  "Finish"];

//   const handleSubmit = async () => {
//   // Gather all data
//   const payload = {
//     policyName,
//     description,
//     enabled,
//     rule: {
//       type: ruleNameType,
//       name: customRuleName,
//       description: customRuleDescription,
//     },
//     selectedIPs,
//     device: {
//       type: deviceType,
//       mode: modeAccess,
//     },
//     network: {
//       defaultPolicy,
//       exclusions: networkExclusions,
//     },
//   };
// console.log("Submitting policy:", payload);

//   try {
//     const response = await fetch("YOUR_API_ENDPOINT_HERE", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(payload),
//     });

//     if (!response.ok) {
//       throw new Error("Failed to deploy policy");
//     }

//     const result = await response.json();
//     console.log("Policy deployed successfully:", result);
//     alert("Policy deployed successfully!");
//   } catch (error) {
//     console.error(error);
//     alert("Error deploying policy: " + error.message);
//   }
// };

//   const nextTab = () => {
//     const currentIndex = tabs.indexOf(activeTab);
//     if (currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1]);
//   };

//   const prevTab = () => {
//     const currentIndex = tabs.indexOf(activeTab);
//     if (currentIndex > 0) setActiveTab(tabs[currentIndex - 1]);
//   };

//   const handleAddExclusions = (newExclusions) => {
//     setNetworkExclusions((prev) => [...prev, ...newExclusions]);
//   };

//   const renderContent = () => {
//     switch (activeTab) {
//       case "General":
//         return (
//           <div className="bg-white shadow-md rounded-lg p-6 mt-4">
//             <h2 className="text-lg font-semibold mb-4">General Policy</h2>
//             <p className="text-sm text-gray-600 mb-4">
//               Supply a name and description for this policy:
//             </p>

//             <div className="mb-4">
//               <label className="block text-sm font-medium mb-1">Policy name:</label>
//               <div className="flex items-center gap-2">
//                 <input
//                   type="text"
//                   value={policyName}
//                   onChange={(e) => setPolicyName(e.target.value)}
//                   className="border rounded-md p-2 w-full"
//                 />
//                 <label className="flex items-center gap-1 text-sm">
//                   <input
//                     type="checkbox"
//                     checked={enabled}
//                     onChange={() => setEnabled(!enabled)}
//                   />
//                   Enabled
//                 </label>
//               </div>
//             </div>

//             <div className="mb-4">
//               <label className="block text-sm font-medium mb-1">Description:</label>
//               <textarea
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 className="border rounded-md p-2 w-full"
//               />
//             </div>

//             <div className="mb-4">
//               <label className="block text-sm font-medium mb-1">Policy owners:</label>
//               <div className="flex gap-2">
//                 <input
//                   type="text"
//                   value="None"
//                   readOnly
//                   className="border rounded-md p-2 w-full bg-gray-100"
//                 />
//                 <button className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">
//                   Edit
//                 </button>
//               </div>
//             </div>

//             <div className="mt-6">
//               <p className="text-sm text-gray-600 mb-2">
//                 A rule will be created for this policy. Indicate what you want the name to be:
//               </p>
//               <div className="space-y-2">
//                 <label className="flex items-center gap-2 text-sm">
//                   <input
//                     type="radio"
//                     checked={ruleNameType === "policy"}
//                     onChange={() => setRuleNameType("policy")}
//                   />
//                   Use the policy name for the rule name
//                 </label>
//                 <label className="flex items-center gap-2 text-sm">
//                   <input
//                     type="radio"
//                     checked={ruleNameType === "custom"}
//                     onChange={() => setRuleNameType("custom")}
//                   />
//                   Use a custom name for the rule
//                 </label>
//               </div>

//               {ruleNameType === "custom" && (
//                 <div className="mt-4 space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium mb-1">Rule name:</label>
//                     <input
//                       type="text"
//                       value={customRuleName}
//                       onChange={(e) => setCustomRuleName(e.target.value)}
//                       className="border rounded-md p-2 w-full"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-1">Description:</label>
//                     <textarea
//                       value={customRuleDescription}
//                       onChange={(e) => setCustomRuleDescription(e.target.value)}
//                       className="border rounded-md p-2 w-full"
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         );

//       case "Storage Device Control":
//         return (
//           <div className="bg-white shadow-md rounded-lg p-6 mt-4">
//             <h2 className="text-lg font-semibold mb-4">External USB</h2>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">Device Type</label>
//                 <select
//                   value={deviceType}
//                   onChange={(e) => setDeviceType(e.target.value)}
//                   className="border rounded-md p-2 w-full"
//                 >
//                   <option value="">Select Device</option>
//                   <option value="USB Storage">USB Storage</option>
//                   <option value="External HDD">MTP</option>
//                   <option value="Card Reader">CD-DVD</option>
//                   <option value="Card Reader">Bluetooth</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">Mode of Access</label>
//                 <select
//                   value={modeAccess}
//                   onChange={(e) => setModeAccess(e.target.value)}
//                   className="border rounded-md p-2 w-full"
//                 >
//                   <option value="">Select Mode</option>
//                   <option value="Read Only">Allow</option>
//                   <option value="Read/Write">Prevent</option>
//                   <option value="Blocked">Detect</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         );

//     //   case "Website":
//     //     return (
//     //       <div className="bg-white shadow-md rounded-lg p-6 mt-4">
//     //         <h2 className="text-lg font-semibold mb-4">Network Control</h2>
//     //         <div className="space-y-4">
//     //           <div className="flex items-center gap-3">
//     //             <div className="flex-1">
//     //               <label className="block text-sm font-medium mb-1">Default Policy</label>
//     //               <select
//     //                 value={defaultPolicy}
//     //                 onChange={(e) => setDefaultPolicy(e.target.value)}
//     //                 className="border rounded-md p-2 w-full"
//     //               >
//     //                 <option value="">Select Action</option>
//     //                 <option value="Allow">Allow All</option>
//     //                 <option value="Block">Block All</option>
//     //               </select>
//     //             </div>
//     //             <button
//     //               onClick={() => setShowNetworkModal(true)}
//     //               className="bg-blue-600 text-white px-4 py-2 rounded-md mt-5 hover:bg-blue-700"
//     //             >
//     //               Add Exclusion
//     //             </button>
//     //           </div>

//     //           {/* Network Table */}
//     //           <table className="w-full border text-sm mt-4">
//     //             <thead className="bg-gray-100">
//     //               <tr>
//     //                 <th className="p-2 border text-left">URL</th>
//     //                 <th className="p-2 border text-left">Action</th>
//     //               </tr>
//     //             </thead>
//     //             <tbody>
//     //               {networkExclusions.length === 0 ? (
//     //                 <tr>
//     //                   <td className="p-2 border text-gray-500 italic" colSpan="2">
//     //                     No exclusions added
//     //                   </td>
//     //                 </tr>
//     //               ) : (
//     //                 networkExclusions.map((item, idx) => (
//     //                   <tr key={idx}>
//     //                     <td className="p-2 border">{item.url}</td>
//     //                     <td className="p-2 border">{item.action}</td>
//     //                   </tr>
//     //                 ))
//     //               )}
//     //             </tbody>
//     //           </table>
//     //         </div>

//     //         {/* Modal */}
//     //         {showNetworkModal && (
//     //           <NetworkControlModal
//     //             onClose={() => setShowNetworkModal(false)}
//     //             onSubmit={handleAddExclusions}
//     //           />
//     //         )}
//     //       </div>
//     //     );

//      case "Finish":
//   return (
//     <div className="bg-white shadow-md rounded-lg p-6 mt-4 space-y-6">
//       <h2 className="text-lg font-semibold">Review Policy Summary</h2>

//       {/* --- General Info --- */}
//       <div>
//         <h3 className="font-medium mb-1">General Information</h3>
//         <table className="w-full border text-sm mt-2">
//           <tbody>
//             <tr>
//               <td className="p-2 border font-medium">Policy Name</td>
//               <td className="p-2 border">{policyName}</td>
//             </tr>
//             <tr>
//               <td className="p-2 border font-medium">Description</td>
//               <td className="p-2 border">
//                 {description || <span className="text-gray-500 italic">No description</span>}
//               </td>
//             </tr>
//             <tr>
//               <td className="p-2 border font-medium">Enabled</td>
//               <td className="p-2 border">{enabled ? "Yes" : "No"}</td>
//             </tr>
//             <tr>
//               <td className="p-2 border font-medium">Rule Type</td>
//               <td className="p-2 border">
//                 {ruleNameType === "custom"
//                   ? `Custom Rule: ${customRuleName || "Unnamed"}`
//                   : "Uses Policy Name"}
//               </td>
//             </tr>
//             {ruleNameType === "custom" && (
//               <tr>
//                 <td className="p-2 border font-medium">Rule Description</td>
//                 <td className="p-2 border">
//                   {customRuleDescription || (
//                     <span className="text-gray-500 italic">No description</span>
//                   )}
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* --- Storage Device Info --- */}
//       <div>
//         <h3 className="font-medium mb-1">Storage Device Control</h3>
//         <table className="w-full border text-sm mt-2">
//           <tbody>
//             <tr>
//               <td className="p-2 border font-medium">Device Type</td>
//               <td className="p-2 border">
//                 {deviceType || <span className="text-gray-500 italic">Not selected</span>}
//               </td>
//             </tr>
//             <tr>
//               <td className="p-2 border font-medium">Mode of Access</td>
//               <td className="p-2 border">
//                 {modeAccess || <span className="text-gray-500 italic">Not selected</span>}
//               </td>
//             </tr>
//           </tbody>
//         </table>
//       </div>

//       {/* --- Network Control Info --- */}
//       <div>
//         <h3 className="font-medium mb-1">Network Control</h3>
//         <table className="w-full border text-sm mt-2">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="p-2 border text-left">Default Policy</th>
//               <th className="p-2 border text-left">Exclusions</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td className="p-2 border">{defaultPolicy || "—"}</td>
//               <td className="p-2 border">
//                 {networkExclusions.length > 0 ? (
//                   <ul className="list-disc pl-5">
//                     {networkExclusions.map((item, i) => (
//                       <li key={i}>
//                         {item.url} → <strong>{item.action}</strong>
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <span className="text-gray-500 italic">No exclusions</span>
//                 )}
//               </td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//     {/* Selected IPs */}
//       <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
//         <h3 className="font-semibold text-blue-700 text-sm mb-1">Selected IP Addresses:</h3>
//         <div className="flex flex-wrap gap-2">
//           {selectedIPs.map((ip) => (
//             <span
//               key={ip}
//               className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
//             >
//               {ip}
//             </span>
//           ))}
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="flex border-b border-gray-300">
//         {tabs.map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`px-4 py-2 text-sm font-medium ${
//               activeTab === tab
//                 ? "bg-blue-600 text-white rounded-t-md"
//                 : "text-gray-600 hover:bg-gray-100"
//             }`}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       {renderContent()}

//       <div className="flex justify-between mt-6">
//         <button
//           onClick={prevTab}
//           disabled={activeTab === "General"}
//           className={`px-4 py-2 rounded-md border ${
//             activeTab === "General"
//               ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//               : "bg-gray-200 hover:bg-gray-300"
//           }`}
//         >
//           &lt; Previous
//         </button>

//         <button
//   onClick={activeTab === "Finish" ? handleSubmit : nextTab}
//   className={`px-4 py-2 rounded-md ${
//     activeTab === "Finish"
//       ? "bg-green-600 text-white hover:bg-green-700"
//       : "bg-blue-600 text-white hover:bg-blue-700"
//   }`}
// >
//   {activeTab === "Finish" ? "Deploy" : "Next >"}
// </button>
//       </div>
//     </div>
//   );
// }

// /* ---------------------- MODAL COMPONENT ---------------------- */
// function NetworkControlModal({ onClose, onSubmit }) {
//   const [active, setActive] = useState("url");
//   const [urlList, setUrlList] = useState([]);
//   const [url, setUrl] = useState("");
//   const [urlAction, setUrlAction] = useState("Allow");

//   const [category, setCategory] = useState("");
//   const [selectedSites, setSelectedSites] = useState({});
//   const categories = {
//     Gaming: ["steamcommunity.com", "epicgames.com", "roblox.com","	playstation.com"],
//     Shopping: ["amazon.com", "ebay.com", "flipkart.com",
//         "aliexpress.com"
//     ],
//     Social: ["facebook.com", "twitter.com", "instagram.com","tiktok.com"],
//     Streaming: ["youtube.com", "	netflix.com", "spotify.com","	twitch.tv"],
//     News: ["bbc.com","	cnn.com", "nytimes.com","	theguardian.com"],
//     USB: ["	SANDISK", "HP" ],
//     Other: ["	SANDISK", "HP" ],
//   };

//   const handleUrlAdd = () => {
//     if (!url.trim()) return;
//     setUrlList([...urlList, { url, action: urlAction }]);
//     setUrl("");
//   };

//   const handleCategorySubmit = () => {
//     const selected = Object.entries(selectedSites)
//       .filter(([_, checked]) => checked)
//       .map(([site]) => ({ url: site, action: "Block" }));
//     onSubmit(selected);
//     onClose();
//   };

//   const handleFinalSubmit = () => {
//     onSubmit(urlList);
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg shadow-lg w-[600px] max-h-[90vh] overflow-auto p-6">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-lg font-semibold">Add Exclusions</h2>
//           <button onClick={onClose} className="text-gray-500 hover:text-black">✕</button>
//         </div>

//         {/* Tabs */}
//         <div className="flex border-b mb-4">
//           <button
//             onClick={() => setActive("url")}
//             className={`px-4 py-2 text-sm font-medium ${
//               active === "url" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"
//             }`}
//           >
//             URL Wise
//           </button>
//           <button
//             onClick={() => setActive("category")}
//             className={`px-4 py-2 text-sm font-medium ${
//               active === "category" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"
//             }`}
//           >
//             Category Wise
//           </button>
//         </div>

//         {/* URL Wise Tab */}
//         {active === "url" && (
//           <div className="space-y-4">
//             <div className="flex gap-2">
//               <input
//                 type="text"
//                 placeholder="Enter URL"
//                 value={url}
//                 onChange={(e) => setUrl(e.target.value)}
//                 className="border rounded-md p-2 flex-1"
//               />
//               <select
//                 value={urlAction}
//                 onChange={(e) => setUrlAction(e.target.value)}
//                 className="border rounded-md p-2"
//               >
//                 <option>Allow</option>
//                 <option>Block</option>
//               </select>
//               <button
//                 onClick={handleUrlAdd}
//                 className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
//               >
//                 Add
//               </button>
//             </div>

//             {urlList.length > 0 && (
//               <table className="w-full border text-sm mt-2">
//                 <thead className="bg-gray-100">
//                   <tr>
//                     <th className="p-2 border">URL</th>
//                     <th className="p-2 border">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {urlList.map((item, i) => (
//                     <tr key={i}>
//                       <td className="p-2 border">{item.url}</td>
//                       <td className="p-2 border">{item.action}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//             <div className="flex justify-end">
//               <button
//                 onClick={handleFinalSubmit}
//                 className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
//               >
//                 Submit
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Category Wise Tab */}
//         {active === "category" && (
//           <div className="space-y-4">
//             <select
//               value={category}
//               onChange={(e) => setCategory(e.target.value)}
//               className="border rounded-md p-2 w-full"
//             >
//               <option value="">Select Category</option>
//               {Object.keys(categories).map((c) => (
//                 <option key={c}>{c}</option>
//               ))}
//             </select>

//             {category && (
//               <table className="w-full border text-sm mt-2">
//                 <thead className="bg-gray-100">
//                   <tr>
//                     <th className="p-2 border">Select</th>
//                     <th className="p-2 border">Website</th>
//                     <th className="p-2 border">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {categories[category].map((site) => (
//                     <tr key={site}>
//                       <td className="p-2 border text-center">
//                         <input
//                           type="checkbox"
//                           checked={selectedSites[site] || false}
//                           onChange={(e) =>
//                             setSelectedSites({ ...selectedSites, [site]: e.target.checked })
//                           }
//                         />
//                       </td>
//                       <td className="p-2 border">{site}</td>
//                       <td className="p-2 border">Block</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}

//             <div className="flex justify-end">
//               <button
//                 onClick={handleCategorySubmit}
//                 className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
//               >
//                 Submit
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// from mayank ui merge

import React, { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function PolicySetup() {
  const [activeTab, setActiveTab] = useState("General");
  const [enabled, setEnabled] = useState(true);
  const [policyName, setPolicyName] = useState("USB Device Policy");
  const [description, setDescription] = useState("");
  const [ruleNameType, setRuleNameType] = useState("policy");
  const [customRuleName, setCustomRuleName] = useState("");
  const [customRuleDescription, setCustomRuleDescription] = useState("");
  const location = useLocation();
  const [selectedIPs] = useState(location.state?.selectedIPs || []);
  const [deviceType, setDeviceType] = useState("");
  const [modeAccess, setModeAccess] = useState("");
  const [defaultPolicy, setDefaultPolicy] = useState("");
  const [showNetworkModal, setShowNetworkModal] = useState(false);

  const navigate = useNavigate();
  const tabs = ["General", "Storage Device Control", "Finish"];

  const nextTab = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1]);
  };

  const prevTab = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) setActiveTab(tabs[currentIndex - 1]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "General":
        return (
          <div className="bg-gray-800 shadow-md rounded-lg p-6 mt-4">
            <h2 className="text-lg font-semibold mb-4 text-white">
              General Policy
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              Supply a name and description for this policy :
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-300">
                Policy name:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={policyName}
                  onChange={(e) => setPolicyName(e.target.value)}
                  className="border border-gray-600 rounded-md p-2 w-full bg-gray-700 text-white h-9"
                />
                <label className="flex items-center gap-1 text-sm text-gray-200">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={() => setEnabled(!enabled)}
                  />
                  Enabled
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-300">
                Description:
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                // className="border border-gray-600 rounded-md p-2 w-full bg-gray-700 text-white h-9"
                className="border border-gray-600 rounded-md p-2 w-full bg-gray-700 text-white min-h-[80px]"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-300">
                Policy owners:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value="None"
                  readOnly
                  className="border border-gray-600 rounded-md p-2 w-full bg-gray-600 text-gray-300 h-9"
                />
                <button className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">
                  Edit
                </button>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm text-gray-200 font-bold mb-2">
                A rule will be created for this policy. Indicate what you want
                the name to be:
              </p>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input
                    type="radio"
                    checked={ruleNameType === "policy"}
                    onChange={() => setRuleNameType("policy")}
                  />
                  Use the policy name for the rule name
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input
                    type="radio"
                    checked={ruleNameType === "custom"}
                    onChange={() => setRuleNameType("custom")}
                  />
                  Use a custom name for the rule
                </label>
              </div>

              {ruleNameType === "custom" && (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">
                      Rule name:
                    </label>
                    <input
                      type="text"
                      value={customRuleName}
                      onChange={(e) => setCustomRuleName(e.target.value)}
                      className="border border-gray-600 rounded-md p-2 w-full bg-gray-700 text-white h-9"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">
                      Description:
                    </label>
                    <textarea
                      value={customRuleDescription}
                      onChange={(e) => setCustomRuleDescription(e.target.value)}
                      // className="border border-gray-600 rounded-md p-2 w-full bg-gray-700 text-white h-9"
                      className="border border-gray-600 rounded-md p-2 w-full bg-gray-700 text-white min-h-[80px]"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case "Storage Device Control":
        return (
          <div className="bg-gray-800 shadow-md rounded-lg p-6 mt-4">
            <h2 className="text-lg font-semibold mb-4 text-white">
              External USB
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  Device Type
                </label>
                <select
                  value={deviceType}
                  onChange={(e) => setDeviceType(e.target.value)}
                  className="border border-gray-600 rounded-md p-2 w-full bg-gray-700 text-white h-9"
                >
                  <option value="">Select Device</option>
                  <option value="USB Storage">USB Storage</option>
                  <option value="External HDD">MTP</option>
                  <option value="Card Reader">CD-DVD</option>
                  <option value="Card Reader">Bluetooth</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  Mode of Access
                </label>
                <select
                  value={modeAccess}
                  onChange={(e) => setModeAccess(e.target.value)}
                  className="border border-gray-600 rounded-md p-2 w-full bg-gray-700 text-white h-9"
                >
                  <option value="">Select Mode</option>
                  <option value="Read Only">Allow</option>
                  <option value="Read/Write">Prevent</option>
                  <option value="Blocked">Detect</option>
                </select>
              </div>
            </div>
          </div>
        );

      case "Finish":
        return (
          <div className="bg-gray-800 shadow-md rounded-lg p-6 mt-4">
            <h2 className="text-lg font-semibold text-gray-200">
              Review Policy Summary
            </h2>

            {/* --- General Info --- */}
            <div>
              <h3 className="font-medium mb-1 text-gray-300">
                General Information
              </h3>
              <table className="w-full border border-gray-600 text-sm mt-2 bg-gray-700">
                <tbody>
                  <tr>
                    <td className="p-2 border border-gray-600 font-medium text-gray-300 bg-gray-750">
                      Policy Name
                    </td>
                    <td className="p-2 border border-gray-600 text-white">
                      {policyName}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-gray-600 font-medium text-gray-300 bg-gray-750">
                      Description
                    </td>
                    <td className="p-2 border border-gray-600 text-white">
                      {description || (
                        <span className="text-gray-500 italic">
                          No description
                        </span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-gray-600 font-medium text-gray-300 bg-gray-750">
                      Enabled
                    </td>
                    <td className="p-2 border border-gray-600 text-white">
                      {enabled ? "Yes" : "No"}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-gray-600 font-medium text-gray-300 bg-gray-750">
                      Rule Type
                    </td>
                    <td className="p-2 border border-gray-600 text-white">
                      {ruleNameType === "custom"
                        ? `Custom Rule: ${customRuleName || "Unnamed"}`
                        : "Uses Policy Name"}
                    </td>
                  </tr>
                  {ruleNameType === "custom" && (
                    <tr>
                      <td className="p-2 border border-gray-600 font-medium text-gray-300 bg-gray-750">
                        Rule Description
                      </td>
                      <td className="p-2 border border-gray-600 text-white">
                        {customRuleDescription || (
                          <span className="text-gray-500 italic">
                            No description
                          </span>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* --- Storage Device Info --- */}
            <div>
              <h3 className="font-medium mb-1 text-gray-200">
                Storage Device Control
              </h3>
              <table className="w-full border border-gray-600 text-sm mt-2 bg-gray-700">
                <tbody>
                  <tr>
                    <td className="p-2 border border-gray-600 font-medium text-gray-300 bg-gray-750">
                      Device Type
                    </td>
                    <td className="p-2 border border-gray-600 text-white">
                      {deviceType || (
                        <span className="text-gray-500 italic">
                          Not selected
                        </span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-gray-600 font-medium text-gray-300 bg-gray-750">
                      Mode of Access
                    </td>
                    <td className="p-2 border border-gray-600 text-white">
                      {modeAccess || (
                        <span className="text-gray-500 italic">
                          Not selected
                        </span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-900 min-h-screen">
      {/* Selected IPs */}
      {/* <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
        <h3 className="font-semibold text-blue-700 text-sm mb-1">
          Selected IP Addresses:
        </h3>
        <div className="flex flex-wrap gap-2">
          {selectedIPs.map((ip) => (
            <span
              key={ip}
              className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
            >
              {ip}
            </span>
          ))}
        </div>
      </div> */}

      <div className="bg-gray-800 border border-gray-600 rounded-md p-3 mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-300 text-sm">
          Selected IP Addresses:{" "}
          <span className="text-cyan-400">{selectedIPs.length}</span>
        </h3>
        <button
          onClick={() => setShowNetworkModal(true)}
          className="bg-cyan-600 text-white px-4 py-1.5 rounded-md hover:bg-cyan-500 text-sm"
        >
          View IPs
        </button>
      </div>
      {/* Tabs */}
      <div className="flex border border-gray-500 justify-between">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 flex justify-center text-sm font-medium cursor-pointer w-full border-x border-gray-600 ${
              activeTab === tab
                ? "bg-blue-600 text-white rounded-t-xs"
                : "text-gray-400 hover:bg-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {renderContent()}

      <div className="flex justify-between mt-6 cursor-pointer">
        <button
          onClick={prevTab}
          disabled={activeTab === "General"}
          className={`px-4 py-2 rounded-md border ${
            activeTab === "General"
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          &lt; Previous
        </button>
        <button
          onClick={async () => {
            if (activeTab === "Finish") {
              const submittedData = {
                policyName,
                description,
                enabled,
                ruleNameType,
                customRuleName,
                customRuleDescription,
                deviceType,
                modeAccess,
                defaultPolicy,
                selectedIPs,
              };

              try {
                console.log("Submitting Policy Data:", submittedData);

                const response = await axios.post(
                  "http://192.168.0.139:3000/api/policies",
                  submittedData,
                  { headers: { "Content-Type": "application/json" } }
                );

                console.log("API Response:", response.data);
                alert(" Policy deployed successfully!");
                // to do
                navigate("/dashboard/reports");
              } catch (error) {
                console.error("Error submitting policy:", error);
                alert(" Failed to deploy policy. Check console for details.");
              }
            } else {
              nextTab();
            }
          }}
          className={`px-4 py-2 rounded-md cursor-pointer ${
            activeTab === "Finish"
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-cyan-600 text-white hover:bg-cyan-500"
          }`}
        >
          {activeTab === "Finish" ? "Deploy" : "Next >"}
        </button>
      </div>

      {showNetworkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-600">
            <h3 className="text-lg font-semibold mb-4 text-white">
              Selected IP Addresses
            </h3>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {selectedIPs.map((ip) => (
                <div
                  key={ip}
                  className="bg-gray-700 text-white px-3 py-2 rounded-md text-sm"
                >
                  {ip}
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowNetworkModal(false)}
              className="mt-4 w-full bg-cyan-600 text-white py-2 rounded-md hover:bg-cyan-500"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
