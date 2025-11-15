// import React, { useEffect, useState } from "react";
// import { Search, Filter, X, ChevronDown } from "lucide-react";
// import { useNavigate, useLocation } from "react-router-dom";
// import toast from "react-hot-toast";

// export default function CreateGroup() {
//   const [devices, setDevices] = useState([]);
//   const [selectedDevices, setSelectedDevices] = useState([]);
//   const [search, setSearch] = useState("");
//   const [group, setGroup] = useState({ name: "", description: "" });
//   const [filterCategory, setFilterCategory] = useState("");
//   const [filterValue, setFilterValue] = useState("");
//   const [existingGroupDevices, setExistingGroupDevices] = useState([]);
//   const [isManageMode, setIsManageMode] = useState(false);

//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     if (location.state) {
//       const { isManageMode, groupId, groupName, groupDescription } = location.state;
//       setIsManageMode(isManageMode);
      
//       if (isManageMode) {
//         setGroup({ 
//           name: groupName, 
//           description: groupDescription 
//         });
        
//         // Load existing devices for this group
//         loadExistingGroupDevices(groupId);
//       }
//     }
//   }, [location.state]);

// const loadExistingGroupDevices = async (groupId) => {
//   try {
//     const res = await fetch(`http://192.168.0.196:5000/api/groups/${groupId}/devices`);
//     const groupDevices = await res.json();
//     setExistingGroupDevices(groupDevices);
    
//     // Map group devices to original device IDs
//     const existingDeviceIds = groupDevices.map(device => {
//       // Convert device.id to string to handle both string and number IDs
//       const deviceIdStr = String(device.id);
      
//       // If device has originalDeviceId, use that
//       if (device.originalDeviceId) {
//         return String(device.originalDeviceId);
//       }
      
      
//       const idParts = deviceIdStr.split('-');
//       if (idParts.length > 1) {
//         return idParts[1]; 
//       }
      
//       return deviceIdStr;
//     });
    
//     console.log("Existing device IDs:", existingDeviceIds);
//     setSelectedDevices(existingDeviceIds);
//   } catch (err) {
//     console.error("Failed to load group devices", err);
//   }
// };

//   useEffect(() => {
//     fetch("http://192.168.0.196:5000/api/devices")
//       .then((res) => res.json())
//       .then((data) => setDevices(data))
//       .catch((err) => console.error("Failed to load devices", err));
//   }, []);

//   const toggleSelect = (id) => {
//     setSelectedDevices((prev) =>
//       prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
//     );
//   };

  
//   const getFilterOptions = () => {
//     if (!filterCategory) return [];

//     const uniqueValues = [...new Set(devices.map((d) => d[filterCategory]))];
//     return uniqueValues.filter(Boolean).sort();
//   };

//   const filteredDevices = devices.filter((d) => {
//     const matchesSearch =
//       d.name.toLowerCase().includes(search.toLowerCase()) ||
//       d.ip.toLowerCase().includes(search.toLowerCase()) ||
//       d.location.toLowerCase().includes(search.toLowerCase());

//     const matchesFilter =
//       !filterCategory || !filterValue || d[filterCategory] === filterValue;

//     return matchesSearch && matchesFilter;
//   });

//   const clearFilters = () => {
//     setFilterCategory("");
//     setFilterValue("");
//     setSearch("");
//   };

//   const handleSaveGroup = async () => {
//     if (isManageMode) {
//       await handleUpdateGroup();
//     } else {
//       await handleCreateGroup();
//     }
//   };

//   const handleCreateGroup = async () => {
//     if (!group.name) {
//       alert("Please provide a group name");
//       return;
//     }

//     const groupId = Date.now();
//     const groupRecord = {
//       id: groupId,
//       name: group.name,
//       description: group.description,
//       parentId: null,
//       createdAt: new Date().toISOString(),
//       type: "group"
//     };

//     const deviceRelationships = selectedDevices.map(deviceId => {
//       const device = devices.find(d => d.id === deviceId);
//       return {
//         ...device,
//         id: `${groupId}-${deviceId}`,
//         parentId: groupId,
//         originalDeviceId: deviceId,
//         type: "groupDevice"
//       };
//     });

