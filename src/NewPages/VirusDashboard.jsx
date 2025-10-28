
import React, { useState, useMemo } from "react";
import {
  Shield,
  AlertTriangle,
  Trash2,
  Archive,
  Server,
  Clock,
} from "lucide-react";
import { useReportData } from "../context/DataContext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";
import PieChartComponent from "../components/DynamicGraphs/PieChartComponent";
import BarChartComponent from "../components/DynamicGraphs/BarChartComponent";
import Table from "../components/Table";

// const VirusDashboard = () => {
//   const { dashboardReportData } = useReportData();
//   const data = dashboardReportData;

//   const recentTrendData = useMemo(() => {
//   const grouped = {};
//   data.forEach((d) => {
//     const date = new Date(d.c_time).toLocaleDateString();
//     grouped[date] = grouped[date] || { Quarantined: 0, Deleted: 0 };
//     grouped[date][d.malware_status] = (grouped[date][d.malware_status] || 0) + 1;
//   });
//   return Object.entries(grouped).map(([date, counts]) => ({
//     date,
//     Quarantined: counts.Quarantined || 0,
//     Deleted: counts.Deleted || 0,
//   }));
// }, [data]);

//   const [selectedThreat, setSelectedThreat] = useState(null);

//   const stats = useMemo(() => {
//     const total = data.length;
//     const quarantined = data.filter(
//       (d) => d.malware_status === "Quarantined"
//     ).length;
//     const deleted = data.filter((d) => d.malware_status === "Deleted").length;

//     const threatTypes = {};
//     data.forEach((d) => {
//       const type = d.description.split(".")[0];
//       threatTypes[type] = (threatTypes[type] || 0) + 1;
//     });

//     const uniqueDevices = new Set(data.map((d) => d.ip_address)).size;

//     return { total, quarantined, deleted, threatTypes, uniqueDevices };
//   }, [data]);

//   const recentThreats = data.slice(0, 8);

//   const recentQuarantineData = [
//     { name: "Quarantined", value: stats.quarantined },
//     { name: "Deleted", value: stats.deleted },
//   ];

//   const trendData = useMemo(() => {
//     const grouped = {};
//     data.forEach((d) => {
//       const date = new Date(d.c_time).toLocaleDateString();
//       grouped[date] = (grouped[date] || 0) + 1;
//     });
//     return Object.entries(grouped).map(([date, count]) => ({ date, count }));
//   }, [data]);

//   const COLORS = ["#f97316", "#ec4899"];
//   const Card = ({
//     title,
//     action,
//     children,
//     className = "",
//     noPadding = false,
//   }) => (
//     <div
//       className={`rounded-lg border bg-gray-800 shadow-sm hover:shadow-md transition-shadow flex flex-col border-gray-700 hover:border-gray-600 ${className}`}
//     >
//       <div className="px-3 py-2 border-b bg-gray-800/50 flex-shrink-0 border-gray-700">
//         <div className="flex items-center justify-between">
//           <h3 className="text-sm font-bold text-gray-100">{title}</h3>
//           {action}
//         </div>
//       </div>
//       <div className={`flex-1 overflow-hidden ${noPadding ? "" : "p-0"}`}>
//         {children}
//       </div>
//     </div>
//   );
//   return (
//     <div className="min-h-screen p-6" style={{ background: "#0a0e1a" }}>
//       <div className="mb-6">
//         <h1 className="text-3xl font-bold" style={{ color: "#f1f5f9" }}>
//           Threat Detection Dashboard
//         </h1>
//         <p className="text-sm mt-1" style={{ color: "#94a3b8" }}>
//           Real-time malware monitoring and analysis
//         </p>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
//         {/* Total Threats */}
//         <div
//           className="rounded-lg p-3 border"
//           style={{ background: "#111827", borderColor: "#1f2937" }}
//         >
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs font-medium" style={{ color: "#94a3b8" }}>
//                 Total Threats
//               </p>
//               <p
//                 className="text-2xl font-bold leading-tight"
//                 style={{ color: "#f1f5f9" }}
//               >
//                 {stats.total}
//               </p>
//             </div>
//             <div className="p-2 rounded-lg" style={{ background: "#1f2937" }}>
//               <Shield className="w-5 h-5" style={{ color: "#06b6d4" }} />
//             </div>
//           </div>
//           <div
//             className="mt-1 flex items-center text-[11px]"
//             style={{ color: "#64748b" }}
//           >
//             <Clock className="w-3 h-3 mr-1" />
//             Last 48 hours
//           </div>
//         </div>

