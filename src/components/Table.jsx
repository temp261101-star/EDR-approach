// import React, { useState, useMemo } from "react";
// import { Search } from "lucide-react";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";


// export default function Table({ 
//   data , 

//   onBulkAction,
//   showCheckboxes = true,
//   bulkActionLabel = "Bulk Action",
//   tableTitle
// }) {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedRows, setSelectedRows] = useState([]);
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(5);


//   // Memoized columns
//   const columns = useMemo(() => {
//     if (!data || data.length === 0) return [];
//     return Object.keys(data[0]);
//   }, [data]);

//   // Safe actualColumns
//   const actualColumns = useMemo(() => {
//     if (data.length > 0) return columns;
//     return [];
//   }, [data, columns]);

//   const filteredData = useMemo(() => {
//     if (!searchTerm) return data;
//     const lower = searchTerm.toLowerCase();
//     return data.filter((row) =>
//       columns.some((col) => String(row[col]).toLowerCase().includes(lower))
//     );
//   }, [data, searchTerm, columns]);

//   const { paginatedData, totalPages, totalItems } = useMemo(() => {
//     let dataToFilter = filteredData;

//     // Apply sorting
//     if (sortConfig.key) {
//       dataToFilter = [...dataToFilter].sort((a, b) => {
//         const aVal = a[sortConfig.key];
//         const bVal = b[sortConfig.key];
//         if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
//         if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
//         return 0;
//       });
//     }

