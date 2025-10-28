// import React, { useEffect, useState } from "react";
// import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
// import { getApi } from "../../../lib/api";
// import GenericDrawerModal from "../MODAL/GenericDrawerModal";

// const PieChartComponent = ({ query, endpoint, data }) => {
//   const [apiData, setApiData] = useState([]);
//   const total = apiData.reduce((sum, d) => sum + d.value, 0);
//   const [loading, setLoading] = useState(true);
//   const [isOpen, setIsOpen] = useState(false);
//   const [dataToSend, setDataToSend] = useState({});

//   useEffect(() => {






// const fetchData = async () => {
//   setLoading(true);
//   try {
//     let deviceRes = query ? await getApi(query, endpoint) : data;

//     const dynamicPalette = [
//       "#22D3EE", "#FB923C", "#EC4899", "#06B6D4",
//       "#F472B6", "#2DD4BF", "#C084FC", "#FB7185",
//       "#14B8A6", "#F97316", "#A78BFA", "#60A5FA",
//     ];

// const statusColors = {
//   Up: "#10B981",           // green-500
//   Down: "#EF4444",         // red-500
//   Complete: "#06B6D4",     // cyan-500
//   Deleted: "#C2410C",      // gray-500
//   Quarantined: "#F59E0B",  // amber-500
//   Pending: "#8B5CF6",      // violet-500
//   Active: "#3B82F6",       // blue-500
//   Inactive: "#64748B",     // slate-500
//   Warning: "#F97316",      // orange-500
//   Error: "#DC2626",        // red-600
//   Success: "#059669",      // green-600
//   Processing: "#0EA5E9",   // sky-500
//   Failed: "#B91C1C",       // red-700
//   Paused: "#A855F7",       // purple-500
//   Cancelled: "#71717A",    // zinc-500
//   Blocked: "#991B1B",      // red-800
//   Approved: "#16A34A",     // green-600
//   Rejected: "#DC2626",     // red-600
//   Cleaning: "#14B8A6",     // teal-500
//   Infected: "#C2410C",     // orange-700
// };

//     const isNumeric = deviceRes.length > 0 && !isNaN(deviceRes[0].value);

//     let formattedData;

//     if (isNumeric) {
//       // Numeric data → use dynamic palette
//       formattedData = deviceRes.map((item, i) => ({
//         ...item,
//         color: dynamicPalette[i % dynamicPalette.length],
//         value: Number(item.value),
//       }));
//     } else {
//       // Non-numeric → group and count
//       const grouped = deviceRes.reduce((acc, curr) => {
//         acc[curr.value] = (acc[curr.value] || 0) + 1;
//         return acc;
//       }, {});

//       formattedData = Object.entries(grouped).map(([key, count], i) => ({
//         name: key,
//         value: count,
//         color: statusColors[key] || dynamicPalette[i % dynamicPalette.length], // status gets universal color, others fallback
//       }));
//     }

//     setApiData(formattedData);
//   } catch (err) {
//     console.error("Device breakdown fetch failed:", err);
//   } finally {
//     setLoading(false);
//   }
// };

// fetchData();
//   }, []);

//   console.log(dataToSend, "dataToSend");

//   return (
//     <div className=" bg-gray-900 shadow-sm flex flex-col h-full w-full rounded-lg">
//       {loading ? (
//         <div className="mt-4  shadow-sm p-4 w-full flex space-x-4 ">
//           <div className="flex-shrink-0 w-32 h-32 rounded-full bg-gray-700 animate-pulse"></div>

//           <div className="flex-1 flex flex-col justify-center space-y-3">
//             {[...Array(5)].map((_, i) => (
//               <div
//                 key={i}
//                 className="h-4 bg-gray-700 rounded w-full animate-pulse"
//               ></div>
//             ))}
//           </div>
//         </div>
//       ) : (
//         <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 h-full p-2">
//           <div className="h-full w-40 flex-shrink-0 ">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={apiData}
//                   dataKey="value"
//                   nameKey="name"
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={55}
//                   outerRadius={75}
//                   stroke="none"
//                 >
//                   {apiData.map((d, i) => (
//                     <Cell key={i} fill={d.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip
//                   formatter={(v, n) => [`${v} CVEs`, n]}
//                   contentStyle={{
//                     background: "#1f2937",
//                     border: "1px solid #374151",
//                     borderRadius: 6,
//                     fontSize: 11,
//                     color: "#f9fafb",
//                   }}
//                 />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>

//           <div className="flex-1 w-full overflow-y-auto h-full divide-y divide-gray-700 scrollbar-hide">
//             {apiData.map((d) => {
//               const percent = ((d.value / total) * 100).toFixed(1);
//               const count = d.value;

//               return (
//                 <div
//                   key={d.name}
//                   className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-gray-800/70 transition-colors  cursor-pointer"
//                   onClick={() => {
//                     setIsOpen(true);
//                     setDataToSend(d);
//                   }}
//                 >
               


//                   <div
//   key={d.name}
//   className="flex justify-between items-center w-full px-2 py-1.5 rounded-lg hover:bg-gray-800/70 transition-colors cursor-pointer"
// >
//   <div className="flex items-center gap-2 flex-1 min-w-0">
//     <span
//       className="h-3 w-3 rounded-full ring-1 ring-gray-900/40 flex-shrink-0"
//       style={{ background: d.color }}
//     />

//     <span className="text-gray-100 font-medium text-sm break-words">
//   {d.name}
// </span>
//   </div>

//   <div className="flex flex-col items-end flex-shrink-0 leading-tight text-right">
//     <span className="text-gray-300 text-xs font-semibold">
//          {count} devices
//     </span>
//     <span className="text-gray-300 text-xs font-medium">
//    {percent}%
//     </span>
//   </div>
// </div>