//     const payload = [groupRecord, ...deviceRelationships];

//     try {
//       const res = await fetch("http://192.168.0.196:5000/api/groups", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const err = await res.json();
//         throw new Error(err.error || "Create group failed");
//       }

//       const result = await res.json();
//       console.log("Group created successfully:", result);

//       toast.success("Group created successfully!");
//       navigate("/dashboard/GroupList");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to create group: " + err.message);
//     }
//   };

// const handleUpdateGroup = async () => {
//   const { groupId } = location.state;

//   try {
//     // Convert all IDs to strings for consistent comparison
//     const selectedDeviceIds = selectedDevices.map(id => String(id));
    
// // Add this right after your existing console.log statements
// console.log("Detailed device ID comparison:");
// devices.forEach(device => {
//   console.log(`Device: ${device.name}, ID: ${device.id}, Type: ${typeof device.id}, String: "${String(device.id)}"`);
// });

// // Find devices to remove (in group but not in selected)
// const devicesToRemove = existingGroupDevices.filter(device => {
//   const deviceIdStr = String(device.id);
//   const deviceOriginalId = device.originalDeviceId 
//     ? String(device.originalDeviceId)  // Keep as string to match selectedDeviceIds
//     : deviceIdStr.split('-')[1] || deviceIdStr;
  
//   console.log(`Comparing: deviceOriginalId="${deviceOriginalId}" vs selectedDeviceIds=`, selectedDeviceIds);
//   const shouldRemove = !selectedDeviceIds.includes(deviceOriginalId);
//   console.log(`Should remove device ${device.id}: ${shouldRemove}`);
  
//   return shouldRemove;
// });
//     // Find devices to add (in selected but not in group)
//     const devicesToAdd = selectedDeviceIds.filter(deviceId => {
//       return !existingGroupDevices.some(device => {
//         const deviceIdStr = String(device.id);
//         const deviceOriginalId = device.originalDeviceId 
//           ? String(device.originalDeviceId)
//           : deviceIdStr.split('-')[1] || deviceIdStr;
        
//         return deviceOriginalId === deviceId;
//       });
//     });

//  console.log("Final devices to remove:", devicesToRemove.map(d => ({
//   id: d.id,
//   originalDeviceId: d.originalDeviceId,
//   name: d.name
// })));

// console.log("Devices to remove with full details:", devicesToRemove.map(d => ({
//   relationshipId: d.id, // This should be used for DELETE
//   originalDeviceId: d.originalDeviceId,
//   name: d.name
// })));

// // Remove devices that are no longer selected
// for (const device of devicesToRemove) {
//   const childId = `${groupId}-${device.id}`;

// const url = `http://192.168.0.196:5000/api/groups/${groupId}/devices/${childId}`;
// console.log("url for delete ",url);


//   await fetch(url, {
//     method: "DELETE"
//   });
// }




//     // Add newly selected devices
//     for (const deviceId of devicesToAdd) {
//       const device = devices.find(d => String(d.id) === deviceId);
//       if (device) {
//         await fetch(`http://192.168.0.196:5000/api/groups/${groupId}/devices`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             ...device,
//             originalDeviceId: device.id 
//           })
//         });2
//       }
//     }

//     toast.success("Group updated successfully!");
//     navigate("/dashboard/GroupList");
//   } catch (err) {
//     console.error(err);
//     alert("Failed to update group: " + err.message);
//   }
// };

// useEffect(() => {
//   console.log("Selected devices:", selectedDevices);
//   console.log("All devices:", devices.map(d => ({ id: d.id, name: d.name })));
//   console.log("Existing group devices:", existingGroupDevices);
// }, [selectedDevices, devices, existingGroupDevices]);

//   return (
//     <div className="min-h-screen bg-gray-950 text-gray-100 p-6 space-y-6">
//       <h1 className="text-xl font-semibold mb-2">
//         {isManageMode ? "Manage Device Group" : "Create Device Group"}
//       </h1>