//     // Pagination
//     const totalItems = dataToFilter.length;
//     const totalPages = Math.ceil(totalItems / itemsPerPage);
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const paginatedData = dataToFilter.slice(
//       startIndex,
//       startIndex + itemsPerPage
//     );

//     return { paginatedData, totalPages, totalItems };
//   }, [filteredData, sortConfig, currentPage, itemsPerPage]);

//   const handleSort = (key) => {
//     setSortConfig((prevConfig) => ({
//       key,
//       direction:
//         prevConfig.key === key && prevConfig.direction === "asc"
//           ? "desc"
//           : "asc",
//     }));
//   };
// const handleDownloadPDF = () => {
//   const doc = new jsPDF();
//   const tableColumn = actualColumns.map((col) =>
//     col.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
//   );
  
//   // Use all data if no rows selected, otherwise use selected rows
//   const dataToExport = selectedRows.length > 0 
//     ? selectedRows.map((i) => data[i])
//     : filteredData;
  
//   const tableRows = dataToExport.map((row) =>
//     actualColumns.map((col) =>
//       col === "enabled" ? (row[col] ? "Enabled" : "Disabled") : row[col]
//     )
//   );

//   autoTable(doc, {
//     head: [tableColumn],
//     body: tableRows,
//     startY: 20,
//     styles: { fontSize: 8 },
//     headStyles: { fillColor: [0, 128, 128] },
//   });

//   doc.save("table-data.pdf");
// };

//   const handleDownloadExcel = () => {
//     const exportData = paginatedData.map((row) => {
//       const obj = {};
//       actualColumns.forEach((col) => {
//         obj[col] =
//           col === "enabled" ? (row[col] ? "Enabled" : "Disabled") : row[col];
//       });
//       return obj;
//     });

//     const worksheet = XLSX.utils.json_to_sheet(exportData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "TableData");
//     const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
//     const blob = new Blob([wbout], { type: "application/octet-stream" });
//     saveAs(blob, "table-data.xlsx");
//   };

//   const toggleRow = (index) => {
//     const globalIndex = (currentPage - 1) * itemsPerPage + index;
//     setSelectedRows((prev) =>
//       prev.includes(globalIndex)
//         ? prev.filter((i) => i !== globalIndex)
//         : [...prev, globalIndex]
//     );
//   };

//   const toggleAll = () => {
//     const currentPageIndices = paginatedData.map(
//       (_, i) => (currentPage - 1) * itemsPerPage + i
//     );
//     const allSelected = currentPageIndices.every((index) =>
//       selectedRows.includes(index)
//     );

//     if (allSelected) {
//       setSelectedRows((prev) =>
//         prev.filter((index) => !currentPageIndices.includes(index))
//       );
//     } else {
//       setSelectedRows((prev) => [...new Set([...prev, ...currentPageIndices])]);
//     }
//   };

//   const handleBulkActionClick = () => {
//     const selectedData = selectedRows.map((i) => data[i]);
//     if (onBulkAction) {
//       onBulkAction(selectedData);
//     }
//   };

//   const handleDownloadCSV = () => {
//     // Create CSV header
//     const headers = actualColumns.map((col) =>
//       col.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
//     );
    
//     // Create CSV rows
//     const rows = paginatedData.map((row) =>
//       actualColumns.map((col) => {
//         const value = col === "enabled" ? (row[col] ? "Enabled" : "Disabled") : row[col];
//         // Escape quotes and wrap in quotes if contains comma
//         return typeof value === 'string' && (value.includes(',') || value.includes('"'))
//           ? `"${value.replace(/"/g, '""')}"`
//           : value;
//       })
//     );
    
//     // Combine header and rows
//     const csvContent = [headers, ...rows]
//       .map(row => row.join(','))
//       .join('\n');
    
//     // Download
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     const url = URL.createObjectURL(blob);
//     link.setAttribute('href', url);
//     link.setAttribute('download', 'table-data.csv');
//     link.style.visibility = 'hidden';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const handleDownloadJSON = () => {
//     const exportData = paginatedData.map((row) => {
//       const obj = {};
//       actualColumns.forEach((col) => {
//         obj[col] =
//           col === "enabled" ? (row[col] ? "Enabled" : "Disabled") : row[col];
//       });
//       return obj;
//     });

//     const jsonContent = JSON.stringify(exportData, null, 2);
//     const blob = new Blob([jsonContent], { type: 'application/json' });
//     const link = document.createElement('a');
//     const url = URL.createObjectURL(blob);
//     link.setAttribute('href', url);
//     link.setAttribute('download', 'table-data.json');
//     link.style.visibility = 'hidden';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <div className="w-full max-w-7xl mx-auto bg-gray-900 rounded-md mt-5 shadow-2xl border border-gray-600 overflow-hidden">
//       {/* Header */}
//       <div className="relative bg-gradient-to-r from-gray-800 via-gray-900 to-black px-6 py-4 border-b border-gray-600">
//         <div className="absolute inset-0 bg-gray-800/20 backdrop-blur-sm"></div>
//         <div className="relative flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
//           <div className="flex items-center gap-3">
//             <h2 className="text-xl font-bold text-white tracking-wide">
//               {tableTitle || "Dynamic Table"}
//             </h2>
//             <span className="px-2 py-1 bg-gray-700/60 rounded-full text-xs text-gray-300 font-medium">
//               {totalItems} records
//             </span>
//           </div>
//           <div className="flex gap-3">
//             <div className="relative w-full sm:w-64">
//               <Search className="absolute left-3 top-4 -translate-y-1/2 text-gray-400 z-10 w-4 h-4" />
//               <input
//                 type="text"
//                 placeholder="Search records..."
//                 value={searchTerm}
//                 onChange={(e) => {
//                   setSearchTerm(e.target.value);
//                   setCurrentPage(1);
//                 }}
//                 className="pl-10 pr-4 py-1 rounded-lg bg-gray-800/60 backdrop-blur-sm border border-gray-700 
//                text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 
//                focus:ring-cyan-500 focus:bg-gray-800 transition-all duration-300 text-sm w-full"
//               />
//             </div>

//             <button
//               className="cursor-pointer px-2 py-0.5 rounded-md bg-cyan-600/80 hover:bg-cyan-500 backdrop-blur-sm border border-cyan-600/30 text-white text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2"
//               onClick={handleDownloadCSV}
//             >
//               CSV
//             </button>
//             <button
//               className="cursor-pointer px-2 py-0.5 rounded-md bg-cyan-600/80 hover:bg-cyan-500 backdrop-blur-sm border border-cyan-600/30 text-white text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2"
//               onClick={handleDownloadPDF}
//             >
//               PDF
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto bg-gray-900 w-full p-2 sm:p-4">
//         <table className="w-full border-collapse table-auto">
//           <thead>
//             <tr className="bg-gradient-to-r from-gray-800 to-gray-700 border-b border-gray-600">
//               {showCheckboxes && (
//                 <th className="py-2 px-4 text-center w-12">
//                   <label className="relative inline-block">
//                     <input
//                       type="checkbox"
//                       onChange={toggleAll}
//                       checked={
//                         paginatedData.length > 0 &&
//                         paginatedData.every((_, i) =>
//                           selectedRows.includes(
//                             (currentPage - 1) * itemsPerPage + i
//                           )
//                         )
//                       }
//                       className="sr-only"
//                     />
//                     <div className="w-4 h-4 bg-gray-700 border border-gray-500 rounded flex items-center justify-center cursor-pointer hover:border-cyan-400 transition-colors">
//                       {paginatedData.length > 0 &&
//                         paginatedData.every((_, i) =>
//                           selectedRows.includes(
//                             (currentPage - 1) * itemsPerPage + i
//                           )
//                         ) && (
//                           <svg
//                             className="w-3 h-3 text-cyan-400"
//                             fill="currentColor"
//                             viewBox="0 0 20 20"
//                           >
//                             <path
//                               fillRule="evenodd"
//                               d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                               clipRule="evenodd"
//                             />
//                           </svg>
//                         )}
//                     </div>
//                   </label>
//                 </th>
//               )}
//               <th className="py-2 px-4 text-center w-16 text-xs font-semibold text-gray-300 uppercase tracking-wider">
//                 Id
//               </th>
//               {actualColumns.map((col) => (
//                 <th
//                   key={col}
//                   className="py-2 px-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider cursor-pointer hover:text-cyan-400 transition-colors"
//                   onClick={() => handleSort(col)}
//                 >
//                   <div className="flex items-center gap-2">
//                     {col
//                       .replace(/([A-Z])/g, " $1")
//                       .replace(/^./, (str) => str.toUpperCase())}
//                   </div>
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="bg-gray-900 divide-y divide-gray-700">
//             {paginatedData.map((row, i) => (
//               <tr
//                 key={i}
//                 className={`group transition-all duration-200 hover:bg-gray-800 ${
//                   showCheckboxes && selectedRows.includes((currentPage - 1) * itemsPerPage + i)
//                     ? "bg-gray-800 shadow-sm border-l-2 border-cyan-400"
//                     : i % 2 === 0
//                     ? "bg-gray-900"
//                     : "bg-gray-850"
//                 }`}
//               >
//                 {showCheckboxes && (
//                   <td className="py-2 px-4 text-center">
//                     <label className="relative inline-block">
//                       <input
//                         type="checkbox"
//                         checked={selectedRows.includes(
//                           (currentPage - 1) * itemsPerPage + i
//                         )}
//                         onChange={() => toggleRow(i)}
//                         className="sr-only"
//                       />
//                       <div className="w-4 h-4 bg-gray-700 border border-gray-500 rounded flex items-center justify-center cursor-pointer hover:border-cyan-400 transition-colors">
//                         {selectedRows.includes(
//                           (currentPage - 1) * itemsPerPage + i
//                         ) && (
//                           <svg
//                             className="w-3 h-3 text-cyan-400"
//                             fill="currentColor"
//                             viewBox="0 0 20 20"
//                           >
//                             <path
//                               fillRule="evenodd"
//                               d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                               clipRule="evenodd"
//                             />
//                           </svg>
//                         )}
//                       </div>
//                     </label>
//                   </td>
//                 )}
//                 <td className="py-2 px-4 text-center">
//                   <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-700 text-gray-300 rounded-full text-xs font-medium">
//                     {(currentPage - 1) * itemsPerPage + i + 1}
//                   </span>
//                 </td>
//                 {actualColumns.map((col) => (
//                   <td key={col} className="py-2 px-4 text-gray-200 text-sm">
//                     <div className="flex items-center">
//                       {col === "enabled" ? (
//                         <span
//                           className={`px-2 py-0.5 rounded-full text-xs font-medium ${
//                             row[col]
//                               ? "bg-green-900/30 text-green-400"
//                               : "bg-red-900/30 text-red-400"
//                           }`}
//                         >
//                           {row[col] ? "Enabled" : "Disabled"}
//                         </span>
//                       ) : (
//                         <span>{row[col]}</span>
//                       )}
//                     </div>
//                   </td>
//                 ))}
//               </tr>
//             ))}

//             {paginatedData.length === 0 && (
//               <tr>
//                 <td
//                   colSpan={actualColumns.length + (showCheckboxes ? 2 : 1)}
//                   className="py-8 text-center"
//                 >
//                   <div className="flex flex-col items-center gap-3">
//                     <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
//                       <svg
//                         className="w-6 h-6 text-gray-500"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                         />
//                       </svg>
//                     </div>
//                     <div>
//                       <p className="text-gray-400 font-medium">
//                         No matching records found
//                       </p>
//                       <p className="text-gray-500 text-sm">
//                         Try adjusting your search criteria
//                       </p>
//                     </div>
//                   </div>
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="px-6 py-3 bg-gray-800 border-t border-gray-700 flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <span className="text-sm text-gray-400">
//               Showing{" "}
//               {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to{" "}
//               {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
//               results
//             </span>
//             <select
//               value={itemsPerPage}
//               onChange={(e) => {
//                 setItemsPerPage(Number(e.target.value));
//                 setCurrentPage(1);
//               }}
//               className="px-2 py-1 bg-gray-700 border border-gray-600 text-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
//             >
//               <option value={5}>5 per page</option>
//               <option value={10}>10 per page</option>
//               <option value={25}>25 per page</option>
//               <option value={50}>50 per page</option>
//             </select>
//           </div>

//           <div className="flex items-center gap-1">
//             <button
//               onClick={() => setCurrentPage(1)}
//               disabled={currentPage === 1}
//               className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 rounded transition-colors"
//             >
//               First
//             </button>
//             <button
//               onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//               disabled={currentPage === 1}
//               className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 rounded transition-colors"
//             >
//               Prev
//             </button>

//             {[...Array(Math.min(5, totalPages))].map((_, i) => {
//               let pageNum;
//               if (totalPages <= 5) pageNum = i + 1;
//               else if (currentPage <= 3) pageNum = i + 1;
//               else if (currentPage >= totalPages - 2)
//                 pageNum = totalPages - 4 + i;
//               else pageNum = currentPage - 2 + i;

//               return (
//                 <button
//                   key={pageNum}
//                   onClick={() => setCurrentPage(pageNum)}
//                   className={`px-3 py-1 text-xs rounded transition-colors ${
//                     currentPage === pageNum
//                       ? "bg-cyan-600 text-white"
//                       : "bg-gray-700 hover:bg-gray-600 text-gray-300"
//                   }`}
//                 >
//                   {pageNum}
//                 </button>
//               );
//             })}

//             <button
//               onClick={() =>
//                 setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//               }
//               disabled={currentPage === totalPages}
//               className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 rounded transition-colors"
//             >
//               Next
//             </button>
//             <button
//               onClick={() => setCurrentPage(totalPages)}
//               disabled={currentPage === totalPages}
//               className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 rounded transition-colors"
//             >
//               Last
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Footer selection info */}
//       {showCheckboxes && selectedRows.length > 0 && (
//         <div className="px-6 py-2 bg-gray-800 border-t border-gray-700">
//           <div className="flex items-center justify-between">
//             <span className="text-sm text-gray-300">
//               <strong>{selectedRows.length}</strong> record
//               {selectedRows.length !== 1 ? "s" : ""} selected across all pages
//             </span>
//             <div className="flex gap-2">
//               <button
//                 onClick={handleBulkActionClick}
//                 className="px-3 py-1 text-xs bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 rounded-lg transition-colors"
//               >
//                 {bulkActionLabel}
//               </button>
//               <button
//                 className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
//                 onClick={() => setSelectedRows([])}
//               >
//                 Clear Selection
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }














import React, { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import api from "../lib/api.js";

export default function Table({
  data = [],
  endpoint, 
  dataPath, 
  onBulkAction,
  showCheckboxes = true,
  bulkActionLabel = "Bulk Action",
  tableTitle,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [apiData, setApiData] = useState([]);
  const [error, setError] = useState(null);

  // Fetch data from API if endpoint is provided
  // Fetch data from API only if data prop is empty and endpoint is provided
  useEffect(() => {
    if (data.length === 0 && endpoint) {
      const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await api.fetchResource({ resource: endpoint });
          console.log("API Response:", response);

          // Extract data using dataPath if provided
          let extractedData = response;
          if (dataPath) {
            const paths = dataPath.split(".");
            for (const path of paths) {
              extractedData = extractedData?.[path];
            }
          }

          console.log("Extracted Data:", extractedData);
          setApiData(Array.isArray(extractedData) ? extractedData : []);
        } catch (err) {
          console.error("Failed to fetch table data:", err);
          setError(err.message || "Failed to load data");
          setApiData([]);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [data.length, endpoint, dataPath]);

  console.log("apiData", apiData);

  // Memoized columns
  // Determine which data source to use
  // Use data prop if not empty, otherwise use apiData
  const tableData = useMemo(() => {
    const result = data.length > 0 ? data : apiData;
    console.log("tableData result:", result);
    console.log("data.length:", data.length);
    console.log("apiData.length:", apiData.length);
    return result;
  }, [data, apiData]);

  // Memoized columns
  const columns = useMemo(() => {
    console.log("tableData in columns:", tableData);
    console.log("tableData.length:", tableData.length);
    if (!tableData || tableData.length === 0) return [];
    const cols = Object.keys(tableData[0]);
    console.log("Generated columns:", cols);
    return cols;
  }, [tableData]);

  // Safe actualColumns
  const actualColumns = useMemo(() => {
    if (tableData.length > 0) return columns;
    return [];
  }, [tableData, columns]);

  const filteredData = useMemo(() => {
    if (!searchTerm) {
      console.log("filteredData (no search):", tableData);
      return tableData;
    }
    const lower = searchTerm.toLowerCase();
    const filtered = tableData.filter((row) =>
      columns.some((col) => String(row[col]).toLowerCase().includes(lower))
    );
    console.log("filteredData (with search):", filtered);
    return filtered;
  }, [tableData, searchTerm, columns]);

  const { paginatedData, totalPages, totalItems } = useMemo(() => {
    let dataToFilter = filteredData;

    // Apply sorting
    if (sortConfig.key) {
      dataToFilter = [...dataToFilter].sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    // Pagination
    const totalItems = dataToFilter.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = dataToFilter.slice(
      startIndex,
      startIndex + itemsPerPage
    );

    return { paginatedData, totalPages, totalItems };
  }, [filteredData, sortConfig, currentPage, itemsPerPage]);

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const tableColumn = actualColumns.map((col) =>
      col.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
    );

    // Use all data if no rows selected, otherwise use selected rows
    const dataToExport =
      selectedRows.length > 0
        ? selectedRows.map((i) => tableData[i])
        : filteredData;

    const tableRows = dataToExport.map((row) =>
      actualColumns.map((col) =>
        col === "enabled" ? (row[col] ? "Enabled" : "Disabled") : row[col]
      )
    );

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [0, 128, 128] },
    });

    doc.save("table-data.pdf");
  };

  const handleDownloadExcel = () => {
    const exportData = paginatedData.map((row) => {
      const obj = {};
      actualColumns.forEach((col) => {
        obj[col] =
          col === "enabled" ? (row[col] ? "Enabled" : "Disabled") : row[col];
      });
      return obj;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "TableData");
    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    saveAs(blob, "table-data.xlsx");
  };

  const toggleRow = (index) => {
    const globalIndex = (currentPage - 1) * itemsPerPage + index;
    setSelectedRows((prev) =>
      prev.includes(globalIndex)
        ? prev.filter((i) => i !== globalIndex)
        : [...prev, globalIndex]
    );
  };

  const toggleAll = () => {
    const currentPageIndices = paginatedData.map(
      (_, i) => (currentPage - 1) * itemsPerPage + i
    );
    const allSelected = currentPageIndices.every((index) =>
      selectedRows.includes(index)
    );

    if (allSelected) {
      setSelectedRows((prev) =>
        prev.filter((index) => !currentPageIndices.includes(index))
      );
    } else {
      setSelectedRows((prev) => [...new Set([...prev, ...currentPageIndices])]);
    }
  };

  const handleBulkActionClick = () => {
    const selectedData = selectedRows.map((i) => tableData[i]);
    if (onBulkAction) {
      onBulkAction(selectedData);
    }
  };

  const handleDownloadCSV = () => {
    // Create CSV header
    const headers = actualColumns.map((col) =>
      col.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
    );

    // Create CSV rows
    const rows = paginatedData.map((row) =>
      actualColumns.map((col) => {
        const value =
          col === "enabled" ? (row[col] ? "Enabled" : "Disabled") : row[col];
        // Escape quotes and wrap in quotes if contains comma
        return typeof value === "string" &&
          (value.includes(",") || value.includes('"'))
          ? `"${value.replace(/"/g, '""')}"`
          : value;
      })
    );

    // Combine header and rows
    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    // Download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "table-data.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadJSON = () => {
    const exportData = paginatedData.map((row) => {
      const obj = {};
      actualColumns.forEach((col) => {
        obj[col] =
          col === "enabled" ? (row[col] ? "Enabled" : "Disabled") : row[col];
      });
      return obj;
    });

    const jsonContent = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "table-data.json");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className=" w-full mx-auto bg-gray-900 rounded-md mt-5 shadow-2xl border border-gray-600 overflow-hidden">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-gray-800 via-gray-900 to-black px-6 py-4 border-b border-gray-600">
        <div className="absolute inset-0 bg-gray-800/20 backdrop-blur-sm"></div>
        <div className="relative flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white tracking-wide">
              {tableTitle || "Dynamic Table"}
            </h2>
            <span className="px-2 py-1 bg-gray-700/60 rounded-full text-xs text-gray-300 font-medium">
              {totalItems} records
            </span>
          </div>
          <div className="flex gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-4 -translate-y-1/2 text-gray-400 z-10 w-4 h-4" />
              <input
                type="text"
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 pr-4 py-1 rounded-lg bg-gray-800/60 backdrop-blur-sm border border-gray-700 
               text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 
               focus:ring-cyan-500 focus:bg-gray-800 transition-all duration-300 text-sm w-full"
              />
            </div>

            <button
              className="cursor-pointer px-2 py-0.5 rounded-md bg-cyan-600/80 hover:bg-cyan-500 backdrop-blur-sm border border-cyan-600/30 text-white text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2"
              onClick={handleDownloadCSV}
            >
              CSV
            </button>
            <button
              className="cursor-pointer px-2 py-0.5 rounded-md bg-cyan-600/80 hover:bg-cyan-500 backdrop-blur-sm border border-cyan-600/30 text-white text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2"
              onClick={handleDownloadPDF}
            >
              PDF
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-gray-900 w-full p-2 sm:p-4">
        <table className="w-full border-collapse table-auto">
          <thead>
            <tr className="bg-gradient-to-r from-gray-800 to-gray-700 border-b border-gray-600">
              {showCheckboxes && (
                <th className="py-2 px-4 text-center w-12">
                  <label className="relative inline-block">
                    <input
                      type="checkbox"
                      onChange={toggleAll}
                      checked={
                        paginatedData.length > 0 &&
                        paginatedData.every((_, i) =>
                          selectedRows.includes(
                            (currentPage - 1) * itemsPerPage + i
                          )
                        )
                      }
                      className="sr-only"
                    />
                    <div className="w-4 h-4 bg-gray-700 border border-gray-500 rounded flex items-center justify-center cursor-pointer hover:border-cyan-400 transition-colors">
                      {paginatedData.length > 0 &&
                        paginatedData.every((_, i) =>
                          selectedRows.includes(
                            (currentPage - 1) * itemsPerPage + i
                          )
                        ) && (
                          <svg
                            className="w-3 h-3 text-cyan-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                    </div>
                  </label>
                </th>
              )}
              {/* <th className="py-2 px-4 text-center w-16 text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Id
              </th> */}
              {/* <th className="py-2 px-4 text-center w-16 text-xs font-semibold text-gray-300 uppercase tracking-wider">
                SR NO
              </th> */}
              {actualColumns.map((col) => (
                <th
                  key={col}
                  className="py-2 px-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider cursor-pointer hover:text-cyan-400 transition-colors"
                  onClick={() => handleSort(col)}
                >
                  <div className="flex items-center gap-2">
                    {col
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-700">
            {paginatedData.map((row, i) => (
              <tr
                key={i}
                className={`group transition-all duration-200 hover:bg-gray-800 ${
                  showCheckboxes &&
                  selectedRows.includes((currentPage - 1) * itemsPerPage + i)
                    ? "bg-gray-800 shadow-sm border-l-2 border-cyan-400"
                    : i % 2 === 0
                    ? "bg-gray-900"
                    : "bg-gray-850"
                }`}
              >
                {showCheckboxes && (
                  <td className="py-2 px-4 text-center">
                    <label className="relative inline-block">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(
                          (currentPage - 1) * itemsPerPage + i
                        )}
                        onChange={() => toggleRow(i)}
                        className="sr-only"
                      />
                      <div className="w-4 h-4 bg-gray-700 border border-gray-500 rounded flex items-center justify-center cursor-pointer hover:border-cyan-400 transition-colors">
                        {selectedRows.includes(
                          (currentPage - 1) * itemsPerPage + i
                        ) && (
                          <svg
                            className="w-3 h-3 text-cyan-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </label>
                  </td>
                )}
                {/* <td className="py-2 px-4 text-center">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-red-700 text-gray-300 rounded-full text-xs font-medium">
                    {(currentPage - 1) * itemsPerPage + i + 1}
                  </span>
                </td> */}
                {actualColumns.map((col) => (
                  <td key={col} className="py-2 px-4 text-gray-200 text-sm">
                    <div className="flex items-center">
                      {col === "enabled" ? (
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            row[col]
                              ? "bg-green-900/30 text-green-400"
                              : "bg-red-900/30 text-red-400"
                          }`}
                        >
                          {row[col] ? "Enabled" : "Disabled"}
                        </span>
                      ) : (
                        <span>{row[col]}</span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}

            {isLoading && (
              <tr>
                <td
                  colSpan={actualColumns.length + (showCheckboxes ? 2 : 1)}
                  className="py-8 text-center"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-4 border-gray-700 border-t-cyan-500 rounded-full animate-spin"></div>
                    <p className="text-gray-400 font-medium">Loading data...</p>
                  </div>
                </td>
              </tr>
            )}

            {!isLoading && error && (
              <tr>
                <td
                  colSpan={actualColumns.length + (showCheckboxes ? 2 : 1)}
                  className="py-8 text-center"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-red-400 font-medium">
                        Error loading data
                      </p>
                      <p className="text-gray-500 text-sm">{error}</p>
                    </div>
                  </div>
                </td>
              </tr>
            )}

            {!isLoading && !error && paginatedData.length === 0 && (
              <tr>
                <td
                  colSpan={actualColumns.length + (showCheckboxes ? 2 : 1)}
                  className="py-8 text-center"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-400 font-medium">
                        No matching records found
                      </p>
                      <p className="text-gray-500 text-sm">
                        Try adjusting your search criteria
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-3 bg-gray-800 border-t border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              Showing{" "}
              {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to{" "}
              {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
              results
            </span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 bg-gray-700 border border-gray-600 text-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 rounded transition-colors"
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 rounded transition-colors"
            >
              Prev
            </button>

            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              let pageNum;
              if (totalPages <= 5) pageNum = i + 1;
              else if (currentPage <= 3) pageNum = i + 1;
              else if (currentPage >= totalPages - 2)
                pageNum = totalPages - 4 + i;
              else pageNum = currentPage - 2 + i;

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    currentPage === pageNum
                      ? "bg-cyan-600 text-white"
                      : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 rounded transition-colors"
            >
              Next
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 rounded transition-colors"
            >
              Last
            </button>
          </div>
        </div>
      )}

      {/* Footer selection info */}
      {showCheckboxes && selectedRows.length > 0 && (
        <div className="px-6 py-2 bg-gray-800 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">
              <strong>{selectedRows.length}</strong> record
              {selectedRows.length !== 1 ? "s" : ""} selected across all pages
            </span>
            <div className="flex gap-2">
         {   onBulkAction &&  <button
                onClick={handleBulkActionClick}
                className="px-3 py-1 text-xs bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 rounded-lg transition-colors"
              >
                {bulkActionLabel}
              </button>}
              <button
                className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
                onClick={() => setSelectedRows([])}
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