//         {/* Quarantined */}
//         <div
//           className="rounded-lg p-3 border"
//           style={{ background: "#111827", borderColor: "#1f2937" }}
//         >
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs font-medium" style={{ color: "#94a3b8" }}>
//                 Quarantined
//               </p>
//               <p
//                 className="text-2xl font-bold leading-tight mt-1"
//                 style={{ color: "#f1f5f9" }}
//               >
//                 {stats.quarantined}
//               </p>
//             </div>
//             <div className="p-2 rounded-lg" style={{ background: "#1f2937" }}>
//               <Archive className="w-5 h-5" style={{ color: "#f97316" }} />
//             </div>
//           </div>
//           <div className="mt-1 text-[11px]" style={{ color: "#64748b" }}>
//             {((stats.quarantined / stats.total) * 100).toFixed(1)}% of total
//           </div>
//         </div>

//         {/* Deleted */}
//         <div
//           className="rounded-lg p-3 border"
//           style={{ background: "#111827", borderColor: "#1f2937" }}
//         >
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs font-medium" style={{ color: "#94a3b8" }}>
//                 Deleted
//               </p>
//               <p
//                 className="text-2xl font-bold leading-tight mt-1"
//                 style={{ color: "#f1f5f9" }}
//               >
//                 {stats.deleted}
//               </p>
//             </div>
//             <div className="p-2 rounded-lg" style={{ background: "#1f2937" }}>
//               <Trash2 className="w-5 h-5" style={{ color: "#ec4899" }} />
//             </div>
//           </div>
//           <div className="mt-1 text-[11px]" style={{ color: "#64748b" }}>
//             Permanently removed
//           </div>
//         </div>

//         {/* Affected Devices */}
//         <div
//           className="rounded-lg p-3 border"
//           style={{ background: "#111827", borderColor: "#1f2937" }}
//         >
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs font-medium" style={{ color: "#94a3b8" }}>
//                 Affected Devices
//               </p>
//               <p
//                 className="text-2xl font-bold leading-tight mt-1"
//                 style={{ color: "#f1f5f9" }}
//               >
//                 {stats.uniqueDevices}
//               </p>
//             </div>
//             <div className="p-2 rounded-lg" style={{ background: "#1f2937" }}>
//               <Server className="w-5 h-5" style={{ color: "#8b5cf6" }} />
//             </div>
//           </div>
//           <div className="mt-1 text-[11px]" style={{ color: "#64748b" }}>
//             Unique endpoints
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 h-72  gap-5 my-4 items-start ">
//         <div className="h-full ">
//           <Card title="Threat Categories" className="h-full">
//             <div className="space-y-3 p-4 border border-gray-700 h-full ">
//               {Object.entries(stats.threatTypes).map(([type, count], idx) => {
//                 const colors = [
//                   "#06b6d4",
//                   "#f97316",
//                   "#ec4899",
//                   "#8b5cf6",
//                   "#2dd4bf",
//                 ];
//                 const color = colors[idx % colors.length];
//                 const percentage = ((count / stats.total) * 100).toFixed(0);