//       {/* Group Info */}
//       <div className="bg-gray-900 rounded-2xl p-5 mx-9 shadow">
//         <h2 className="flex items-center gap-2 text-lg font-medium mb-3">
//           <span>🗂️ Group Information</span>
//         </h2>
//         <p className="text-sm text-gray-400 mb-4">
//           {isManageMode 
//             ? "Manage devices in your existing group" 
//             : "Enter the basic information for your device group"
//           }
//         </p>

//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm mb-1">Group Name</label>
//             {isManageMode ? (
//               <div className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-sm">
//                 <p className="text-gray-100">{group.name}</p>
//               </div>
//             ) : (
//               <input
//                 type="text"
//                 placeholder="Enter group name"
//                 value={group.name}
//                 onChange={(e) => setGroup({ ...group, name: e.target.value })}
//                 className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-600"
//               />
//             )}
//           </div>

//           <div>
//             <label className="block text-sm mb-1">Description</label>
//             {isManageMode ? (
//               <div className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-sm min-h-[40px]">
//                 <p className="text-gray-100">{group.description || "No description"}</p>
//               </div>
//             ) : (
//               <textarea
//                 placeholder="Enter group description"
//                 value={group.description}
//                 onChange={(e) => setGroup({ ...group, description: e.target.value })}
//                 className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-600 h-10"
//               />
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Select Devices */}
//       <div className="bg-gray-900 rounded-2xl p-5 mx-8 shadow">
//         <h2 className="flex items-center gap-2 text-lg font-medium mb-3">
//           <Filter className="w-4 h-4" /> 
//           {isManageMode ? "Manage Devices in Group" : "Select Devices"}
//         </h2>
//         <p className="text-sm text-gray-400 mb-4">
//           {isManageMode 
//             ? "Add or remove devices from this group" 
//             : "Filter and select devices to add to this group"
//           }
//         </p>

//         {/* Filter Controls */}
//         <div className="flex flex-wrap gap-3 mb-4">
//           {/* Filter Category Dropdown */}
//           <div className="relative flex-1 min-w-[200px]">
//             <select
//               value={filterCategory}
//               onChange={(e) => {
//                 setFilterCategory(e.target.value);
//                 setFilterValue("");
//               }}
//               className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-sm appearance-none pr-8 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all cursor-pointer hover:border-gray-600"
//             >
//               <option value="">Select Filter Category</option>
//               <option value="branch">Branch</option>
//               <option value="os">Operating System</option>
//               <option value="status">Status</option>
//               <option value="location">Location</option>
//             </select>
//             <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
//           </div>

//           {/* Filter Value Dropdown */}
//           {filterCategory && (
//             <div className="relative flex-1 min-w-[200px] animate-fadeIn">
//               <select
//                 value={filterValue}
//                 onChange={(e) => setFilterValue(e.target.value)}
//                 className="w-full bg-gradient-to-r from-blue-900/30 to-blue-800/30 border border-blue-700/50 rounded-lg p-2.5 text-sm appearance-none pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer hover:border-blue-600/70 text-gray-100"
//                 style={{ colorScheme: "dark" }}
//               >
//                 <option value="" className="bg-gray-800 text-gray-100">
//                   All {filterCategory.charAt(0).toUpperCase() + filterCategory.slice(1)}s
//                 </option>
//                 {getFilterOptions().map((option) => (
//                   <option key={option} value={option} className="bg-gray-800 text-gray-100 py-2">
//                     {option}
//                   </option>
//                 ))}
//               </select>
//               <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400 pointer-events-none" />
//             </div>
//           )}

//           {/* Clear Filters Button */}
//           {(filterCategory || search) && (
//             <button
//               onClick={clearFilters}
//               className="flex items-center gap-2 px-4 py-2.5 bg-red-600/20 hover:bg-red-600/30 border border-red-600/40 text-red-400 rounded-lg transition-all text-sm font-medium hover:scale-105 active:scale-95 animate-fadeIn"
//             >
//               <X className="w-4 h-4" />
//               Clear Filters
//             </button>
//           )}
//         </div>