//                 </div>
//               );
//             })}
//           </div>

//           <GenericDrawerModal
//             isOpen={isOpen}
//             onClose={() => setIsOpen(false)}
//             title="Custom Content Here"
//             size="max-w-4xl"
//             data={dataToSend}
//           >
//             <div className="bg-gray-800 p-6 rounded">
//               {Object.entries(dataToSend).map(([key, value]) => (
//                 <div key={key}>
//                   <strong>{key}</strong>: {value}
//                 </div>
//               ))}
//             </div>
//           </GenericDrawerModal>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PieChartComponent;






import React, { useEffect, useState, useMemo, useCallback } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { getApi } from "../../../lib/api";
import GenericDrawerModal from "../MODAL/GenericDrawerModal";

const PieChartComponent = React.memo(function PieChartComponent({
  query,
  endpoint,
  data,
  title,
}) {
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [dataToSend, setDataToSend] = useState({});

  const handleOpenModal = useCallback((item) => {
    setIsOpen(true);
    setDataToSend(item);
  }, []);

  const handleCloseModal = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let res = query ? await getApi(query, endpoint) : data;

        const dynamicPalette = [
          "#22D3EE",
          "#FB923C",
          "#EC4899",
          "#06B6D4",
          "#F472B6",
          "#2DD4BF",
          "#C084FC",
          "#FB7185",
          "#14B8A6",
          "#F97316",
          "#A78BFA",
          "#60A5FA",
        ];

        const statusColors = {
          Up: "#10B981",
          Down: "#EF4444",
          Complete: "#06B6D4",
          Deleted: "#C2410C",
          Quarantined: "#F59E0B",
          Pending: "#8B5CF6",
          Active: "#3B82F6",
          Inactive: "#64748B",
          Warning: "#F97316",
          Error: "#DC2626",
          Success: "#059669",
          Processing: "#0EA5E9",
          Failed: "#B91C1C",
          Paused: "#A855F7",
          Cancelled: "#71717A",
          Blocked: "#991B1B",
          Approved: "#16A34A",
          Rejected: "#DC2626",
          Cleaning: "#14B8A6",
          Infected: "#C2410C",
        };

        if (!Array.isArray(res)) res = [];

        // Detect numeric vs categorical
        const isNumeric = res.length > 0 && !isNaN(res[0].value);

        let formattedData;
        if (isNumeric) {
          // Numeric data → assign dynamic colors
          formattedData = res.map((item, i) => ({
            ...item,
            color: dynamicPalette[i % dynamicPalette.length],
            value: Number(item.value),
          }));
        } else {
          // Categorical data → count occurrences
          const grouped = res.reduce((acc, curr) => {
            acc[curr.value] = (acc[curr.value] || 0) + 1;
            return acc;
          }, {});

          formattedData = Object.entries(grouped).map(([key, count], i) => ({
            name: key,
            value: count,
            color: statusColors[key] || dynamicPalette[i % dynamicPalette.length],
          }));
        }

        setApiData(formattedData);
      } catch (err) {
        console.error("PieChart fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query, endpoint, data]);

  const total = useMemo(
    () => apiData.reduce((sum, d) => sum + d.value, 0),
    [apiData]
  );

  return (
    <div className="bg-gray-900 shadow-sm flex flex-col h-full w-full rounded-lg">
      {loading ? (
        //  Skeleton Loader
        <div className="mt-4 p-4 w-full flex space-x-4">
          <div className="flex-shrink-0 w-32 h-32 rounded-full bg-gray-700 animate-pulse" />
          <div className="flex-1 flex flex-col justify-center space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-4 bg-gray-700 rounded w-full animate-pulse"
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 h-full p-2">
          {/* ==== Pie Chart ==== */}
          <div className="h-full w-40 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={apiData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  stroke="none"
                >
                  {apiData.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v, n) => [`${v}`, n]}
                  contentStyle={{
                    background: "#fafafa",
                    border: "1px solid #374151",
                    borderRadius: 6,
                    fontSize: 11,
                    color: "#f9fafb",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* ==== Legend List ==== */}
          <div className="flex-1 w-full overflow-y-auto h-full divide-y divide-gray-700 scrollbar-hide">
            {apiData.map((d) => {
              const percent = ((d.value / total) * 100).toFixed(1);
              return (
                <div
                  key={d.name}
                  className="flex justify-between items-center w-full px-2 py-1.5 rounded-lg hover:bg-gray-800/70 transition-colors cursor-pointer"
                  onClick={() => handleOpenModal(d)}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span
                      className="h-3 w-3 rounded-full ring-1 ring-gray-900/40 flex-shrink-0"
                      style={{ background: d.color }}
                    />
                    <span className="text-gray-100 font-medium text-sm break-words">
                      {d.name}
                    </span>
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0 text-right leading-tight">
                    <span className="text-gray-300 text-xs font-semibold">
                      {d.value}
                    </span>
                    <span className="text-gray-400 text-xs       font-medium">
                      {percent}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ==== Drawer Modal ==== */}
          <GenericDrawerModal
            isOpen={isOpen}
            onClose={handleCloseModal}
            title={title || "Details"}
            size="max-w-4xl"
            data={dataToSend}
          >
            <div className="bg-gray-800 p-6 rounded">
              {Object.entries(dataToSend).map(([key, value]) => (
                <div key={key} className="text-sm text-gray-300">
                  <strong className="text-gray-100">{key}</strong>: {value}
                </div>
              ))}
            </div>
          </GenericDrawerModal>
        </div>
      )}
    </div>
  );
});

export default PieChartComponent;