//                 return (
//                   <div key={type} className="border-b border-gray-500 pb-2">
//                     <div className="flex items-center justify-between mb-1 ">
//                       <span
//                         className="text-sm font-medium"
//                         style={{ color: "#cbd5e1" }}
//                       >
//                         {type}
//                       </span>
//                       <span
//                         className="text-xs font-semibold"
//                         style={{ color: "#94a3b8" }}
//                       >
//                         {count}
//                       </span>
//                     </div>
//                     <div
//                       className="w-full h-2 rounded-full"
//                       style={{ background: "#1f2937" }}
//                     >
//                       <div
//                         className="h-2 rounded-full transition-all duration-500"
//                         style={{ width: `${percentage}%`, background: color }}
//                       />
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </Card>
//         </div>

//         <div className="h-full">
//           <Card title="UP Down Data" className="h-full">
//             <PieChartComponent
//               data={recentQuarantineData}
//               title="Quarantine vs Delete"
//             />
//           </Card>
//         </div>

//         <div className="h-full">
//           <Card title="Threats Over Time" className="h-full">
//             <div className="h-full  mt-2">
//               <ResponsiveContainer width="95%" height="100%">
//                 <LineChart data={trendData}>
//                   <XAxis
//                     dataKey="date"
//                     tick={{ fill: "#94a3b8", fontSize: 10 }}
//                   />
//                   <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
//                   <Tooltip
//                     contentStyle={{
//                       background: "#1f2937",
//                       border: "none",
//                       color: "#f1f5f9",
//                     }}
//                   />
//                   <Line
//                     type="monotone"
//                     dataKey="count"
//                     stroke="#06b6d4"
//                     strokeWidth={2}
//                     dot={false}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </Card>
//         </div>
//       </div>


//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 my-4">
//         <div className="lg:col-span-4 rounded-lg p-5 border" style={{ background: '#111827', borderColor: '#1f2937' }}>
//           <h2 className="text-lg font-semibold mb-4" style={{ color: '#f1f5f9' }}>
//             Recent Detections
//           </h2>
//           <div className="space-y-2 max-h-80 overflow-y-auto overflow-x-hidden  ">
//             {recentThreats.map((threat, idx) => (
//               <div
//                 key={idx}
//                 className="p-3 rounded-lg border cursor-pointer transition-all duration-200 "
//                 style={{
//                   background: '#0f172a',
//                   borderColor: '#1e293b'
//                 }}
//                 onClick={() => setSelectedThreat(threat)}
//               >
//                 <div className="flex items-start justify-between gap-3 ">
//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-center gap-2 mb-1">
//                       <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: '#f97316' }} />
//                       <span className="text-sm font-semibold truncate" style={{ color: '#f1f5f9' }}>
//                         {threat.application_name}
//                       </span>
//                     </div>
//                     <p className="text-xs truncate mb-1" style={{ color: '#94a3b8' }}>
//                       {threat.description}
//                     </p>
//                     <div className="flex items-center gap-3 text-xs" style={{ color: '#64748b' }}>
//                       <span>{threat.ip_address}</span>
//                       <span>•</span>
//                       <span>{new Date(threat.c_time).toLocaleTimeString()}</span>
//                     </div>
//                   </div>
//                   <span
//                     className="px-2 py-1 rounded text-xs font-medium flex-shrink-0"
//                     style={{
//                       background: threat.malware_status === 'Quarantined' ? '#18181b' : '#1f2937',
//                       color: threat.malware_status === 'Quarantined' ? '#fb923c' : '#ec4899',
//                       border: `1px solid ${threat.malware_status === 'Quarantined' ? '#3f3f46' : '#374151'}`
//                     }}
//                   >
//                     {threat.malware_status}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//         </div>
//       {/* Detail Modal */}
//       {selectedThreat && (
//         <div
//           className="fixed inset-0 flex items-center justify-center p-4 z-50"
//           style={{ background: "rgba(0, 0, 0, 0.8)" }}
//           onClick={() => setSelectedThreat(null)}
//         >
//           <div
//             className="rounded-lg p-6 max-w-2xl w-full border max-h-96 overflow-y-auto"
//             style={{ background: "#111827", borderColor: "#1f2937" }}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex items-start justify-between mb-4">
//               <h3 className="text-xl font-bold" style={{ color: "#f1f5f9" }}>
//                 Threat Details
//               </h3>
//               <button
//                 className="text-sm px-3 py-1 rounded hover:opacity-80 transition-opacity"
//                 style={{ background: "#1f2937", color: "#94a3b8" }}
//                 onClick={() => setSelectedThreat(null)}
//               >
//                 Close
//               </button>
//             </div>