//         {/* Search */}
//         <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg mb-4 px-2 focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-transparent transition-all">
//           <Search className="w-4 h-4 text-gray-400 mr-2" />
//           <input
//             type="text"
//             placeholder="Search devices by name, IP, or location..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="bg-transparent w-full py-2 text-sm focus:outline-none"
//           />
//           {search && (
//             <button
//               onClick={() => setSearch("")}
//               className="ml-2 text-gray-400 hover:text-gray-200 transition-colors"
//             >
//               <X className="w-4 h-4" />
//             </button>
//           )}
//         </div>

//         {/* Active Filter Badge */}
//         {filterCategory && filterValue && (
//           <div className="mb-4 flex items-center gap-2 animate-fadeIn">
//             <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600/20 border border-blue-600/40 text-blue-300 rounded-full text-xs font-medium">
//               <Filter className="w-3 h-3" />
//               {filterCategory.charAt(0).toUpperCase() + filterCategory.slice(1)}: {filterValue}
//               <button
//                 onClick={() => setFilterValue("")}
//                 className="ml-1 hover:bg-blue-600/30 rounded-full p-0.5 transition-colors"
//               >
//                 <X className="w-3 h-3" />
//               </button>
//             </span>
//           </div>
//         )}

//         {/* Table */}
//         <div className="overflow-auto border border-gray-800 rounded-lg">
//           <table className="w-full text-sm">
//             <thead className="bg-gray-800 text-gray-300">
//               <tr>
//                 <th className="p-2 w-8"></th>
//                 <th className="p-2 text-left">Device Name</th>
//                 <th className="p-2 text-left">IP Address</th>
//                 <th className="p-2 text-left">Location</th>
//                 <th className="p-2 text-left">Branch</th>
//                 <th className="p-2 text-left">OS</th>
//                 <th className="p-2 text-left">Status</th>
//                 {isManageMode && <th className="p-2 text-left">In Group</th>}
//               </tr>
//             </thead>
//             <tbody>
//              {filteredDevices.map((d) => {
//   // Convert current device ID to string
//   const currentDeviceId = String(d.id);
  
//   const isCurrentlyInGroup = existingGroupDevices.some(gd => {
//     // Convert group device ID to string
//     const groupDeviceIdStr = String(gd.id);
//     const groupDeviceOriginalId = gd.originalDeviceId 
//       ? String(gd.originalDeviceId)
//       : groupDeviceIdStr.split('-')[1] || groupDeviceIdStr;
    
//     return groupDeviceOriginalId === currentDeviceId;
//   });

//   const isSelected = selectedDevices.includes(currentDeviceId);
  
//   console.log(`Device ${d.name} (${currentDeviceId}): inGroup=${isCurrentlyInGroup}, selected=${isSelected}`);
  
//   return (
//     <tr
//       key={d.id}
//       className="border-t border-gray-800 hover:bg-gray-800/60 transition-colors"
//     >
//       <td className="p-2 text-center">
//         <input
//           type="checkbox"
//           checked={isSelected}
//           onChange={() => toggleSelect(currentDeviceId)}
//           className="accent-blue-600 w-4 h-4 cursor-pointer"
//         />
//       </td>
//       <td className="p-2 font-medium">{d.name}</td>
//       <td className="p-2 text-gray-400">{d.ip}</td>
//       <td className="p-2">{d.location}</td>
//       <td className="p-2">{d.branch}</td>
//       <td className="p-2">{d.os}</td>
//       <td className="p-2">
//         <span
//           className={`px-2 py-1 text-xs font-medium rounded-full ${
//             d.status === "Online"
//               ? "bg-green-500/20 text-green-400 border border-green-500/30"
//               : d.status === "Offline"
//               ? "bg-red-500/20 text-red-400 border border-red-500/30"
//               : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
//           }`}
//         >
//           {d.status}
//         </span>
//       </td>
//       {isManageMode && (
//         <td className="p-2">
//           <span
//             className={`px-2 py-1 text-xs font-medium rounded-full ${
//               isCurrentlyInGroup
//                 ? "bg-green-500/20 text-green-400 border border-green-500/30"
//                 : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
//             }`}
//           >
//             {isCurrentlyInGroup ? "Yes" : "No"}
//           </span>
//         </td>
//       )}
//     </tr>
//   );
// })}: (
//                 <tr>
//                   <td colSpan={isManageMode ? 8 : 7} className="p-8 text-center text-gray-500">
//                     <div className="flex flex-col items-center gap-2">
//                       <Filter className="w-8 h-8 opacity-50" />
//                       <p>No devices found matching your filters</p>
//                       {(filterCategory || search) && (
//                         <button
//                           onClick={clearFilters}
//                           className="text-blue-400 hover:text-blue-300 text-sm underline mt-2"
//                         >
//                           Clear all filters
//                         </button>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               )
//             </tbody>
//           </table>
//         </div>