//             <div className="space-y-3">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <p
//                     className="text-xs font-medium mb-1"
//                     style={{ color: "#64748b" }}
//                   >
//                     Application Name
//                   </p>
//                   <p
//                     className="text-sm font-semibold"
//                     style={{ color: "#f1f5f9" }}
//                   >
//                     {selectedThreat.application_name}
//                   </p>
//                 </div>
//                 <div>
//                   <p
//                     className="text-xs font-medium mb-1"
//                     style={{ color: "#64748b" }}
//                   >
//                     Status
//                   </p>
//                   <span
//                     className="inline-block px-2 py-1 rounded text-xs font-medium"
//                     style={{
//                       background:
//                         selectedThreat.malware_status === "Quarantined"
//                           ? "#18181b"
//                           : "#1f2937",
//                       color:
//                         selectedThreat.malware_status === "Quarantined"
//                           ? "#fb923c"
//                           : "#ec4899",
//                     }}
//                   >
//                     {selectedThreat.malware_status}
//                   </span>
//                 </div>
//                 <div>
//                   <p
//                     className="text-xs font-medium mb-1"
//                     style={{ color: "#64748b" }}
//                   >
//                     User
//                   </p>
//                   <p className="text-sm" style={{ color: "#cbd5e1" }}>
//                     {selectedThreat.user_name}
//                   </p>
//                 </div>
//                 <div>
//                   <p
//                     className="text-xs font-medium mb-1"
//                     style={{ color: "#64748b" }}
//                   >
//                     Device
//                   </p>
//                   <p className="text-sm" style={{ color: "#cbd5e1" }}>
//                     {selectedThreat.ip_address}
//                   </p>
//                 </div>
//                 <div>
//                   <p
//                     className="text-xs font-medium mb-1"
//                     style={{ color: "#64748b" }}
//                   >
//                     Detection Time
//                   </p>
//                   <p className="text-sm" style={{ color: "#cbd5e1" }}>
//                     {selectedThreat.c_time}
//                   </p>
//                 </div>
//                 <div>
//                   <p
//                     className="text-xs font-medium mb-1"
//                     style={{ color: "#64748b" }}
//                   >
//                     Threat Type
//                   </p>
//                   <p className="text-sm" style={{ color: "#cbd5e1" }}>
//                     {selectedThreat.description}
//                   </p>
//                 </div>
//               </div>

//               <div>
//                 <p
//                   className="text-xs font-medium mb-1"
//                   style={{ color: "#64748b" }}
//                 >
//                   File Path
//                 </p>
//                 <p
//                   className="text-xs font-mono p-2 rounded break-all"
//                   style={{ background: "#0f172a", color: "#94a3b8" }}
//                 >
//                   {selectedThreat.application_path}
//                 </p>
//               </div>

//               <div>
//                 <p
//                   className="text-xs font-medium mb-1"
//                   style={{ color: "#64748b" }}
//                 >
//                   Hash (SHA256)
//                 </p>
//                 <p
//                   className="text-xs font-mono p-2 rounded break-all"
//                   style={{ background: "#0f172a", color: "#94a3b8" }}
//                 >
//                   {selectedThreat.application_hash}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

const VirusDashboard = () => {
    const { dashboardReportData } = useReportData();

  return (
  <div>
    <Table 
          data={dashboardReportData}
          bulkActionLabel="IPs Report"
          showCheckboxes={false}
          tableTitle="Virus Reports"
        />
  </div>
  )
}
export default VirusDashboard;