//         <div className="flex items-center justify-between mt-3">
//           <p className="text-sm text-gray-400">
//             {selectedDevices.length} device(s) selected
//             {isManageMode && ` (${existingGroupDevices.length} currently in group)`}
//           </p>
//           <p className="text-xs text-gray-500">
//             Showing {filteredDevices.length} of {devices.length} devices
//           </p>
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div className="flex justify-end gap-3">
//         <button 
//           onClick={() => navigate("/dashboard/GroupList")}
//           className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all hover:scale-105 active:scale-95"
//         >
//           Cancel
//         </button>

//         <button
//           onClick={handleSaveGroup}
//           className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-600/30"
//         >
//           {isManageMode ? "Update Group" : "Create Group"}
//         </button>
//       </div>
//     </div>
//   );
// }








import React, { useEffect, useState } from "react";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

export default function CreateGroup() {
  const [devices, setDevices] = useState([]);
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState({ name: "", description: "" });
  const [filterCategory, setFilterCategory] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [existingGroupDevices, setExistingGroupDevices] = useState([]);
  const [isManageMode, setIsManageMode] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      const { isManageMode, groupId, groupName, groupDescription } = location.state;
      setIsManageMode(isManageMode);
      
      if (isManageMode) {
        setGroup({ 
          name: groupName, 
          description: groupDescription 
        });
        
        loadExistingGroupDevices(groupId);
      }
    }
  }, [location.state]);

  const loadExistingGroupDevices = async (groupId) => {
    try {
      const res = await fetch(`http://192.168.0.196:5000/api/groups/${groupId}/devices`);
      const groupDevices = await res.json();
      setExistingGroupDevices(groupDevices);
      
      const existingDeviceIds = groupDevices.map(device => {
        const deviceIdStr = String(device.id);
        
        if (device.originalDeviceId) {
          return String(device.originalDeviceId);
        }
        
        const idParts = deviceIdStr.split('-');
        if (idParts.length > 1) {
          return idParts[1]; 
        }
        
        return deviceIdStr;
      });
      
      console.log("Existing device IDs:", existingDeviceIds);
      setSelectedDevices(existingDeviceIds);
    } catch (err) {
      console.error("Failed to load group devices", err);
    }
  };

  useEffect(() => {
    fetch("http://192.168.0.196:5000/api/devices")
      .then((res) => res.json())
      .then((data) => setDevices(data))
      .catch((err) => console.error("Failed to load devices", err));
  }, []);

  const toggleSelect = (id) => {
    setSelectedDevices((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const getFilterOptions = () => {
    if (!filterCategory) return [];
    const uniqueValues = [...new Set(devices.map((d) => d[filterCategory]))];
    return uniqueValues.filter(Boolean).sort();
  };

  const filteredDevices = devices.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.ip.toLowerCase().includes(search.toLowerCase()) ||
      d.location.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      !filterCategory || !filterValue || d[filterCategory] === filterValue;

    return matchesSearch && matchesFilter;
  });

  const clearFilters = () => {
    setFilterCategory("");
    setFilterValue("");
    setSearch("");
  };

  const handleSaveGroup = async () => {
    if (isManageMode) {
      await handleUpdateGroup();
    } else {
      await handleCreateGroup();
    }
  };

  const handleCreateGroup = async () => {
    if (!group.name) {
      alert("Please provide a group name");
      return;
    }

    const groupId = Date.now();
    const groupRecord = {
      id: groupId,
      name: group.name,
      description: group.description,
      parentId: null,
      createdAt: new Date().toISOString(),
      type: "group"
    };

    const deviceRelationships = selectedDevices.map(deviceId => {
      const device = devices.find(d => d.id === deviceId);
      return {
        ...device,
        id: `${groupId}-${deviceId}`,
        parentId: groupId,
        originalDeviceId: deviceId,
        type: "groupDevice"
      };
    });

    const payload = [groupRecord, ...deviceRelationships];

    try {
      const res = await fetch("http://192.168.0.196:5000/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Create group failed");
      }

      const result = await res.json();
      console.log("Group created successfully:", result);

      toast.success("Group created successfully!");
      navigate("/dashboard/GroupList");
    } catch (err) {
      console.error(err);
      alert("Failed to create group: " + err.message);
    }
  };

  const handleUpdateGroup = async () => {
    const { groupId } = location.state;

    try {
      const selectedDeviceIds = selectedDevices.map(id => String(id));
      
      console.log("Detailed device ID comparison:");
      devices.forEach(device => {
        console.log(`Device: ${device.name}, ID: ${device.id}, Type: ${typeof device.id}, String: "${String(device.id)}"`);
      });

      const devicesToRemove = existingGroupDevices.filter(device => {
        const deviceIdStr = String(device.id);
        const deviceOriginalId = device.originalDeviceId 
          ? String(device.originalDeviceId)
          : deviceIdStr.split('-')[1] || deviceIdStr;
        
        console.log(`Comparing: deviceOriginalId="${deviceOriginalId}" vs selectedDeviceIds=`, selectedDeviceIds);
        const shouldRemove = !selectedDeviceIds.includes(deviceOriginalId);
        console.log(`Should remove device ${device.id}: ${shouldRemove}`);
        
        return shouldRemove;
      });

      const devicesToAdd = selectedDeviceIds.filter(deviceId => {
        return !existingGroupDevices.some(device => {
          const deviceIdStr = String(device.id);
          const deviceOriginalId = device.originalDeviceId 
            ? String(device.originalDeviceId)
            : deviceIdStr.split('-')[1] || deviceIdStr;
          
          return deviceOriginalId === deviceId;
        });
      });

      console.log("Final devices to remove:", devicesToRemove.map(d => ({
        id: d.id,
        originalDeviceId: d.originalDeviceId,
        name: d.name
      })));

      console.log("Devices to remove with full details:", devicesToRemove.map(d => ({
        relationshipId: d.id,
        originalDeviceId: d.originalDeviceId,
        name: d.name
      })));

      for (const device of devicesToRemove) {
        const childId = `${groupId}-${device.id}`;
        const url = `http://192.168.0.196:5000/api/groups/${groupId}/devices/${childId}`;
        console.log("url for delete ", url);

        await fetch(url, {
          method: "DELETE"
        });
      }

      for (const deviceId of devicesToAdd) {
        const device = devices.find(d => String(d.id) === deviceId);
        if (device) {
          await fetch(`http://192.168.0.196:5000/api/groups/${groupId}/devices`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...device,
              originalDeviceId: device.id 
            })
          });
        }
      }

      toast.success("Group updated successfully!");
      navigate("/dashboard/GroupList");
    } catch (err) {
      console.error(err);
      alert("Failed to update group: " + err.message);
    }
  };

  useEffect(() => {
    console.log("Selected devices:", selectedDevices);
    console.log("All devices:", devices.map(d => ({ id: d.id, name: d.name })));
    console.log("Existing group devices:", existingGroupDevices);
  }, [selectedDevices, devices, existingGroupDevices]);
const toggleSelectAll = () => {
  if (selectedDevices.length === filteredDevices.length) {
    // If all are selected, deselect all
    setSelectedDevices([]);
  } else {
    // Select all filtered devices
    const allFilteredDeviceIds = filteredDevices.map(d => String(d.id));
    setSelectedDevices(allFilteredDeviceIds);
  }
};
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6 space-y-6">
      <h1 className="text-xl font-semibold mb-2">
        {isManageMode ? "Manage Device Group" : "Create Device Group"}
      </h1>

      {/* Group Info */}
    <div className="bg-gray-900 rounded-xl p-4 mx-9 shadow">
  <h2 className="flex items-center gap-2 text-base font-medium mb-2">
    <span>🗂️ Group Information</span>
  </h2>
  <p className="text-xs text-gray-400 mb-3">
    {isManageMode 
      ? "Manage devices in your existing group" 
      : "Enter the basic information for your device group"
    }
  </p>

  <div className="flex gap-3">
    <div className="w-64">
      <label className="block text-xs text-gray-400 mb-1.5">Group Name</label>
      {isManageMode ? (
        <div className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm">
          <p className="text-gray-100">{group.name}</p>
        </div>
      ) : (
        <input
          type="text"
          placeholder="Enter group name"
          value={group.name}
          onChange={(e) => setGroup({ ...group, name: e.target.value })}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      )}
    </div>

    <div className="w-80">
      <label className="block text-xs text-gray-400 mb-1.5">Description</label>
      {isManageMode ? (
        <div className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm min-h-[34px] flex items-center">
          <p className="text-gray-100">{group.description || "No description"}</p>
        </div>
      ) : (
        <input
          type="text"
          placeholder="Enter group description"
          value={group.description}
          onChange={(e) => setGroup({ ...group, description: e.target.value })}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      )}
    </div>
  </div>
</div>

      {/* Select Devices */}
      <div className="bg-gray-900 rounded-2xl p-5 mx-8 shadow">
        <h2 className="flex items-center gap-2 text-lg font-medium mb-3">
          <Filter className="w-4 h-4" /> 
          {isManageMode ? "Manage Devices in Group" : "Select Devices"}
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          {isManageMode 
            ? "Add or remove devices from this group" 
            : "Filter and select devices to add to this group"
          }
        </p>

       <div className="flex items-center gap-3 mb-4">

         <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg px-2 focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-transparent transition-all flex-1 min-w-[250px]">
    <Search className="w-4 h-4 text-gray-400 mr-2" />
    <input
      type="text"
      placeholder="Search devices by name, IP, or location..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="bg-transparent w-full py-2 text-sm focus:outline-none"
    />
    {search && (
      <button
        onClick={() => setSearch("")}
        className="ml-2 text-gray-400 hover:text-gray-200 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    )}
  </div>
  <div className="relative flex-1 min-w-[100px]">
    <select
      value={filterCategory}
      onChange={(e) => {
        setFilterCategory(e.target.value);
        setFilterValue("");
      }}
      className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-sm appearance-none pr-8 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all cursor-pointer hover:border-gray-600"
    >
      <option value="">Select Filter Category</option>
      <option value="branch">Branch</option>
      <option value="os">Operating System</option>
      <option value="status">Status</option>
      <option value="location">Location</option>
    </select>
    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
  </div>
  

  {filterCategory && (
    <div className="relative flex-1 min-w-[200px] animate-fadeIn">
      <select
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
        className="w-full bg-gradient-to-r from-blue-900/30 to-blue-800/30 border border-blue-700/50 rounded-lg p-2.5 text-sm appearance-none pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer hover:border-blue-600/70 text-gray-100"
        style={{ colorScheme: "dark" }}
      >
        <option value="" className="bg-gray-800 text-gray-100">
          All {filterCategory.charAt(0).toUpperCase() + filterCategory.slice(1)}s
        </option>
        {getFilterOptions().map((option) => (
          <option key={option} value={option} className="bg-gray-800 text-gray-100 py-2">
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400 pointer-events-none" />
    </div>
  )}

 {filterCategory && ( <button
    onClick={clearFilters}
    className="flex items-center gap-2 px-4 py-2.5 bg-red-600/20 hover:bg-red-600/30 border border-red-600/40 text-red-400 rounded-lg transition-all text-sm font-medium hover:scale-105 active:scale-95 whitespace-nowrap"
  >
    <X className="w-4 h-4" />
    Clear Filters
  </button>)}

 
</div>

        {/* Active Filter Badge */}
        {filterCategory && filterValue && (
          <div className="mb-4 flex items-center gap-2 animate-fadeIn">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600/20 border border-blue-600/40 text-blue-300 rounded-full text-xs font-medium">
              <Filter className="w-3 h-3" />
              {filterCategory.charAt(0).toUpperCase() + filterCategory.slice(1)}: {filterValue}
              <button
                onClick={() => setFilterValue("")}
                className="ml-1 hover:bg-blue-600/30 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          </div>
        )}

        {/* Table */}
        <div className="overflow-auto border border-gray-800 rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-800 text-gray-300">
              <tr>
<th className="p-2 w-8 text-center">
  <input
    type="checkbox"
    checked={filteredDevices.length > 0 && selectedDevices.length === filteredDevices.length}
    onChange={toggleSelectAll}
    className="accent-blue-600 w-4 h-4 cursor-pointer"
  />
</th>                   <th className="p-2 text-left">Device Name</th>
                <th className="p-2 text-left">IP Address</th>
                <th className="p-2 text-left">Location</th>
                <th className="p-2 text-left">Branch</th>
                <th className="p-2 text-left">OS</th>
                <th className="p-2 text-left">Status</th>
                {isManageMode && <th className="p-2 text-left">In Group</th>}
              </tr>
            </thead>
            <tbody>
              {filteredDevices.length > 0 ? (
                filteredDevices.map((d) => {
                  const currentDeviceId = String(d.id);
                  
                  const isCurrentlyInGroup = existingGroupDevices.some(gd => {
                    const groupDeviceIdStr = String(gd.id);
                    const groupDeviceOriginalId = gd.originalDeviceId 
                      ? String(gd.originalDeviceId)
                      : groupDeviceIdStr.split('-')[1] || groupDeviceIdStr;
                             
                    return groupDeviceOriginalId === currentDeviceId;
                  });

                  const isSelected = selectedDevices.includes(currentDeviceId);
                  
                  console.log(`Device ${d.name} (${currentDeviceId}): inGroup=${isCurrentlyInGroup}, selected=${isSelected}`);
                  
                  return (
                    <tr
                      key={d.id}
                      className="border-t border-gray-800 hover:bg-gray-800/60 transition-colors"
                    >
                      <td className="p-2 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(currentDeviceId)}
                          className="accent-blue-600 w-4 h-4 cursor-pointer"
                        />
                      </td>
                      <td className="p-2 font-medium">{d.name}</td>
                      <td className="p-2 text-gray-400">{d.ip}</td>
                      <td className="p-2">{d.location}</td>
                      <td className="p-2">{d.branch}</td>
                      <td className="p-2">{d.os}</td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            d.status === "Online"
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : d.status === "Offline"
                              ? "bg-red-500/20 text-red-400 border border-red-500/30"
                              : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                          }`}
                        >
                          {d.status}
                        </span>
                      </td>
                      {isManageMode && (
                        <td className="p-2">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              isCurrentlyInGroup
                                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                            }`}
                          >
                            {isCurrentlyInGroup ? "Yes" : "No"}
                          </span>
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={isManageMode ? 8 : 7} className="p-8 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <Filter className="w-8 h-8 opacity-50" />
                      <p>No devices found matching your filters</p>
                      {(filterCategory || search) && (
                        <button
                          onClick={clearFilters}
                          className="text-blue-400 hover:text-blue-300 text-sm underline mt-2"
                        >
                          Clear all filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-3">
          <p className="text-sm text-gray-400">
            {selectedDevices.length} device(s) selected
            {isManageMode && ` (${existingGroupDevices.length} currently in group)`}
          </p>
          <p className="text-xs text-gray-500">
            Showing {filteredDevices.length} of {devices.length} devices
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <button 
          onClick={() => navigate("/dashboard/GroupList")}
          className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all hover:scale-105 active:scale-95"
        >
          Cancel
        </button>

        <button
          onClick={handleSaveGroup}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-600/30"
        >
          {isManageMode ? "Update Group" : "Create Group"}
        </button>
      </div>
    </div>
  );
}